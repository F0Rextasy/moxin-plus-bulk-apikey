<div align="center">

```
███╗   ███╗ ██████╗ ██╗  ██╗██╗███╗   ██╗
████╗ ████║██╔═══██╗╚██╗██╔╝██║████╗  ██║
██╔████╔██║██║   ██║ ╚███╔╝ ██║██╔██╗ ██║
██║╚██╔╝██║██║   ██║ ██╔██╗ ██║██║╚██╗██║
██║ ╚═╝ ██║╚██████╔╝██╔╝ ██╗██║██║ ╚████║
╚═╝     ╚═╝ ╚═════╝ ╚═╝  ╚═╝╚═╝╚═╝  ╚═══╝
```

# moxin-plus-bulk-apikey

**Bulk-create Moxin Plus (墨信AI) accounts with auto-generated API keys — OpenAI-compatible inference + [9Router](https://9router.com) connector.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-128%20served-412991?style=for-the-badge)](https://www.moxin.plus/pricing)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 Quick start](#-quick-start) · [🎁 Free tier](#-free-tier--how-much-you-get) · [🤖 Models](#-models--all-128-of-them) · [🧪 Use the API](#-how-to-use-the-api) · [✅ Verified](#-verified-working--every-key-is-tested) · [🧭 How it works](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [⚙️ Options](#️-cli-options) · [🛰️ Proxies](#️-behind-a-proxy) · [🐞 Issues](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ Why this exists

Moxin Plus is the `www.moxin.plus` host of the 墨信AI family — a **new-api fork** (`v1.0.0-rc.44`, `system_name 墨信AI`) with **no captcha** (`turnstile_check=false`) and a plain e-mail-code sign-up, but **no sign-up bonus**. What makes an account worth having is the **daily check-in**: `POST /api/user/checkin` paid one overdrawn account (`quota -97`) **201 373 quota back in a single call**, and across our ten accounts it paid **134 516 … 492 798 quota (≈ $0.27–$0.99, median ≈ $0.72)** at `quota_per_unit 500000`. The catalogue behind it is **128 live ids** (DeepSeek · Gemini · Claude · Qwen · MiniMax · Kimi · Grok) served OpenAI-compatible on `https://www.moxin.plus/v1`. Its sibling host `www.moxin.studio` (`rc.45`, `price 1`) is a **separate database** — a key minted here answers `Invalid token` there, and vice versa.

## 🎁 Free tier — how much you get

**No sign-up bonus — one check-in per account per day is the funding rail.**

| What | Value |
| --- | --- |
| Sign-up bonus | **none** — a fresh account starts at `quota 0`; the tool registers the account and checks it in immediately |
| Daily check-in | `POST /api/user/checkin` → `{"checkin_date":"2026-10-22","quota_awarded":492798}`; measured awards across ten accounts **134 516 … 492 798 quota ≈ $0.27–$0.99 (median ≈ $0.72)**; a second call the same day answers `Already checked in today` — the panel day is UTC+8 |
| Card / phone | **none** at any step |
| Captcha | **none** (`turnstile_check=false`) — plain HTTP, no browser, no solver |
| E-mail | `email_verification=true`, 6-hex code, ~10 min TTL; Gmail-class boxes (the public gmail pool works); a recycled box that already has an account answers `Email address is already in use` and the tool takes a fresh one |
| Catalogue | 141 pricing rows, **128 ids** on a verified keys, **0 strict-free** rows (`model_ratio 0` + `model_price 0`) — the check-in credit is what you spend |
| Groups | `default` (128 rows) · `次卡` (70) · `国产模型` · `DeepSeek[羊毛]` · `Claude[特价/折扣/高质/精品]` · `GPT[折扣/高质/生图]` · `Gemini[官转/高质/折扣/特价]` · `Grok[官转/折扣]` · `Codex[…]` |
| Expiry | the check-in credit does not expire; no published per-key rate limit |

> 💡 The free tier is set by Moxin Plus and can change. Check the live numbers at [www.moxin.plus](https://www.moxin.plus) — and let the tool's own gate decide:

```bash
node src/cli.js --verify     # every key in keys.txt is re-tested with two real chat calls
```

## 🤖 Models — all 128 of them

`GET /v1/models` answered **128 ids** on a verified keys (2026-10-21). Catalogue ids are group-tagged (`[次]deepseek-v4.1-flash`, `[vertex次特价]gemini-4-argon`) and the **unprefixed id also resolves**; this was chat-verified end to end:

| Model ID | note |
| --- | --- |
| `deepseek-v4.1-flash` | the verification default — 200 `"MX-PONG"`, then `17*3 → 51`, re-proved through independent exits |

> ⚠️ **The `[次]` trap.** 33 of the visible ids are tagged as per-call (`[次]…`, `[特价次卡]…`), and the pricing feed marks **70 of its 141 rows `quota_type=1` — a per-call USD price instead of a per-token ratio**. Measured on one account through one exit (2026-10-21): `[次]deepseek-v4.1-flash` answered 200 `"MX-PONG"` but burned **24 000 quota (≈ $0.048) per call**, while the plain `deepseek-v4.1-flash` answered the identical thing for **150 quota (≈ $0.0003)** — a **160× difference per call for the same answer**. Pin the plain id in your router and keep `[次]` ids out of automatic combos.

The `/api/pricing` feed lists 141 rows: `deepseek-v4-flash`, `gemini-2.5-flash-lite`, `claude-haiku-4-5`, `qwen3.7-max`, `MiniMax-M3`, `kimi-k3`, `grok-4.7` and more, each in one or more of the groups above.

## 🧪 How to use the API

Base URL **`https://www.moxin.plus/v1`** — OpenAI-compatible:

```bash
curl --fail-with-body https://www.moxin.plus/v1/chat/completions \
  -H "Authorization: Bearer $MOXIN_PLUS_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"deepseek-v4.1-flash","messages":[{"role":"user","content":"Reply with the single word: ok"}]}'
```

```python
from openai import OpenAI
c = OpenAI(base_url="https://www.moxin.plus/v1", api_key="YOUR_KEY")
print(c.chat.completions.create(model="deepseek-v4.1-flash",
      messages=[{"role": "user", "content": "hi"}]).choices[0].message.content)
```

Top the key up by checking in — that call takes the **session token**, not the API key: `POST /api/user/checkin` with `Authorization: Bearer <access_token>`.

## 🛠 Quick start

```bash
# clone or fork this repository, then:
cd moxin-plus-bulk-apikey

# 1) your proxy list, one per line (http://, https:// CONNECT, socks5:// or bare host:port) — optional
printf 'socks5://127.0.0.1:1080\n' > proxies.txt   # optional — without it the tool runs direct

# 2) go
node src/launcher.js          # interactive: mint / verify / screen / settings / connect 9Router
# or directly:
node src/cli.js --count 10 --pool proxies.txt   # 10 accounts, one exit per account
```

`keys.txt` (written under `src/`, git-ignored) is written **only** after the live two-prompt gate; `accounts.jsonl` keeps the check-in evidence (`quotaBefore` → `quotaAwarded` → `quota`) so any dry account can be revived later with `--revive` — for free.

### 🖱️ The launcher

The launcher asks for the proxy list (optional — without one the CLI runs direct), the account count and the verification model, remembers them in `launcher.config.json`, and runs the CLI: mint, verify, screen proxies, settings, help, and *Connect to 9Router*.

## ✅ Verified working — every key is tested

All checks below were re-run on **2026-10-21/22** from the exit pool (no WARP):

| Check | Result |
| --- | --- |
| `GET /api/status` | **200** — `system_name 墨信AI`, `v1.0.0-rc.44`, `price 0.5`, `quota_per_unit 500000`, `register_enabled`+`password_register_enabled` true, `email_verification=true`, **`turnstile_check=false`**, `checkin_enabled=true` |
| registration | **✔** `GET /api/verification?email=<gmail>` 200 → code from the inbox → `POST /api/user/register {username,password,password2,email,verification_code}` 200 |
| check-in funding | **✔** `POST /api/user/checkin` → `{"checkin_date":"2026-10-22","quota_awarded":492798}` ⇒ `quota -2 223 → 490 575`; the same rail refilled five accounts — four of them from a negative quota (`-27`, `-1 369`, `-2 223`, `-10 682`) — and funded the four fresh ones at registration |
| key | **✔** `POST /api/token/` → `GET /api/token/?p=0&size=20` → **`POST /api/token/{id}/key`** reveals the full key (every read route masks it) |
| live chat | **✔** `deepseek-v4.1-flash` → 200 `"MX-PONG"` and `17*3 → 51`, re-proved through independent exits |
| group trap | **✔** a fresh token can land in `DeepSeek[羊毛]` where chat answers **403** — `PUT /api/token/ {group:"default", unlimited_quota:true}` fixes it and the tool re-checks before it trusts a key |
| scale | **verified**; six older accounts came back for free with one check-in each, four were minted fresh |
| per-call trap | **✔** measured: `[次]` id **24 000 quota/call** vs **150 quota** for the plain id — same 200 |

Re-check at any time:

```bash
node src/cli.js --verify     # writes src/verify-report.json
```

## 🧭 How it works

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: Moxin Plus page → e-mail address → code from the inbox
   ├─▶ session: the account's access token in hand
   ├─▶ funding: POST /api/user/checkin → the daily credit
   ├─▶ key mint: the account's token endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://www.moxin.plus/v1/chat/completions → real content = the key is live
```

| Step | Call | Notes |
| --- | --- | --- |
| mailbox | public Gmail pool | the panel accepts Gmail-class addresses; a **recycled** box can already exist on the panel (`Email address is already in use`) — the tool retries with a fresh box |
| code | `GET /api/verification?email=…` then read the inbox | ⚠ the brand filter must key on the **SENDER** (`moxin\|studio\|墨信`): the shared inboxes also carry other panels' codes, and a generic "verification code" subject is not evidence — the code mail carries the panel's own `墨信AI` sender |
| register | `POST /api/user/register {username,password,password2,email,verification_code}` | the response may carry its own `access_token`; otherwise `POST /api/user/login {username,password}` (username or e-mail both work) |
| fund | `POST /api/user/checkin` | the whole point: `quota_awarded ≈ 134 516 … 492 798` per account per day |
| key | `POST /api/token/` → list → `POST /api/token/{id}/key` | this fork masks the key in every read; the `/{id}/key` route reveals it |
| group | `PUT /api/token/ {group:"default", unlimited_quota:true}` | a minted token can land in a group that refuses the model (403) — the tool re-groups and re-proves |
| gate | `POST /v1/chat/completions` | a key is written to `keys.txt` only after real content comes back (two prompts: `MX-PONG`, then `17*3 → 51`) |

## ⚙️ CLI options

```bash
node src/cli.js --count 5                    # five accounts, serial: e-mail code → check-in → key → 2-prompt gate
node src/cli.js --revive                     # re-fund + re-prove every account in accounts.jsonl
node src/cli.js --verify                     # re-test every key in keys.txt → src/verify-report.json
node src/cli.js --screen                     # test the --pool exits against the panel (creates nothing)
node src/cli.js --pool proxies.txt           # optional exit pool (http/https CONNECT + socks5), one exit per call
node src/cli.js --model deepseek-v4-flash    # model used for the live gate
node src/cli.js --alt-models deepseek-v4-flash,gemini-2.5-flash   # fallbacks when the gate model is down
node src/cli.js --code-wait 480000           # the panel's SMTP can be slow (code TTL 10 min)
node src/cli.js --timeout 25000              # per-request timeout
node src/cli.js --connect-9router --router9 http://localhost:20128 --password 123456
node src/cli.js --help
```

| Environment variable | Default | Meaning |
| --- | --- | --- |
| `MOXIN_BASE` | `https://www.moxin.plus` | panel base URL |
| `MOXIN_PLUS_PROXIES` (or `MOXIN_PROXIES`) | `proxies.txt` | exit pool, one line per exit — optional; without a pool the CLI connects directly |

## 🛰️ Behind a proxy

**Optional — recommended at scale.** `--pool <file>` (or `MOXIN_PLUS_PROXIES`) accepts one exit per line — `http://host:port`, `https://host:port` (CONNECT) or `socks5://host:port` (with optional `user:pass@`) — and the tool takes one exit per account. Without a pool it prints the direct-mode note and connects directly: sign-up, check-in and verify are unchanged, only where the packets leave from. `--screen` tests your exits against the panel before a run (no account is created).

## 📄 Files

| Path | Contents |
| --- | --- |
| `src/keys.txt` | one live-verified key per line — git-ignored, never committed |
| `src/accounts.jsonl` | e-mail, password, key, check-in evidence (`quotaBefore` / `quotaAwarded` / `quota`), model, exit — local only |
| `proxies.txt` | your exits, one per line — git-ignored |
| `src/verify-report.json` | the last `--verify` result — git-ignored |
| `launcher.config.json` | what the launcher remembers — git-ignored |

## 🔌 Connect to 9Router

[9Router](https://9router.com) is a self-hosted, OpenAI-compatible router. Moxin Plus serves an OpenAI-compatible endpoint, so register it once and every key becomes a connection under one provider-node:

```bash
node src/connect-9router.js \
  --base http://localhost:20128 --password 123456 \
  --api-key YOUR_KEY
```

Run it without `--api-key` to register **every** key in `keys.txt`. Re-running is idempotent: the node is matched by `--prefix moxin-plus`, each connection by name (`moxin-plus-001`, `moxin-plus-002`, …). Defaults: `--base http://localhost:20128`, `--password 123456`, `--name "Moxin Plus"`, `--prefix moxin-plus`, `--base-url https://www.moxin.plus/v1`, `--model deepseek-v4.1-flash`. Models are then served as `moxin-plus/<model id>` — pin a **plain** id, not a `[次]` one (see the trap above).

## 🔑 What one key gets you

| | |
| --- | --- |
| 🏢 Provider | **Moxin Plus (墨信AI)** — [www.moxin.plus](https://www.moxin.plus) |
| 🎁 What the provider gives | **no sign-up bonus** — the daily check-in pays **≈$0.27–$0.99 per account per day** (median ≈ $0.72) |
| 🔑 What one key gets you | the 128-id catalogue on `https://www.moxin.plus/v1`, funded by that account's check-in credit |
| 📦 This repo | **keys verified** on 2026-10-21/22 |
| 🌐 API shape | OpenAI-compatible: `POST https://www.moxin.plus/v1/chat/completions` |
| 🛡️ Gates | **no captcha**, e-mail code only; sender-brand filter required on the shared mailboxes |
| 🔒 Your data | only `www.moxin.plus` and the mailbox service are contacted; keys never leave your machine |

## 🐞 Issues

If the panel changes its register/check-in routes, its e-mail policy or the catalogue, the tool stops there and says so. **[Open an issue](../../issues)** with the command and the exact output.

## 📄 License

MIT © 2026 — see [LICENSE](LICENSE).

<div align="center">

**[MIT](LICENSE)** © 2026 moxin-plus-bulk-apikey contributors

</div>
