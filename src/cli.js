#!/usr/bin/env node
'use strict';
/**
 * www.moxin.plus ("墨信AI") — zero-dependency bulk-account / key / revive CLI.
 *
 * The panel is a new-api fork (v1.0.0-rc.44) with **no captcha** (`turnstile_check=false`), e-mail
 * verification and **daily check-in funding** (no sign-up bonus): `POST /api/user/checkin` paid
 * {"quota_awarded":325929} and {"quota_awarded":466851} on 2026-10-21 (≈ $0.65–$0.93 at
 * quota_per_unit 500000), so one account is worth one day's check-in — and an **overdrawn** account
 * (chat: "Insufficient user quota") comes back for free with a single call.
 *
 *   node src/cli.js --count 3                    # register -> checkin -> token -> chat-200 -> keys.txt
 *   node src/cli.js --revive                     # re-fund + re-prove the accounts already in accounts.jsonl
 *   node src/cli.js --verify                     # re-verify every key in keys.txt (two prompts each)
 *   node src/cli.js --screen                     # test which --pool exits can reach the panel (no accounts)
 *   node src/cli.js --pool proxies.txt           # optional: rotate exits (http/https CONNECT + socks5)
 *   node src/cli.js --connect-9router            # register the provider on a local 9Router
 *
 * Trap this panel taught the fleet: a fresh token can land in `DeepSeek[羊毛]`, where chat answers
 * 403 — the gate re-sets the token group (PUT /api/token/) onto a group whose pricing row serves the
 * model and flips `unlimited_quota` on, so the key is not capped by the token's own remain_quota.
 *
 * Nothing here needs a browser, a captcha solver or a third-party npm package.
 */
const fs = require('fs');
const path = require('path');
const net = require('net');
const tls = require('tls');
const http = require('http');
const https = require('https');
const os = require('os');
const { spawnSync } = require('child_process');

const HERE = __dirname;
const BASE = (process.env.MOXIN_BASE || 'https://www.moxin.plus').replace(/\/$/, '');
const KEYS = path.join(HERE, 'keys.txt');
const ACCOUNTS = path.join(HERE, 'accounts.jsonl');
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36';
const MAILBOX_API = 'https://www.emailnator.com';

const argv = process.argv.slice(2);
const has = (n) => argv.includes('--' + n) || argv.some((a) => a.startsWith('--' + n + '='));
const one = (n, d) => { const i = argv.indexOf('--' + n); return i === -1 ? d : argv[i + 1]; };
const COUNT = parseInt(one('count', '1'), 10);
const MODEL = one('model', 'deepseek-v4.1-flash');
const ALT_MODELS = one('alt-models', 'deepseek-v4-flash,gemini-2.5-flash,claude-haiku-4-5,qwen3.7-max').split(',').filter(Boolean);
const POOL_FILE = one('pool', process.env.MOXIN_PLUS_PROXIES || process.env.MOXIN_PROXIES || '');
const TIMEOUT_MS = parseInt(one('timeout', '25000'), 10);
const CODE_WAIT_MS = parseInt(one('code-wait', '420000'), 10); // the panel's SMTP can be slow (code TTL 10 min)

const log = (...a) => console.log(new Date().toISOString().slice(11, 19), ...a);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ------------------------------------------------------------------ proxy plumbing (optional)
function parseProxy(line) {
  const m = /^(?:(socks5|socks4|https?):\/\/)?(?:([^:@/]+):([^@/]+)@)?([^:/]+):(\d+)$/.exec(String(line).trim());
  if (!m) return null;
  return { proto: (m[1] || 'http').toLowerCase(), user: m[2] || '', pass: m[3] || '', host: m[4], port: Number(m[5]) };
}
const pool = (() => {
  if (!POOL_FILE) return [];
  try { return fs.readFileSync(POOL_FILE, 'utf8').split(/\r?\n/).map(parseProxy).filter(Boolean); } catch { return []; }
})();
let poolIdx = 0;
function nextExit() { if (!pool.length) return null; const e = pool[poolIdx++ % pool.length]; return e; }

