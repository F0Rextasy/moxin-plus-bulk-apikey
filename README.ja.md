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

**Moxin Plus（墨信AI）アカウントを自動生成された API キーとともに一括作成 — OpenAI 互換推論 + [9Router](https://9router.com) コネクタ。**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-128%20served-412991?style=for-the-badge)](https://www.moxin.plus/pricing)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![OmniRoute](https://img.shields.io/badge/OmniRoute-connector-8B5CF6?style=for-the-badge)](#-connect-to-omniroute)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 クイックスタート](#-quick-start) · [🎁 無料枠](#-free-tier--how-much-you-get) · [🤖 モデル](#-models--all-128-of-them) · [🧪 API の使い方](#-how-to-use-the-api) · [✅ 検証済み](#-verified-working--every-key-is-tested) · [🧭 仕組み](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [🔌 OmniRoute](#-connect-to-omniroute) · [⚙️ オプション](#️-cli-options) · [🛰️ プロキシ](#️-behind-a-proxy) · [🐞 Issues](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ これが存在する理由

Moxin Plus は 墨信AI ファミリーの `www.moxin.plus` ホストです — **new-api フォーク**（`v1.0.0-rc.44`、`system_name 墨信AI`）で、**キャプチャなし**（`turnstile_check=false`）、メールコードによるシンプルな登録ですが、**登録ボーナスはありません**。アカウントを持つ価値があるのは**毎日のチェックイン**です。`POST /api/user/checkin` は、あるマイナス残高のアカウント（`quota -97`）に**1回の呼び出しで 201 373 quota を返済**し、私たちの10アカウント全体では **134 516 … 492 798 quota（≈ $0.27–$0.99、中央値 ≈ $0.72）** を `quota_per_unit 500000` で支払いました。その背後にあるカタログは **128 のライブ id**（DeepSeek · Gemini · Claude · Qwen · MiniMax · Kimi · Grok）で、`https://www.moxin.plus/v1` 上で OpenAI 互換で提供されています。その兄弟ホスト `www.moxin.studio`（`rc.45`、`price 1`）は**別のデータベース**です — ここで発行されたキーはそちらでは `Invalid token` を返し、その逆も同様です。

## 🎁 無料枠 — いくら得られるか

**登録ボーナスなし — 1アカウントにつき1日1回のチェックインが資金源です。**

| 項目 | 値 |
| --- | --- |
| 登録ボーナス | **なし** — 新規アカウントは `quota 0` から始まります。ツールはアカウントを登録し、すぐにチェックインします |
| 毎日のチェックイン | `POST /api/user/checkin` → `{"checkin_date":"2026-10-22","quota_awarded":492798}`；10アカウントで計測された付与額は **134 516 … 492 798 quota ≈ $0.27–$0.99（中央値 ≈ $0.72）**；同日2回目の呼び出しは `Already checked in today` を返します — パネルの日付は UTC+8 です |
| カード / 電話 | どのステップでも**不要** |
| キャプチャ | **なし**（`turnstile_check=false`）— プレーン HTTP、ブラウザ不要、ソルバー不要 |
| メール | `email_verification=true`、6桁16進コード、TTL 約10分；Gmail クラスのメールボックス（公開 gmail プールが機能します）；すでにアカウントを持つリサイクルされたメールボックスは `Email address is already in use` を返し、ツールは新しいものを取得します |
| カタログ | 141 の価格行、ライブキーで **128 id**、**strict-free 行は 0**（`model_ratio 0` + `model_price 0`）— チェックインのクレジットが使う原資です |
| グループ | `default`（128 行）· `次卡`（70）· `国产模型` · `DeepSeek[羊毛]` · `Claude[特价/折扣/高质/精品]` · `GPT[折扣/高质/生图]` · `Gemini[官转/高质/折扣/特价]` · `Grok[官转/折扣]` · `Codex[…]` |
| 有効期限 | チェックインのクレジットは失効しません；公開されたキーごとのレート制限はありません |

> 💡 無料枠は Moxin Plus が設定するもので、変更される可能性があります。最新の数値は [www.moxin.plus](https://www.moxin.plus) で確認してください — そしてツール自身のゲートに判断させてください：

```bash
node src/cli.js --verify     # every key in keys.txt is re-tested with two real chat calls
```

## 🤖 モデル — そのすべて 128 個

`GET /v1/models` はライブキーで **128 id** を返しました（2026-10-21）。カタログの id はグループタグ付き（`[次]deepseek-v4.1-flash`、`[vertex次特价]gemini-4-argon`）で、**プレフィックスのない id も解決されます**；これはエンドツーエンドでチャット検証済みです：

| モデル ID | 備考 |
| --- | --- |
| `deepseek-v4.1-flash` | 検証のデフォルト — 200 `"MX-PONG"`、続いて `17*3 → 51`、独立した出口を通じて再証明済み |

> ⚠️ **`[次]` の罠。** 表示される id のうち 33 個は呼び出しごと（`[次]…`、`[特价次卡]…`）としてタグ付けされており、価格フィードは**その 141 行のうち 70 行を `quota_type=1` — トークンごとの比率ではなく呼び出しごとの USD 価格 — とマークしています**。1つの出口を通じた1アカウントでの計測（2026-10-21）：`[次]deepseek-v4.1-flash` は 200 `"MX-PONG"` を返しましたが、**呼び出しごとに 24 000 quota（≈ $0.048）を消費**しました。一方、プレーンな `deepseek-v4.1-flash` は同じものを **150 quota（≈ $0.0003）** で返しました — **同じ回答に対して呼び出しごとに 160 倍の差**です。ルーターではプレーンな id を固定し、`[次]` id は自動コンボから除外してください。

`/api/pricing` フィードは 141 行をリストします：`deepseek-v4-flash`、`gemini-2.5-flash-lite`、`claude-haiku-4-5`、`qwen3.7-max`、`MiniMax-M3`、`kimi-k3`、`grok-4.7` など、それぞれが上記のグループの1つ以上に属します。

## 🧪 API の使い方

ベース URL **`https://www.moxin.plus/v1`** — OpenAI 互換：

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

チェックインでキーにチャージします — その呼び出しは **API キーではなくセッショントークン**を取ります：`POST /api/user/checkin` に `Authorization: Bearer <access_token>` を付けます。

## 🛠 クイックスタート

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

`keys.txt`（`src/` 以下に書き込まれ、git 管理外）は**ライブの2プロンプトゲートの後にのみ**書き込まれます；`accounts.jsonl` はチェックインの証跡（`quotaBefore` → `quotaAwarded` → `quota`）を保持するので、残高が尽きたアカウントは後で `--revive` で無料で復活させられます。

### 🖱️ ランチャー

ランチャーはプロキシリスト（任意 — なしの場合 CLI は直接接続で実行）、アカウント数、検証モデルを尋ね、それらを `launcher.config.json` に記憶し、CLI を実行します：mint、verify、screen proxies、settings、help、そして *Connect to 9Router*。

## ✅ 動作検証済み — すべてのキーがテストされています

以下のすべてのチェックは **2026-10-21/22** に出口プールから再実行されました（WARP なし）：

| チェック | 結果 |
| --- | --- |
| `GET /api/status` | **200** — `system_name 墨信AI`、`v1.0.0-rc.44`、`price 0.5`、`quota_per_unit 500000`、`register_enabled`+`password_register_enabled` true、`email_verification=true`、**`turnstile_check=false`**、`checkin_enabled=true` |
| 登録 | **✔** `GET /api/verification?email=<gmail>` 200 → 受信トレイからコード → `POST /api/user/register {username,password,password2,email,verification_code}` 200 |
| チェックインによる資金供給 | **✔** `POST /api/user/checkin` → `{"checkin_date":"2026-10-22","quota_awarded":492798}` ⇒ `quota -2 223 → 490 575`；同じレールが5つのアカウントを補充しました — そのうち4つはマイナス残高（`-27`、`-1 369`、`-2 223`、`-10 682`）から — そして4つの新規アカウントに登録時に資金を供給しました |
| キー | **✔** `POST /api/token/` → `GET /api/token/?p=0&size=20` → **`POST /api/token/{id}/key`** が完全なキーを公開します（すべての読み取りルートはマスクします） |
| ライブチャット | **✔** `deepseek-v4.1-flash` → 200 `"MX-PONG"` および `17*3 → 51`、独立した出口を通じて再証明済み |
| グループの罠 | **✔** 新しいトークンが `DeepSeek[羊毛]` に配置され、チャットが **403** を返すことがあります — `PUT /api/token/ {group:"default", unlimited_quota:true}` で修正され、ツールはキーを信頼する前に再チェックします |
| スケール | **✔ 10 アカウント、10/10 キーが実際の補完に応答**；6つの古いアカウントはそれぞれ1回のチェックインで無料で復活し、4つは新規に発行されました |
| 呼び出しごとの罠 | **✔** 計測済み：`[次]` id は**呼び出しごとに 24 000 quota** 対 プレーンな id は **150 quota** — 同じ 200 |

いつでも再チェック：

```bash
node src/cli.js --verify     # writes src/verify-report.json
```

## 🧭 仕組み

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: Moxin Plus page → e-mail address → code from the inbox
   ├─▶ session: the account's access token in hand
   ├─▶ funding: POST /api/user/checkin → the daily credit
   ├─▶ key mint: the account's token endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://www.moxin.plus/v1/chat/completions → real content = the key is live
```

| ステップ | 呼び出し | 備考 |
| --- | --- | --- |
| メールボックス | 公開 Gmail プール | パネルは Gmail クラスのアドレスを受け付けます；**リサイクルされた**メールボックスはすでにパネルに存在することがあります（`Email address is already in use`）— ツールは新しいメールボックスで再試行します |
| コード | `GET /api/verification?email=…` の後に受信トレイを読む | ⚠ ブランドフィルターは**送信者**（`moxin\|studio\|墨信`）をキーにする必要があります：共有受信トレイには他のパネルのコードも含まれており、一般的な「verification code」という件名は証拠になりません — コードメールはパネル自身の `墨信AI` 送信者を持っています |
| 登録 | `POST /api/user/register {username,password,password2,email,verification_code}` | レスポンスが独自の `access_token` を持つことがあります；そうでなければ `POST /api/user/login {username,password}`（ユーザー名またはメールアドレスのどちらでも機能します） |
| 資金供給 | `POST /api/user/checkin` | これが要点です：1アカウント1日あたり `quota_awarded ≈ 134 516 … 492 798` |
| キー | `POST /api/token/` → リスト → `POST /api/token/{id}/key` | このフォークはすべての読み取りでキーをマスクします；`/{id}/key` ルートがそれを公開します |
| グループ | `PUT /api/token/ {group:"default", unlimited_quota:true}` | 発行されたトークンがモデルを拒否するグループ（403）に配置されることがあります — ツールは再グループ化して再証明します |
| ゲート | `POST /v1/chat/completions` | キーは実際のコンテンツが返ってきた後にのみ `keys.txt` に書き込まれます（2つのプロンプト：`MX-PONG`、続いて `17*3 → 51`） |

## ⚙️ CLI オプション

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

| 環境変数 | デフォルト | 意味 |
| --- | --- | --- |
| `MOXIN_BASE` | `https://www.moxin.plus` | パネルのベース URL |
| `MOXIN_PLUS_PROXIES`（または `MOXIN_PROXIES`） | `proxies.txt` | 出口プール、1行につき1出口 — 任意；プールなしの場合 CLI は直接接続します |

## 🛰️ プロキシの背後で

**任意 — 大規模運用では推奨。** `--pool <file>`（または `MOXIN_PLUS_PROXIES`）は1行につき1出口を受け付けます — `http://host:port`、`https://host:port`（CONNECT）または `socks5://host:port`（任意で `user:pass@` 付き）— そしてツールは1アカウントにつき1出口を使用します。プールなしの場合、直接モードの注意書きを表示して直接接続します：登録、チェックイン、検証は変わりません。変わるのはパケットが出ていく場所だけです。`--screen` は実行前にパネルに対して出口をテストします（アカウントは作成されません）。

## 📄 ファイル

| パス | 内容 |
| --- | --- |
| `src/keys.txt` | 1行につき1つのライブ検証済みキー — git 管理外、コミットされません |
| `src/accounts.jsonl` | メール、パスワード、キー、チェックインの証跡（`quotaBefore` / `quotaAwarded` / `quota`）、モデル、出口 — ローカルのみ |
| `proxies.txt` | あなたの出口、1行につき1つ — git 管理外 |
| `src/verify-report.json` | 最後の `--verify` の結果 — git 管理外 |
| `launcher.config.json` | ランチャーが記憶する内容 — git 管理外 |

## 🔌 9Router に接続する

[9Router](https://9router.com) はセルフホスト型の OpenAI 互換ルーターです。Moxin Plus は OpenAI 互換エンドポイントを提供するので、一度登録すればすべてのキーが1つのプロバイダーノードの下の接続になります：

```bash
node src/connect-9router.js \
  --base http://localhost:20128 --password 123456 \
  --api-key YOUR_KEY
```

`--api-key` なしで実行すると、`keys.txt` 内の**すべての**キーを登録します。再実行は冪等です：ノードは `--prefix moxin-plus` で照合され、各接続は名前（`moxin-plus-001`、`moxin-plus-002`、…）で照合されます。デフォルト：`--base http://localhost:20128`、`--password 123456`、`--name "Moxin Plus"`、`--prefix moxin-plus`、`--base-url https://www.moxin.plus/v1`、`--model deepseek-v4.1-flash`。モデルはその後 `moxin-plus/<model id>` として提供されます — `[次]` のものではなく**プレーンな** id を固定してください（上記の罠を参照）。

## 🔌 OmniRoute に接続する

[OmniRoute](https://omniroute.online) はセルフホスト型の OpenAI 互換ルーターです。Moxin Plus は OpenAI 互換エンドポイントを提供するので、一度登録すればすべてのキーが1つのプロバイダーノードの下の接続になります：

```bash
node src/connect-omniroute.js \
  --base http://localhost:20128 --password 123456 \
  --api-key YOUR_KEY
```

`--api-key` なしで実行すると、`keys.txt` 内の**すべての**キーを登録します。再実行は冪等です：ノードは `--prefix moxin-plus` で照合され、各接続は名前（`moxin-plus-001`、`moxin-plus-002`、…）で照合されます。デフォルト：`--base http://localhost:20128`、`--password 123456`、`--name "Moxin Plus"`、`--prefix moxin-plus`、`--base-url https://www.moxin.plus/v1`、`--model deepseek-v4.1-flash`。モデルはその後 `moxin-plus/<model id>` として提供されます — `[次]` のものではなく**プレーンな** id を固定してください（上記の罠を参照）。

## 🔑 1つのキーで得られるもの

| | |
| --- | --- |
| 🏢 プロバイダー | **Moxin Plus（墨信AI）** — [www.moxin.plus](https://www.moxin.plus) |
| 🎁 プロバイダーが提供するもの | **登録ボーナスなし** — 毎日のチェックインが**1アカウント1日あたり ≈$0.27–$0.99**（中央値 ≈ $0.72）を支払います |
| 🔑 1つのキーで得られるもの | `https://www.moxin.plus/v1` 上の 128 id のカタログ、そのアカウントのチェックインクレジットで賄われます |
| 📦 このリポジトリ | **10 キー、すべてチャット検証済み**（2026-10-21/22） |
| 🌐 API の形 | OpenAI 互換：`POST https://www.moxin.plus/v1/chat/completions` |
| 🛡️ ゲート | **キャプチャなし**、メールコードのみ；共有メールボックスでは送信者ブランドフィルターが必要 |
| 🔒 あなたのデータ | 接触するのは `www.moxin.plus` とメールボックスサービスのみ；キーがあなたのマシンから出ることはありません |

## 🐞 Issues

パネルが登録/チェックインのルート、メールポリシー、またはカタログを変更した場合、ツールはそこで停止し、その旨を報告します。コマンドと正確な出力を添えて **[issue を作成してください](../../issues)**。

## 📄 ライセンス

MIT © 2026 — [LICENSE](LICENSE) を参照。

<div align="center">

**[MIT](LICENSE)** © 2026 moxin-plus-bulk-apikey contributors

</div>