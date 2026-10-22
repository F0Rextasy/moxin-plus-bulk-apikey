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

**批量创建 Moxin Plus（墨信AI）账户并自动生成 API 密钥 — 兼容 OpenAI 的推理 + [9Router](https://9router.com) 连接器。**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-128%20served-412991?style=for-the-badge)](https://www.moxin.plus/pricing)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![OmniRoute](https://img.shields.io/badge/OmniRoute-connector-8B5CF6?style=for-the-badge)](#-connect-to-omniroute)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 快速开始](#-quick-start) · [🎁 免费额度](#-free-tier--how-much-you-get) · [🤖 模型](#-models--all-128-of-them) · [🧪 使用 API](#-how-to-use-the-api) · [✅ 已验证](#-verified-working--every-key-is-tested) · [🧭 工作原理](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [⚙️ 选项](#️-cli-options) · [🛰️ 代理](#️-behind-a-proxy) · [🐞 问题反馈](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ 为什么会有这个项目

Moxin Plus 是墨信AI 家族中 `www.moxin.plus` 这个主机 — 一个 **new-api 分支**（`v1.0.0-rc.44`，`system_name 墨信AI`），**没有验证码**（`turnstile_check=false`），注册只需邮箱验证码，但**没有注册奖励**。让一个账户有价值的是**每日签到**：`POST /api/user/checkin` 让一个透支账户（`quota -97`）**一次调用就返还 201 373 额度**，而在我们的十个账户上，它发放了 **134 516 … 492 798 额度（≈ $0.27–$0.99，中位数 ≈ $0.72）**，`quota_per_unit 500000`。其背后的目录有 **128 个可用 id**（DeepSeek · Gemini · Claude · Qwen · MiniMax · Kimi · Grok），在 `https://www.moxin.plus/v1` 上以兼容 OpenAI 的方式提供服务。它的兄弟主机 `www.moxin.studio`（`rc.45`，`price 1`）是一个**独立的数据库** — 在这里生成的密钥在那里会返回 `Invalid token`，反之亦然。

## 🎁 免费额度 — 你能拿到多少

**没有注册奖励 — 每个账户每天一次签到就是资金来源。**

| 项目 | 值 |
| --- | --- |
| 注册奖励 | **无** — 新账户从 `quota 0` 开始；工具会注册账户并立即签到 |
| 每日签到 | `POST /api/user/checkin` → `{"checkin_date":"2026-10-22","quota_awarded":492798}`；在十个账户上实测发放 **134 516 … 492 798 额度 ≈ $0.27–$0.99（中位数 ≈ $0.72）**；同一天第二次调用会返回 `Already checked in today` — 面板的日期是 UTC+8 |
| 银行卡 / 手机 | 任何步骤都**不需要** |
| 验证码 | **无**（`turnstile_check=false`）— 纯 HTTP，无需浏览器，无需打码器 |
| 邮箱 | `email_verification=true`，6 位十六进制验证码，约 10 分钟有效期；Gmail 类邮箱（公共 gmail 池可用）；一个已被使用过的回收邮箱会返回 `Email address is already in use`，工具会换一个新的 |
| 目录 | 141 条定价记录，一个可用密钥上有 **128 个 id**，**0 个严格免费**记录（`model_ratio 0` + `model_price 0`）— 签到额度就是你消费的来源 |
| 分组 | `default`（128 条）· `次卡`（70）· `国产模型` · `DeepSeek[羊毛]` · `Claude[特价/折扣/高质/精品]` · `GPT[折扣/高质/生图]` · `Gemini[官转/高质/折扣/特价]` · `Grok[官转/折扣]` · `Codex[…]` |
| 有效期 | 签到额度不会过期；没有公布的单密钥速率限制 |

> 💡 免费额度由 Moxin Plus 设定，可能会变化。请在 [www.moxin.plus](https://www.moxin.plus) 查看实时数字 — 并让工具自身的关卡来判定：

```bash
node src/cli.js --verify     # every key in keys.txt is re-tested with two real chat calls
```

## 🤖 模型 — 全部 128 个

`GET /v1/models` 在一个可用密钥上返回了 **128 个 id**（2026-10-21）。目录 id 带有分组标签（`[次]deepseek-v4.1-flash`、`[vertex次特价]gemini-4-argon`），而**不带前缀的 id 也能解析**；这一点已通过端到端的聊天验证：

| 模型 ID | 备注 |
| --- | --- |
| `deepseek-v4.1-flash` | 验证默认模型 — 返回 200 `"MX-PONG"`，然后 `17*3 → 51`，并通过独立出口再次验证 |

> ⚠️ **`[次]` 陷阱。** 可见 id 中有 33 个被标记为按次计费（`[次]…`、`[特价次卡]…`），而定价数据将**其 141 条记录中的 70 条标记为 `quota_type=1` — 即按次计费的美元价格，而非按 token 的比例**。在一个账户上通过一个出口实测（2026-10-21）：`[次]deepseek-v4.1-flash` 返回 200 `"MX-PONG"`，但**每次调用消耗 24 000 额度（≈ $0.048）**，而不带前缀的 `deepseek-v4.1-flash` 返回完全相同的内容只消耗 **150 额度（≈ $0.0003）** — **同样的回答，每次调用相差 160 倍**。在你的路由器中固定使用不带前缀的 id，并让 `[次]` id 远离自动组合。

`/api/pricing` 数据列出了 141 条记录：`deepseek-v4-flash`、`gemini-2.5-flash-lite`、`claude-haiku-4-5`、`qwen3.7-max`、`MiniMax-M3`、`kimi-k3`、`grok-4.7` 等等，每一个都属于上述一个或多个分组。

## 🧪 如何使用 API

基础 URL **`https://www.moxin.plus/v1`** — 兼容 OpenAI：

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

通过签到为密钥充值 — 该调用使用的是**会话令牌**，而非 API 密钥：`POST /api/user/checkin`，带 `Authorization: Bearer <access_token>`。

## 🛠 快速开始

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

`keys.txt`（写入 `src/` 下，已被 git 忽略）**只有**在通过实时双提示关卡后才会写入；`accounts.jsonl` 保留签到证据（`quotaBefore` → `quotaAwarded` → `quota`），因此任何干涸的账户之后都可以用 `--revive` 免费复活。

### 🖱️ 启动器

启动器会询问代理列表（可选 — 没有则 CLI 直接连接）、账户数量和验证模型，将它们记入 `launcher.config.json`，然后运行 CLI：生成、验证、筛选代理、设置、帮助，以及*连接到 9Router*。

## ✅ 已验证可用 — 每个密钥都经过测试

以下所有检查均在 **2026-10-21/22** 从出口池重新运行（无 WARP）：

| 检查 | 结果 |
| --- | --- |
| `GET /api/status` | **200** — `system_name 墨信AI`、`v1.0.0-rc.44`、`price 0.5`、`quota_per_unit 500000`、`register_enabled`+`password_register_enabled` 为 true、`email_verification=true`、**`turnstile_check=false`**、`checkin_enabled=true` |
| 注册 | **✔** `GET /api/verification?email=<gmail>` 200 → 从收件箱取验证码 → `POST /api/user/register {username,password,password2,email,verification_code}` 200 |
| 签到资金 | **✔** `POST /api/user/checkin` → `{"checkin_date":"2026-10-22","quota_awarded":492798}` ⇒ `quota -2 223 → 490 575`；同一条通道为五个账户补充了资金 — 其中四个从负额度（`-27`、`-1 369`、`-2 223`、`-10 682`）恢复 — 并在注册时为四个新账户提供了资金 |
| 密钥 | **✔** `POST /api/token/` → `GET /api/token/?p=0&size=20` → **`POST /api/token/{id}/key`** 显示完整密钥（所有读取路由都会将其掩码） |
| 实时聊天 | **✔** `deepseek-v4.1-flash` → 200 `"MX-PONG"` 和 `17*3 → 51`，并通过独立出口再次验证 |
| 分组陷阱 | **✔** 新令牌可能落在 `DeepSeek[羊毛]` 分组，聊天会返回 **403** — `PUT /api/token/ {group:"default", unlimited_quota:true}` 可修复，工具在信任密钥前会重新检查 |
| 规模 | **✔ 10 个账户，10/10 个密钥都能返回真实补全**；六个较旧的账户各签到一次即免费恢复，四个是新生成的 |
| 按次陷阱 | **✔** 实测：`[次]` id **每次调用 24 000 额度**，而不带前缀的 id 为 **150 额度** — 同样返回 200 |

随时重新检查：

```bash
node src/cli.js --verify     # writes src/verify-report.json
```

## 🧭 工作原理

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: Moxin Plus page → e-mail address → code from the inbox
   ├─▶ session: the account's access token in hand
   ├─▶ funding: POST /api/user/checkin → the daily credit
   ├─▶ key mint: the account's token endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://www.moxin.plus/v1/chat/completions → real content = the key is live
```

| 步骤 | 调用 | 备注 |
| --- | --- | --- |
| 邮箱 | 公共 Gmail 池 | 面板接受 Gmail 类地址；一个**回收**的邮箱可能已在面板上存在（`Email address is already in use`）— 工具会用新邮箱重试 |
| 验证码 | `GET /api/verification?email=…` 然后读取收件箱 | ⚠ 品牌过滤必须针对**发件人**（`moxin\|studio\|墨信`）：共享收件箱也承载其他面板的验证码，而通用的“验证码”主题并不能作为证据 — 验证码邮件带有面板自己的 `墨信AI` 发件人 |
| 注册 | `POST /api/user/register {username,password,password2,email,verification_code}` | 响应可能自带 `access_token`；否则 `POST /api/user/login {username,password}`（用户名或邮箱均可） |
| 充值 | `POST /api/user/checkin` | 关键所在：每个账户每天 `quota_awarded ≈ 134 516 … 492 798` |
| 密钥 | `POST /api/token/` → 列表 → `POST /api/token/{id}/key` | 此分支在所有读取中都会掩码密钥；`/{id}/key` 路由会显示它 |
| 分组 | `PUT /api/token/ {group:"default", unlimited_quota:true}` | 生成的令牌可能落在拒绝该模型的分组（403）— 工具会重新分组并重新验证 |
| 关卡 | `POST /v1/chat/completions` | 只有返回真实内容后，密钥才会写入 `keys.txt`（两个提示：`MX-PONG`，然后 `17*3 → 51`） |

## ⚙️ CLI 选项

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

| 环境变量 | 默认值 | 含义 |
| --- | --- | --- |
| `MOXIN_BASE` | `https://www.moxin.plus` | 面板基础 URL |
| `MOXIN_PLUS_PROXIES`（或 `MOXIN_PROXIES`） | `proxies.txt` | 出口池，每行一个出口 — 可选；没有池时 CLI 直接连接 |

## 🛰️ 在代理之后

**可选 — 大规模使用时推荐。** `--pool <file>`（或 `MOXIN_PLUS_PROXIES`）接受每行一个出口 — `http://host:port`、`https://host:port`（CONNECT）或 `socks5://host:port`（可带 `user:pass@`）— 工具为每个账户取一个出口。没有池时它会打印直连模式提示并直接连接：注册、签到和验证都不变，只是数据包从何处发出不同。`--screen` 会在运行前针对面板测试你的出口（不会创建账户）。

## 📄 文件

| 路径 | 内容 |
| --- | --- |
| `src/keys.txt` | 每行一个实时验证过的密钥 — 已被 git 忽略，绝不提交 |
| `src/accounts.jsonl` | 邮箱、密码、密钥、签到证据（`quotaBefore` / `quotaAwarded` / `quota`）、模型、出口 — 仅本地 |
| `proxies.txt` | 你的出口，每行一个 — 已被 git 忽略 |
| `src/verify-report.json` | 最近一次 `--verify` 的结果 — 已被 git 忽略 |
| `launcher.config.json` | 启动器记住的内容 — 已被 git 忽略 |

## 🔌 连接到 9Router

[9Router](https://9router.com) 是一个自托管、兼容 OpenAI 的路由器。Moxin Plus 提供兼容 OpenAI 的端点，因此注册一次，每个密钥都会成为一个 provider 节点下的连接：

```bash
node src/connect-9router.js \
  --base http://localhost:20128 --password 123456 \
  --api-key YOUR_KEY
```

不带 `--api-key` 运行它会注册 `keys.txt` 中的**每一个**密钥。重复运行是幂等的：节点通过 `--prefix moxin-plus` 匹配，每个连接通过名称匹配（`moxin-plus-001`、`moxin-plus-002`、…）。默认值：`--base http://localhost:20128`、`--password 123456`、`--name "Moxin Plus"`、`--prefix moxin-plus`、`--base-url https://www.moxin.plus/v1`、`--model deepseek-v4.1-flash`。模型随后以 `moxin-plus/<model id>` 的形式提供 — 请固定使用**不带前缀**的 id，而非 `[次]` 的 id（见上文陷阱）。

## 🔌 连接到 OmniRoute

[OmniRoute](https://omniroute.online) 是一个自托管、兼容 OpenAI 的路由器。Moxin Plus 提供兼容 OpenAI 的端点，因此注册一次，每个密钥都会成为一个 provider 节点下的连接：

```bash
node src/connect-omniroute.js \
  --base http://localhost:20128 --password 123456 \
  --api-key YOUR_KEY
```

不带 `--api-key` 运行它会注册 `keys.txt` 中的**每一个**密钥。重复运行是幂等的：节点通过 `--prefix moxin-plus` 匹配，每个连接通过名称匹配（`moxin-plus-001`、`moxin-plus-002`、…）。默认值：`--base http://localhost:20128`、`--password 123456`、`--name "Moxin Plus"`、`--prefix moxin-plus`、`--base-url https://www.moxin.plus/v1`、`--model deepseek-v4.1-flash`。模型随后以 `moxin-plus/<model id>` 的形式提供 — 请固定使用**不带前缀**的 id，而非 `[次]` 的 id（见上文陷阱）。
## 🔑 一个密钥能给你什么

| | |
| --- | --- |
| 🏢 提供商 | **Moxin Plus（墨信AI）** — [www.moxin.plus](https://www.moxin.plus) |
| 🎁 提供商提供什么 | **没有注册奖励** — 每日签到支付**每个账户每天约 $0.27–$0.99**（中位数 ≈ $0.72） |
| 🔑 一个密钥能给你什么 | `https://www.moxin.plus/v1` 上的 128 个 id 目录，由该账户的签到额度提供资金 |
| 📦 本仓库 | **10 个密钥，全部通过聊天验证**，2026-10-21/22 |
| 🌐 API 形态 | 兼容 OpenAI：`POST https://www.moxin.plus/v1/chat/completions` |
| 🛡️ 关卡 | **无验证码**，仅邮箱验证码；共享邮箱上需要发件人品牌过滤 |
| 🔒 你的数据 | 只联系 `www.moxin.plus` 和邮箱服务；密钥绝不离开你的机器 |

## 🐞 问题反馈

如果面板更改了其注册/签到路由、邮箱策略或目录，工具会在此停止并说明原因。请**[提交 issue](../../issues)**，附上命令和确切输出。

## 📄 许可证

MIT © 2026 — 见 [LICENSE](LICENSE)。

<div align="center">

**[MIT](LICENSE)** © 2026 moxin-plus-bulk-apikey contributors

</div>