function openTunnel(proxy, host, port) {
  return new Promise((resolve, reject) => {
    const sock = net.connect({ host: proxy.host, port: proxy.port });
    const fail = (e) => { try { sock.destroy(); } catch { /* noop */ } reject(e); };
    sock.setTimeout(TIMEOUT_MS, () => fail(new Error('proxy timeout')));
    sock.once('error', fail);
    sock.once('connect', () => {
      if (proxy.proto.startsWith('socks')) {
        const target = Buffer.from(host);
        const req = proxy.user
          ? Buffer.concat([Buffer.from([5, 1, 2]), Buffer.from([1, proxy.user.length]), Buffer.from(proxy.user), Buffer.from([proxy.pass.length]), Buffer.from(proxy.pass)])
          : Buffer.from([5, 1, 0]);
        sock.write(req);
        let stage = 0;
        const onData = (b) => {
          if (stage === 0) {
            if (b[1] === 2) { sock.removeListener('data', onData); fail(new Error('socks5 wants auth but none given')); return; }
            if (b[1] !== 0) { sock.removeListener('data', onData); fail(new Error('socks5 method ' + b[1])); return; }
            stage = 1;
            sock.write(Buffer.concat([Buffer.from([5, 1, 0, 3, target.length]), target, Buffer.from([port >> 8, port & 0xff])]));
          } else if (stage === 1) {
            if (b[1] !== 0) { sock.removeListener('data', onData); fail(new Error('socks5 connect ' + b[1])); return; }
            const replyLen = 4 + (b[3] === 1 ? 4 : b[3] === 4 ? 16 : 1 + b[4]) + 2;
            if (b.length < replyLen) return; // wait for the full reply
            sock.removeListener('data', onData);
            sock.setTimeout(0);
            resolve(sock);
          }
        };
        sock.on('data', onData);
        return;
      }
      sock.write(`CONNECT ${host}:${port} HTTP/1.1\r\nHost: ${host}:${port}\r\n${proxy.user ? `Proxy-Authorization: Basic ${Buffer.from(`${proxy.user}:${proxy.pass}`).toString('base64')}\r\n` : ''}Connection: keep-alive\r\n\r\n`);
      let buf = '';
      const onData = (b) => {
        buf += b.toString('latin1');
        if (!buf.includes('\r\n\r\n')) return;
        sock.removeListener('data', onData);
        if (!/^HTTP\/1\.[01] 2\d\d/.test(buf)) { fail(new Error('CONNECT ' + buf.split('\r\n')[0])); return; }
        sock.setTimeout(0);
        resolve(sock);
      };
      sock.on('data', onData);
    });
  });
}

/** tiny HTTP(S) JSON client: direct by default, through the pool when one is configured */
async function reqOnce(method, url, { body, headers = {}, exit = null } = {}) {
  const u = new URL(url);
  const payload = body === undefined ? null : Buffer.from(JSON.stringify(body));
  const baseHeaders = {
    accept: 'application/json, text/plain, */*',
    'user-agent': UA,
    origin: u.origin,
    referer: u.origin + '/',
    ...(payload ? { 'content-type': 'application/json', 'content-length': payload.length } : {}),
    ...headers,
  };
  const proxy = exit || nextExit();
  if (!proxy) { // direct
    const mod = u.protocol === 'https:' ? https : http;
    return new Promise((resolve, reject) => {
      const r = mod.request({ method, host: u.hostname, port: u.port || (u.protocol === 'https:' ? 443 : 80), path: u.pathname + u.search, headers: baseHeaders, timeout: TIMEOUT_MS }, (res) => {
        let t = ''; res.setEncoding('utf8');
        res.on('data', (c) => { t += c; });
        res.on('end', () => resolve({ status: res.statusCode, text: t }));
      });
      r.on('timeout', () => r.destroy(new Error('timeout')));
      r.on('error', reject);
      if (payload) r.write(payload);
      r.end();
    });
  }
  const sock = await openTunnel(proxy, u.hostname, u.port || (u.protocol === 'https:' ? 443 : 80));
  return new Promise((resolve, reject) => {
    const onSock = (s) => {
      s.write(`${method} ${u.pathname}${u.search} HTTP/1.1\r\nHost: ${u.hostname}\r\nConnection: close\r\n${Object.entries(baseHeaders).map(([k, v]) => `${k}: ${v}`).join('\r\n')}\r\n\r\n`);
      if (payload) s.write(payload);
      let t = '';
      s.setEncoding('utf8');
      s.on('data', (c) => { t += c; });
      s.on('end', () => {
        const idx = t.indexOf('\r\n\r\n');
        const head = idx === -1 ? t : t.slice(0, idx);
        const bodyText = idx === -1 ? '' : t.slice(idx + 4);
        const status = Number((/^HTTP\/1\.[01] (\d+)/.exec(head) || [])[1] || 0);
        resolve({ status, text: bodyText });
      });
      s.on('error', reject);
    };
    if (u.protocol === 'https:') { const t = tls.connect({ socket: sock, servername: u.hostname }, () => onSock(t)); t.on('error', reject); }
    else onSock(sock);
  });
}

