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

**자동 생성된 API 키로 Moxin Plus (墨信AI) 계정을 대량 생성 — OpenAI 호환 추론 + [9Router](https://9router.com) 커넥터.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-128%20served-412991?style=for-the-badge)](https://www.moxin.plus/pricing)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![OmniRoute](https://img.shields.io/badge/OmniRoute-connector-8B5CF6?style=for-the-badge)](#-connect-to-omniroute)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 빠른 시작](#-quick-start) · [🎁 무료 티어](#-free-tier--how-much-you-get) · [🤖 모델](#-models--all-128-of-them) · [🧪 API 사용하기](#-how-to-use-the-api) · [✅ 검증됨](#-verified-working--every-key-is-tested) · [🧭 작동 방식](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [🔌 OmniRoute](#-connect-to-omniroute) · [⚙️ 옵션](#️-cli-options) · [🛰️ 프록시](#️-behind-a-proxy) · [🐞 이슈](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ 이 도구가 존재하는 이유

Moxin Plus는 墨信AI 제품군의 `www.moxin.plus` 호스트입니다 — **new-api 포크**(`v1.0.0-rc.44`, `system_name 墨信AI`)로 **캡차가 없고**(`turnstile_check=false`) 단순한 이메일 코드 가입을 지원하지만, **가입 보너스는 없습니다**. 계정을 가질 가치가 있게 만드는 것은 **일일 출석 체크**입니다: `POST /api/user/checkin`이 초과 인출된 계정 하나(`quota -97`)에 **단 한 번의 호출로 201 373 quota를 지급**했으며, 열 개의 계정 전체에서 **134 516 … 492 798 quota(≈ $0.27–$0.99, 중앙값 ≈ $0.72)**를 `quota_per_unit 500000` 기준으로 지급했습니다. 그 뒤의 카탈로그는 **128개의 라이브 id**(DeepSeek · Gemini · Claude · Qwen · MiniMax · Kimi · Grok)로, `https://www.moxin.plus/v1`에서 OpenAI 호환으로 제공됩니다. 자매 호스트인 `www.moxin.studio`(`rc.45`, `price 1`)는 **별도의 데이터베이스**입니다 — 여기서 발급한 키는 그곳에서 `Invalid token`을 반환하고, 그 반대도 마찬가지입니다.

## 🎁 무료 티어 — 얼마나 받을 수 있나

**가입 보너스 없음 — 계정당 하루 한 번의 출석 체크가 자금 조달 경로입니다.**

| 항목 | 값 |
| --- | --- |
| 가입 보너스 | **없음** — 새 계정은 `quota 0`에서 시작하며, 도구가 계정을 등록하고 즉시 출석 체크합니다 |
| 일일 출석 체크 | `POST /api/user/checkin` → `{"checkin_date":"2026-10-22","quota_awarded":492798}`; 열 개 계정에서 측정된 지급액 **134 516 … 492 798 quota ≈ $0.27–$0.99 (중앙값 ≈ $0.72)**; 같은 날 두 번째 호출은 `Already checked in today`를 반환 — 패널 기준일은 UTC+8 |
| 카드 / 전화 | 어느 단계에서도 **없음** |
| 캡차 | **없음**(`turnstile_check=false`) — 순수 HTTP, 브라우저도 솔버도 불필요 |
| 이메일 | `email_verification=true`, 6자리 16진수 코드, TTL 약 10분; Gmail급 메일함(공개 gmail 풀 작동); 이미 계정이 있는 재활용 메일함은 `Email address is already in use`를 반환하고 도구는 새 메일함을 사용합니다 |
| 카탈로그 | 141개 가격 행, 라이브 키에서 **128개 id**, **strict-free 0개** 행(`model_ratio 0` + `model_price 0`) — 출석 체크 크레딧이 곧 사용할 재원입니다 |
| 그룹 | `default` (128행) · `次卡` (70) · `国产模型` · `DeepSeek[羊毛]` · `Claude[特价/折扣/高质/精品]` · `GPT[折扣/高质/生图]` · `Gemini[官转/高质/折扣/特价]` · `Grok[官转/折扣]` · `Codex[…]` |
| 만료 | 출석 체크 크레딧은 만료되지 않음; 공개된 키별 속도 제한 없음 |

> 💡 무료 티어는 Moxin Plus가 정하며 변경될 수 있습니다. 실시간 수치는 [www.moxin.plus](https://www.moxin.plus)에서 확인하세요 — 그리고 도구 자체의 게이트가 판단하도록 하세요:

```bash
node src/cli.js --verify     # every key in keys.txt is re-tested with two real chat calls
```

## 🤖 모델 — 128개 전부

`GET /v1/models`는 라이브 키에서 **128개 id**를 반환했습니다(2026-10-21). 카탈로그 id는 그룹 태그가 붙어 있으며(`[次]deepseek-v4.1-flash`, `[vertex次特价]gemini-4-argon`) **접두사 없는 id도 해석됩니다**; 이는 채팅으로 처음부터 끝까지 검증되었습니다:

| 모델 ID | 비고 |
| --- | --- |
| `deepseek-v4.1-flash` | 검증 기본값 — 200 `"MX-PONG"`, 이어서 `17*3 → 51`, 독립적인 출구를 통해 재검증됨 |

> ⚠️ **`[次]` 함정.** 표시되는 id 중 33개는 호출당 과금(`[次]…`, `[特价次卡]…`)으로 태그되어 있고, 가격 피드는 **141개 행 중 70개를 `quota_type=1` — 토큰당 비율 대신 호출당 USD 가격 — 으로 표시합니다**. 한 계정에서 하나의 출구를 통해 측정한 결과(2026-10-21): `[次]deepseek-v4.1-flash`는 200 `"MX-PONG"`을 반환했지만 **호출당 24 000 quota(≈ $0.048)를 소모**했고, 반면 일반 `deepseek-v4.1-flash`는 동일한 응답을 **150 quota(≈ $0.0003)**로 반환했습니다 — **같은 답변에 호출당 160배 차이**입니다. 라우터에는 일반 id를 고정하고 `[次]` id는 자동 조합에서 제외하세요.

`/api/pricing` 피드는 141개 행을 나열합니다: `deepseek-v4-flash`, `gemini-2.5-flash-lite`, `claude-haiku-4-5`, `qwen3.7-max`, `MiniMax-M3`, `kimi-k3`, `grok-4.7` 등이 있으며, 각각 위 그룹 중 하나 이상에 속합니다.

## 🧪 API 사용 방법

Base URL **`https://www.moxin.plus/v1`** — OpenAI 호환:

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

출석 체크로 키를 충전하세요 — 그 호출은 API 키가 아니라 **세션 토큰**을 사용합니다: `Authorization: Bearer <access_token>`와 함께 `POST /api/user/checkin`.

## 🛠 빠른 시작

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

`keys.txt`(`src/` 아래에 작성되며 git에서 무시됨)는 **오직** 라이브 2-프롬프트 게이트를 통과한 후에만 작성됩니다; `accounts.jsonl`은 출석 체크 증거(`quotaBefore` → `quotaAwarded` → `quota`)를 보관하므로, 고갈된 계정은 나중에 `--revive`로 무료로 되살릴 수 있습니다.

### 🖱️ 런처

런처는 프록시 목록(선택 사항 — 없으면 CLI가 직접 연결), 계정 수, 검증 모델을 묻고 이를 `launcher.config.json`에 기억한 뒤 CLI를 실행합니다: 발급, 검증, 프록시 스크리닝, 설정, 도움말, 그리고 *9Router에 연결*.

## ✅ 검증된 작동 — 모든 키가 테스트됩니다

아래 모든 검사는 **2026-10-21/22**에 출구 풀에서 재실행되었습니다(WARP 없음):

| 검사 | 결과 |
| --- | --- |
| `GET /api/status` | **200** — `system_name 墨信AI`, `v1.0.0-rc.44`, `price 0.5`, `quota_per_unit 500000`, `register_enabled`+`password_register_enabled` true, `email_verification=true`, **`turnstile_check=false`**, `checkin_enabled=true` |
| 등록 | **✔** `GET /api/verification?email=<gmail>` 200 → 받은편지함에서 코드 → `POST /api/user/register {username,password,password2,email,verification_code}` 200 |
| 출석 체크 자금 조달 | **✔** `POST /api/user/checkin` → `{"checkin_date":"2026-10-22","quota_awarded":492798}` ⇒ `quota -2 223 → 490 575`; 같은 경로로 다섯 계정을 재충전 — 그중 네 개는 마이너스 quota(`-27`, `-1 369`, `-2 223`, `-10 682`)에서 — 그리고 등록 시 네 개의 새 계정에 자금을 공급 |
| 키 | **✔** `POST /api/token/` → `GET /api/token/?p=0&size=20` → **`POST /api/token/{id}/key`**가 전체 키를 노출(모든 읽기 경로는 마스킹함) |
| 라이브 채팅 | **✔** `deepseek-v4.1-flash` → 200 `"MX-PONG"` 및 `17*3 → 51`, 독립적인 출구를 통해 재검증됨 |
| 그룹 함정 | **✔** 새 토큰이 `DeepSeek[羊毛]`에 배치되어 채팅이 **403**을 반환할 수 있음 — `PUT /api/token/ {group:"default", unlimited_quota:true}`로 해결되며 도구는 키를 신뢰하기 전에 재확인합니다 |
| 규모 | **✔ 계정 10개, 키 10/10개가 실제 완성 응답을 반환**; 여섯 개의 오래된 계정은 각각 한 번의 출석 체크로 무료로 복구되었고, 네 개는 새로 발급됨 |
| 호출당 함정 | **✔** 측정: `[次]` id **호출당 24 000 quota** vs 일반 id **150 quota** — 동일한 200 |

언제든지 재확인:

```bash
node src/cli.js --verify     # writes src/verify-report.json
```

## 🧭 작동 방식

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: Moxin Plus page → e-mail address → code from the inbox
   ├─▶ session: the account's access token in hand
   ├─▶ funding: POST /api/user/checkin → the daily credit
   ├─▶ key mint: the account's token endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://www.moxin.plus/v1/chat/completions → real content = the key is live
```

| 단계 | 호출 | 비고 |
| --- | --- | --- |
| 메일함 | 공개 Gmail 풀 | 패널은 Gmail급 주소를 허용; **재활용된** 메일함은 이미 패널에 존재할 수 있음(`Email address is already in use`) — 도구는 새 메일함으로 재시도 |
| 코드 | `GET /api/verification?email=…` 후 받은편지함 읽기 | ⚠ 브랜드 필터는 반드시 **발신자**(`moxin\|studio\|墨信`)를 기준으로 해야 함: 공유 받은편지함에는 다른 패널의 코드도 함께 들어 있으며, 일반적인 "verification code" 제목은 증거가 아님 — 코드 메일은 패널 자체의 `墨信AI` 발신자를 포함 |
| 등록 | `POST /api/user/register {username,password,password2,email,verification_code}` | 응답에 자체 `access_token`이 포함될 수 있음; 그렇지 않으면 `POST /api/user/login {username,password}`(사용자 이름 또는 이메일 모두 작동) |
| 자금 조달 | `POST /api/user/checkin` | 핵심: 계정당 하루 `quota_awarded ≈ 134 516 … 492 798` |
| 키 | `POST /api/token/` → 목록 → `POST /api/token/{id}/key` | 이 포크는 모든 읽기에서 키를 마스킹; `/{id}/key` 경로가 이를 노출 |
| 그룹 | `PUT /api/token/ {group:"default", unlimited_quota:true}` | 발급된 토큰이 모델을 거부하는 그룹(403)에 배치될 수 있음 — 도구는 재그룹화하고 재검증 |
| 게이트 | `POST /v1/chat/completions` | 실제 콘텐츠가 반환된 후에만 키가 `keys.txt`에 작성됨(두 개의 프롬프트: `MX-PONG`, 이어서 `17*3 → 51`) |

## ⚙️ CLI 옵션

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

| 환경 변수 | 기본값 | 의미 |
| --- | --- | --- |
| `MOXIN_BASE` | `https://www.moxin.plus` | 패널 기본 URL |
| `MOXIN_PLUS_PROXIES` (또는 `MOXIN_PROXIES`) | `proxies.txt` | 출구 풀, 한 줄에 하나의 출구 — 선택 사항; 풀이 없으면 CLI가 직접 연결 |

## 🛰️ 프록시 뒤에서

**선택 사항 — 대규모에서는 권장.** `--pool <file>`(또는 `MOXIN_PLUS_PROXIES`)은 한 줄에 하나의 출구를 받습니다 — `http://host:port`, `https://host:port`(CONNECT) 또는 `socks5://host:port`(선택적 `user:pass@` 포함) — 그리고 도구는 계정당 하나의 출구를 사용합니다. 풀이 없으면 직접 모드 안내를 출력하고 직접 연결합니다: 가입, 출석 체크, 검증은 동일하며, 패킷이 나가는 위치만 다릅니다. `--screen`은 실행 전에 패널에 대해 출구를 테스트합니다(계정은 생성되지 않음).

## 📄 파일

| 경로 | 내용 |
| --- | --- |
| `src/keys.txt` | 한 줄에 하나의 라이브 검증된 키 — git에서 무시되며 절대 커밋되지 않음 |
| `src/accounts.jsonl` | 이메일, 비밀번호, 키, 출석 체크 증거(`quotaBefore` / `quotaAwarded` / `quota`), 모델, 출구 — 로컬 전용 |
| `proxies.txt` | 출구 목록, 한 줄에 하나 — git에서 무시됨 |
| `src/verify-report.json` | 마지막 `--verify` 결과 — git에서 무시됨 |
| `launcher.config.json` | 런처가 기억하는 내용 — git에서 무시됨 |

## 🔌 9Router에 연결

[9Router](https://9router.com)는 자체 호스팅되는 OpenAI 호환 라우터입니다. Moxin Plus는 OpenAI 호환 엔드포인트를 제공하므로, 한 번 등록하면 모든 키가 하나의 프로바이더 노드 아래 연결이 됩니다:

```bash
node src/connect-9router.js \
  --base http://localhost:20128 --password 123456 \
  --api-key YOUR_KEY
```

`--api-key` 없이 실행하면 `keys.txt`의 **모든** 키를 등록합니다. 재실행은 멱등적입니다: 노드는 `--prefix moxin-plus`로 매칭되고, 각 연결은 이름(`moxin-plus-001`, `moxin-plus-002`, …)으로 매칭됩니다. 기본값: `--base http://localhost:20128`, `--password 123456`, `--name "Moxin Plus"`, `--prefix moxin-plus`, `--base-url https://www.moxin.plus/v1`, `--model deepseek-v4.1-flash`. 이후 모델은 `moxin-plus/<model id>`로 제공됩니다 — `[次]` id가 아닌 **일반** id를 고정하세요(위의 함정 참조).

## 🔌 OmniRoute에 연결

[OmniRoute](https://omniroute.online)는 자체 호스팅되는 OpenAI 호환 라우터입니다. Moxin Plus는 OpenAI 호환 엔드포인트를 제공하므로, 한 번 등록하면 모든 키가 하나의 프로바이더 노드 아래 연결이 됩니다:

```bash
node src/connect-omniroute.js \
  --base http://localhost:20128 --password 123456 \
  --api-key YOUR_KEY
```

`--api-key` 없이 실행하면 `keys.txt`의 **모든** 키를 등록합니다. 재실행은 멱등적입니다: 노드는 `--prefix moxin-plus`로 매칭되고, 각 연결은 이름(`moxin-plus-001`, `moxin-plus-002`, …)으로 매칭됩니다. 기본값: `--base http://localhost:20128`, `--password 123456`, `--name "Moxin Plus"`, `--prefix moxin-plus`, `--base-url https://www.moxin.plus/v1`, `--model deepseek-v4.1-flash`. 이후 모델은 `moxin-plus/<model id>`로 제공됩니다 — `[次]` id가 아닌 **일반** id를 고정하세요(위의 함정 참조).

## 🔑 키 하나로 얻는 것

| | |
| --- | --- |
| 🏢 프로바이더 | **Moxin Plus (墨信AI)** — [www.moxin.plus](https://www.moxin.plus) |
| 🎁 프로바이더가 제공하는 것 | **가입 보너스 없음** — 일일 출석 체크가 **계정당 하루 ≈$0.27–$0.99**(중앙값 ≈ $0.72)를 지급 |
| 🔑 키 하나로 얻는 것 | `https://www.moxin.plus/v1`의 128개 id 카탈로그, 해당 계정의 출석 체크 크레딧으로 충전됨 |
| 📦 이 저장소 | **키 10개, 전부 채팅 검증됨** (2026-10-21/22) |
| 🌐 API 형태 | OpenAI 호환: `POST https://www.moxin.plus/v1/chat/completions` |
| 🛡️ 게이트 | **캡차 없음**, 이메일 코드만; 공유 메일함에는 발신자 브랜드 필터 필요 |
| 🔒 데이터 | `www.moxin.plus`와 메일함 서비스만 접촉; 키는 절대 사용자 컴퓨터를 떠나지 않음 |

## 🐞 이슈

패널이 등록/출석 체크 경로, 이메일 정책 또는 카탈로그를 변경하면 도구는 그 지점에서 멈추고 그 사실을 알립니다. 명령과 정확한 출력을 포함하여 **[이슈를 열어주세요](../../issues)**.

## 📄 라이선스

MIT © 2026 — [LICENSE](LICENSE) 참조.

<div align="center">

**[MIT](LICENSE)** © 2026 moxin-plus-bulk-apikey contributors

</div>