/** one dead exit must not kill a run: a failed attempt moves to the next pool exit (3 tries) */
async function req(method, url, opts = {}) {
  const tries = pool.length ? 3 : 1;
  let lastErr;
  for (let i = 0; i < tries; i++) {
    const exit = (i === 0 && opts.exit) || nextExit();
    try { return await reqOnce(method, url, { ...opts, exit }); }
    catch (e) { lastErr = e; }
  }
  throw lastErr;
}
async function api(method, p, opts = {}) {
  const r = await req(method, BASE + p, opts);
  let json = null; try { json = JSON.parse(r.text); } catch { /* not json */ }
  return { ...r, json };
}

// ------------------------------------------------------------------ mailbox (public gmail pool)
async function newGmail(exit) {
  const r = await req('POST', `${MAILBOX_API}/api/generate-email`, { body: { ids: [3] }, exit });
  const j = JSON.parse(r.text);
  const plain = String(j.email || j.address || '').replace(/\.(?=[^@]*@)/g, '');
  if (!plain.includes('@')) throw new Error('mailbox: ' + r.text.slice(0, 80));
  return plain;
}
async function inbox(address, exit) {
  // emailnator: POST /api/message-list {email,limit} -> json.messages[]; GET /api/message/<id> -> json.content
  const r = await req('POST', `${MAILBOX_API}/api/message-list`, { body: { email: address, limit: 20 }, exit });
  let j = null; try { j = JSON.parse(r.text); } catch { return []; }
  const rows = j.messages || [];
  const out = [];
  for (const m of rows.slice(0, 10)) {
    let body = String(m.content || m.preview || '');
    try {
      const d = await req('GET', `${MAILBOX_API}/api/message/${encodeURIComponent(m.id)}`, { exit });
      const jd = JSON.parse(d.text);
      body = String(jd.content || jd.html || jd.text || body);
    } catch { /* keep the preview */ }
    out.push({ from: m.from || '', subject: m.subject || '', body });
  }
  return out;
}

/** the brand filter that took two lanes to learn: match the SENDER (a recycled box carries other panels' mail) */
const OURS = (m) => /moxin|studio|墨信/i.test(String(m.from)) || /moxin|studio|墨信/i.test(String(m.subject));
function codeOf(text) {
  const t = String(text).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
  const m = /验证码为[:：]?\s*([A-Za-z0-9]{4,8})/.exec(t) || /code[^0-9a-z]{0,20}([A-Za-z0-9]{4,8})/i.exec(t) || /\b([0-9a-f]{6})\b/i.exec(t) || /\b(\d{6})\b/.exec(t);
  return m ? m[1] : null;
}

// ---------------------------------------------------- account ops (the revive rail this panel taught us)
const authOf = (t) => ({ authorization: `Bearer ${t}` });
const proxyLabel = (exit) => (exit ? `${exit.proto}://${exit.host}:${exit.port}` : 'direct');

async function loginApi(username, password, exit) {
  const li = await api('POST', '/api/user/login', { body: { username, password }, exit });
  const token = li.json && li.json.data && li.json.data.access_token;
  return { ok: !!token, token, li };
}
const selfApi = (t, exit) => api('GET', '/api/user/self', { headers: authOf(t), exit });
const checkinApi = (t, exit) => api('POST', '/api/user/checkin', { headers: authOf(t), exit });
async function tokenItems(t, exit) {
  const l = await api('GET', '/api/token/?p=0&size=20', { headers: authOf(t), exit });
  const items = (l.json && l.json.data && (l.json.data.items || l.json.data)) || [];
  return Array.isArray(items) ? items : [];
}
/** always read the key from the panel: a stored key can be stale after a rotate */
async function currentKey(t, item, exit) {
  if (item && item.id) {
    const rev = await api('POST', `/api/token/${item.id}/key`, { headers: authOf(t), exit });
    const k = rev.json && rev.json.data && (rev.json.data.key || rev.json.data);
    if (typeof k === 'string' && k && !k.includes('*')) return k;
  }
  const k = item && (item.key || item.token);
  return k && !String(k).includes('*') ? String(k) : null;
}
/** groups whose pricing row actually serves MODEL (the panel's own answer, not a guess) */
async function modelGroups(t, exit) {
  const pr = await api('GET', '/api/pricing', { headers: authOf(t), exit });
  const rows = (pr.json && pr.json.data) || [];
  const cand = [];
  for (const r of (Array.isArray(rows) ? rows : [])) {
    if (r && String(r.model_name || '').includes(MODEL)) for (const g of (r.enable_groups || [])) if (!cand.includes(g)) cand.push(g);
  }
  for (const g of ['default', 'vip', 'svip']) if (!cand.includes(g)) cand.push(g);
  return cand;
}
async function chatOnce(key, prompt, exit, model = MODEL) {
  const c = await api('POST', '/v1/chat/completions', {
    headers: { authorization: `Bearer ${key}` }, exit,
    body: { model, messages: [{ role: 'user', content: prompt }], max_tokens: 64, stream: false },
  });
  const ch = c.json && c.json.choices && c.json.choices[0];
  const msg = (ch && ch.message) || {};
  const content = msg.content || msg.reasoning_content || (ch && ch.text);
  const err = c.json && c.json.error && String(c.json.error.message || c.json.error);
  return { status: c.status, content: content ? String(content) : null, err: err || null };
}
/**
 * Two different prompts on the first model that answers; the second is a determinism check
 * (17*3 -> 51) so an empty-but-200 relay cannot pass. Falls back to the alt-model list.
 */
async function sanity2(key, exit) {
  const prompts = [];
  for (const model of [MODEL, ...ALT_MODELS]) {
    const a = await chatOnce(key, 'Reply with exactly: MX-PONG', exit, model);
    if (!a.content) { prompts.push({ model, prompt: 'MX-PONG', ...a }); continue; }
    const b = await chatOnce(key, 'What is 17*3? Reply with just the number.', exit, model);
    prompts.push({ model, prompt: 'MX-PONG', ...a }, { model, prompt: '17*3', ...b });
    return { live: !!(b.content && /51/.test(b.content)), model, prompts };
  }
  return { live: false, model: null, prompts };
}
/**
 * Prove a key. When the panel pinned its token into a group that refuses the model (chat 403 —
 * measured: `DeepSeek[羊毛]`), re-set the group via PUT /api/token/ and flip `unlimited_quota`
 * so the key is not capped by the token's own remain_quota.
 */
async function proveKey(t, item, key, { regroup = true } = {}) {
  const s = await sanity2(key);
  if (s.live || !regroup || !t || !item) return { key, group: item && item.group, sanity: s, groupChanges: [] };
  const changes = [];
  for (const g of (await modelGroups(t)).slice(0, 8)) {
    await api('PUT', '/api/token/', { headers: authOf(t), body: { ...item, group: g, unlimited_quota: true } });
    const s2 = await sanity2(key);
    changes.push({ group: g, chat: s2.prompts[0].status, content: s2.prompts[0].content ? String(s2.prompts[0].content).slice(0, 40) : s2.prompts[0].err });
    log(`set-group ${g} -> ${s2.live ? 'LIVE' : (s2.prompts[0].err || s2.prompts[0].status)}`);
    if (s2.live) return { key, group: g, sanity: s2, groupChanges: changes };
  }
  return { key, group: item && item.group, sanity: s, groupChanges: changes };
}
function readAccounts() {
  if (!fs.existsSync(ACCOUNTS)) return [];
  return fs.readFileSync(ACCOUNTS, 'utf8').split(/\r?\n/).map((s) => s.trim()).filter(Boolean)
    .map((s) => { try { return JSON.parse(s); } catch { return null; } }).filter(Boolean);
}
function appendKeyUnique(key) {
  const have = fs.existsSync(KEYS) ? fs.readFileSync(KEYS, 'utf8').split(/\r?\n/).map((s) => s.trim()) : [];
  if (have.includes(key)) return false;
  fs.appendFileSync(KEYS, key + '\n');
  return true;
}
/**
 * `--revive`: the 2026-10-19 wave wired its keys and drained the accounts to a negative quota
 * (chat: "Insufficient user quota"). Nothing is lost — a single check-in re-funds the account and
 * the same key works again; this walks every account in accounts.jsonl and re-proves it with 2 prompts.
 */
async function reviveAll() {
  const accts = readAccounts();
  const seen = new Set();
  const results = [];
  let live = 0;
  for (const a of accts) {
    const email = a.email;
    const username = a.user || a.username;
    const password = a.pass || a.password;
    if (!email || !username || !password || seen.has(email)) continue;
    seen.add(email);
    const exit = nextExit();
    try {
      const li = await loginApi(username, password, exit);
      if (!li.ok) { log(`revive ${email} login FAIL`, li.li.text.replace(/\s+/g, ' ').slice(0, 80)); results.push({ email, verdict: 'login-failed' }); continue; }
      const t = li.token;
      const s0 = await selfApi(t, exit);
      const q0 = s0.json && s0.json.data && s0.json.data.quota;
      const ci = await checkinApi(t, exit);
      const awarded = ci.json && ci.json.data && ci.json.data.quota_awarded;
      const s1 = await selfApi(t, exit);
      const q1 = (s1.json && s1.json.data && s1.json.data.quota) ?? q0;
      log(`revive ${email} quota ${q0} -> ${q1}`, awarded === undefined ? '(check-in already taken / refused)' : `check-in +${awarded}`);
      let items = await tokenItems(t, exit);
      if (!items.length) {
        await api('POST', '/api/token/', { headers: authOf(t), exit, body: { name: 'auto', remain_quota: 0, expired_time: -1, unlimited_quota: true, model_limits_enabled: false, model_limits: '', allow_ips: '', group: 'default' } });
        items = await tokenItems(t, exit);
      }
      if (!items.length) { results.push({ email, verdict: 'no-token' }); continue; }
      const item = items[0];
      let key = (await currentKey(t, item, exit)) || a.key;
      if (!key) { results.push({ email, verdict: 'no-key' }); continue; }
      if (!/^sk-/.test(key)) key = 'sk-' + key;
      const p = await proveKey(t, item, key);
      if (p.sanity.live) {
        live++;
        appendKeyUnique(key);
        fs.appendFileSync(ACCOUNTS, JSON.stringify({ ts: new Date().toISOString(), email, user: username, pass: password, key, quotaBefore: q0, quotaAwarded: awarded ?? null, quota: q1, model: MODEL, group: p.group, revive: true, sanity: '2/2', exit: proxyLabel(exit) }) + '\n');
      }
      log(`revive ${email}`, p.sanity.live ? 'LIVE 2/2' : 'NOT LIVE', 'group', p.group);
      results.push({ email, verdict: p.sanity.live ? 'live' : 'no-chat', quotaBefore: q0, quotaAwarded: awarded ?? null, quota: q1, group: p.group, key: String(key).slice(0, 12) + '…', groupChanges: p.groupChanges });
    } catch (e) {
      log(`revive ${email} ERROR`, String(e.message).slice(0, 60));
      results.push({ email, verdict: 'error', text: String(e.message).slice(0, 120) });
    }
  }
  const report = { at: new Date().toISOString(), host: BASE, model: MODEL, live, total: seen.size, results };
  fs.writeFileSync(path.join(HERE, 'revive-report.json'), JSON.stringify(report, null, 1));
  log(`revive done: ${live}/${seen.size} live · keys.txt ${fs.readFileSync(KEYS, 'utf8').split(/\r?\n/).filter(Boolean).length}`);
}

// ------------------------------------------------------------------ mint one account
async function mintOne(idx) {
  const exit = nextExit();
  let email = null;
  for (let k = 0; k < 12 && !email; k++) {
    try { email = await newGmail(nextExit()); } catch (e) { log(`#${idx} mailbox ${k}: ${String(e.message).slice(0, 60)}`); }
  }
  if (!email) throw new Error('no mailbox');
  const sent = await api('GET', `/api/verification?email=${encodeURIComponent(email)}`, { exit });
  log(`#${idx} send-code`, sent.text.replace(/\s+/g, ' ').slice(0, 90));
  if (!(sent.json && sent.json.success)) {
    if (/already in use|already taken/i.test(sent.text)) return null; // recycled box: caller retries
    throw new Error('send-code: ' + sent.text.slice(0, 80));
  }

  const t0 = Date.now();
  let code = null;
  while (Date.now() - t0 < CODE_WAIT_MS && !code) {
    await sleep(8000);
    try {
      for (const m of await inbox(email, exit)) if (OURS(m)) { const c = codeOf(`${m.subject} ${m.body}`); if (c) { code = c; break; } }
    } catch { /* keep polling */ }
  }
  if (!code) throw new Error('no code mail (sender-brand filter: moxin|studio|墨信)');
  log(`#${idx} code`, code, 'box', email);

  const user = email.split('@')[0].replace(/[^A-Za-z0-9._-]/g, '').slice(0, 16) + Math.floor(Math.random() * 900 + 100);
  const pass = `Mx!${Math.random().toString(36).slice(2, 9)}9Z`;
  let reg = null;
  for (const v of [code, code.toLowerCase(), code.toUpperCase()]) {
    reg = await api('POST', '/api/user/register', { body: { username: user, password: pass, password2: pass, email, verification_code: v }, exit });
    log(`#${idx} register`, reg.text.replace(/\s+/g, ' ').slice(0, 110));
    if (reg.json && reg.json.success) break;
  }
  if (!(reg.json && reg.json.success)) return null;

  let access = reg.json.data && reg.json.data.access_token;
  if (!access) {
    for (const who of [user, email]) {
      const li = await api('POST', '/api/user/login', { body: { username: who, password: pass }, exit });
      access = (li.json && li.json.data && li.json.data.access_token) || (li.json && li.json.access_token);
      if (access) break;
    }
  }
  if (!access) throw new Error('no session');
  const auth = { authorization: `Bearer ${access}` };

  const self = await api('GET', '/api/user/self', { headers: auth, exit });
  const q0 = self.json && self.json.data && self.json.data.quota;
  const ci = await api('POST', '/api/user/checkin', { headers: auth, exit });
  const awarded = ci.json && ci.json.data && ci.json.data.quota_awarded;
  log(`#${idx} checkin`, `quota ${q0} + ${awarded === undefined ? '?' : awarded}`);
  const self2 = await api('GET', '/api/user/self', { headers: auth, exit });
  const q1 = self2.json && self2.json.data && self2.json.data.quota;

  await api('POST', '/api/token/', { headers: auth, exit, body: { name: 'auto', remain_quota: 0, expired_time: -1, unlimited_quota: true, model_limits_enabled: false, model_limits: '', allow_ips: '', group: 'default' } });
  const items = await tokenItems(access, exit);
  if (!items.length) throw new Error('no token');
  const item = items[0];
  let key = await currentKey(access, item, exit);
  if (!key) throw new Error('no key');
  if (!/^sk-/.test(key)) key = 'sk-' + key;

  const p = await proveKey(access, item, key);
  log(`#${idx} sanity`, p.sanity.live ? `2/2 LIVE (${p.sanity.model})` : 'FAILED',
    p.sanity.prompts.map((x) => `${x.prompt}:${x.status}:${String(x.content || x.err || '').slice(0, 24)}`).join(' | '));
  if (!p.sanity.live) return null;
  key = p.key || key;
  appendKeyUnique(key);
  fs.appendFileSync(ACCOUNTS, JSON.stringify({ ts: new Date().toISOString(), email, user, pass, key, quotaBefore: q0, quotaAwarded: awarded ?? null, quota: q1, model: p.sanity.model || MODEL, group: p.group, sanity: '2/2', exit: proxyLabel(exit) }) + '\n');
  return { email, key, model: p.sanity.model || MODEL, group: p.group, quota: q1, awarded: awarded ?? null };
}

async function verifyKeys() {
  const keys = fs.existsSync(KEYS) ? fs.readFileSync(KEYS, 'utf8').split(/\r?\n/).map((s) => s.trim()).filter(Boolean) : [];
  const report = [];
  let live = 0;
  for (const key of keys) {
    const exit = nextExit();
    let s;
    try { s = await sanity2(key, exit); }
    catch (e) { s = { live: false, model: null, prompts: [{ prompt: 'ERR', status: 0, content: null, err: String(e.message).slice(0, 60) }] }; }
    if (s.live) live++;
    report.push({ key: String(key).slice(0, 12) + '…', live: s.live, model: s.model || null, prompts: s.prompts.map((x) => ({ prompt: x.prompt, status: x.status, out: String(x.content || x.err || '').slice(0, 40) })) });
    log(`verify ${key.slice(0, 12)}… ${s.live ? 'LIVE 2/2' : 'DEAD'} ${s.prompts.map((x) => `${x.prompt}=${x.status}:${String(x.content || x.err || '').slice(0, 20)}`).join(' | ')}`);
  }
  fs.writeFileSync(path.join(HERE, 'verify-report.json'), JSON.stringify({ at: new Date().toISOString(), host: BASE, live, total: keys.length, report }, null, 1));
  log(`verify done: ${live}/${keys.length} live -> verify-report.json`);
}

function connect9Router() {
  const base = one('router9', 'http://localhost:20128');
  const keys = fs.existsSync(KEYS) ? fs.readFileSync(KEYS, 'utf8').trim() : '';
  if (!keys) { log('keys.txt is empty — mint first'); return; }
  const tmp = path.join(os.tmpdir(), `moxin-keys-${Date.now()}.txt`);
  fs.writeFileSync(tmp, keys + '\n');
  const r = spawnSync('npx', ['--yes', '9router', 'add-provider', '--name', 'Moxin Plus', '--prefix', 'moxin-plus',
    '--base-url', `${BASE}/v1`, '--keys-file', tmp, '--base', base, '--password', one('password', '123456')], { stdio: 'inherit', shell: process.platform === 'win32' });
  if (r.status !== 0) log('9router add-provider failed — install 9router or pass --router9 <url>');
}

/** --screen: probe every exit in the pool for an answer from the panel (creates nothing, needs no key). */
async function screenPool() {
  const raw = fs.existsSync(POOL_FILE) ? fs.readFileSync(POOL_FILE, 'utf8').split(/\r?\n/).map((s) => s.trim()).filter(Boolean) : [];
  if (!raw.length) { log(`nothing to screen — pass --pool <file> or set MOXIN_PLUS_PROXIES (${POOL_FILE || 'unset'})`); return; }
  const okFile = POOL_FILE.replace(/(\.txt)?$/, '.ok.txt');
  const usable = [];
  for (const line of raw) {
    const exit = parseProxy(line);
    if (!exit) { log(`screen ${line} BAD LINE`); continue; }
    const t0 = Date.now();
    let row = { ok: false, note: '' };
    try {
      const r = await api('GET', '/api/status', { exit });
      const d = (r.json && r.json.data) || {};
      row = { ok: r.status === 200 && !!d.checkin_enabled, note: `${r.status} ${d.system_name || ''} ${d.version || ''}`.trim() };
    } catch (e) { row = { ok: false, note: String(e.message).slice(0, 60) }; }
    if (row.ok) usable.push(line);
    log(`screen ${proxyLabel(exit)} ${row.ok ? `OK ${Date.now() - t0}ms ${row.note}` : `FAIL ${row.note}`}`);
  }
  fs.writeFileSync(okFile, usable.length ? usable.join('\n') + '\n' : '');
  log(`screen done: ${usable.length}/${raw.length} usable -> ${path.basename(okFile)}`);
}
(async () => {
  if (has('help') || argv.includes('-h')) {
    console.log(`www.moxin.plus ("墨信AI", new-api) bulk-account CLI — zero dependencies, no captcha, no browser.

  node src/cli.js --count 3                     register accounts: e-mail code -> check-in (daily credit) -> token -> 2-prompt gate -> keys.txt
  node src/cli.js --revive                      re-fund + re-prove every account in accounts.jsonl (one check-in revives an overdrawn account)
  node src/cli.js --verify                      re-test every key in keys.txt (two prompts: MX-PONG, then 17*3 -> 51)
  node src/cli.js --screen                      test the --pool exits for an answer from the panel (no account is created)
  node src/cli.js --pool proxies.txt            optional exit pool (http/https CONNECT + socks5), exits rotate per call
  node src/cli.js --connect-9router             register the provider on a local 9Router (--router9 <url>, --password <pw>)

Flags: --count N --model <id> --alt-models a,b --timeout ms --code-wait ms --revive --verify --screen --pool <file> --help

Notes: the panel has NO captcha (turnstile_check=false) and NO sign-up bonus - funding is the daily
check-in (POST /api/user/checkin -> {"quota_awarded":325929} / {"quota_awarded":466851} measured on
2026-10-21 ~= $0.65-$0.93 at quota_per_unit 500000; the panel day is UTC+8). An account that ran dry
answers "Insufficient user quota, remaining quota: $-0.000..." - --revive pays it back for free.
Trap: a fresh token can land in DeepSeek[羊毛] where chat answers 403; the gate re-sets the token
group (PUT /api/token/) onto a group whose pricing row serves the model and turns
unlimited_quota on. Mailboxes: the public Gmail pool by default; a recycled box can already exist on
the panel ("Email address is already in use") - the CLI retries with a new box and only accepts mail
whose SENDER carries the brand (moxin|studio|墨信), because other panels' codes land in the same
inboxes. Per-call trap: ids tagged [次]/[特价次卡] bill PER CALL (measured 24 000 quota for
[次]deepseek-v4.1-flash vs 150 for the plain id) - pin the plain id in routers and combos.`);
    return;
  }
  const known = ['count', 'model', 'alt-models', 'timeout', 'code-wait', 'pool', 'router9', 'password', 'help', 'revive', 'verify', 'screen', 'connect-9router'];
  const stray = argv.filter((a) => a.startsWith('--') && !known.includes(a.replace(/^--/, '').split('=')[0]));
  if (stray.length) { console.error(`unknown flag(s): ${stray.join(' ')} — run with --help`); process.exit(2); }
  if (has('screen')) return screenPool();
  if (has('revive')) return reviveAll();
  if (has('verify')) return verifyKeys();
  if (has('connect-9router')) return connect9Router();
  const ok = [];
  for (let i = 1; i <= COUNT; i++) {
    let got = null;
    for (let t = 1; t <= 3 && !got; t++) {
      try { got = await mintOne(`${i}.${t}`); } catch (e) { log(`#${i}.${t} FAIL`, String(e.message).slice(0, 90)); }
      if (!got && t < 3) await sleep(5000);
    }
    if (got) { ok.push(got); log(`#${i} OK`, got.key.slice(0, 12) + '…', 'quota', got.quota, '(+' + got.awarded + ')'); }
    else log(`#${i} gave up`);
    if (i < COUNT) await sleep(15000);
  }
  log(`done: ${ok.length}/${COUNT} key(s) -> ${KEYS}`);
  for (const k of ok) log('  ', k.email, k.key.slice(0, 12) + '…', 'model', k.model, 'quota', k.quota);
})().catch((e) => { console.error('FAIL:', e.stack || e.message); process.exit(1); });
