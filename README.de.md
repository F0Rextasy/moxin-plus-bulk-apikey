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

**Moxin Plus (墨信AI)-Konten in großen Mengen erstellen mit automatisch generierten API-Schlüsseln — OpenAI-kompatible Inferenz + [9Router](https://9router.com)-Connector.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-128%20served-412991?style=for-the-badge)](https://www.moxin.plus/pricing)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![OmniRoute](https://img.shields.io/badge/OmniRoute-connector-8B5CF6?style=for-the-badge)](#-connect-to-omniroute)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 Schnellstart](#-quick-start) · [🎁 Kostenlose Stufe](#-free-tier--how-much-you-get) · [🤖 Modelle](#-models--all-128-of-them) · [🧪 Die API verwenden](#-how-to-use-the-api) · [✅ Verifiziert](#-verified-working--every-key-is-tested) · [🧭 So funktioniert es](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [🔌 OmniRoute](#-connect-to-omniroute) · [⚙️ Optionen](#️-cli-options) · [🛰️ Proxys](#️-behind-a-proxy) · [🐞 Probleme](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ Warum es das gibt

Moxin Plus ist der `www.moxin.plus`-Host der 墨信AI-Familie — ein **new-api-Fork** (`v1.0.0-rc.44`, `system_name 墨信AI`) mit **keinem Captcha** (`turnstile_check=false`) und einer einfachen E-Mail-Code-Registrierung, aber **keinem Registrierungsbonus**. Was ein Konto wertvoll macht, ist der **tägliche Check-in**: `POST /api/user/checkin` zahlte einem überzogenen Konto (`quota -97`) **201 373 Quota in einem einzigen Aufruf** zurück, und über unsere zehn Konten hinweg zahlte er **134 516 … 492 798 Quota (≈ $0,27–$0,99, Median ≈ $0,72)** bei `quota_per_unit 500000`. Der dahinterliegende Katalog umfasst **128 Live-IDs** (DeepSeek · Gemini · Claude · Qwen · MiniMax · Kimi · Grok), die OpenAI-kompatibel unter `https://www.moxin.plus/v1` bereitgestellt werden. Der Schwester-Host `www.moxin.studio` (`rc.45`, `price 1`) ist eine **separate Datenbank** — ein hier erzeugter Schlüssel antwortet dort mit `Invalid token`, und umgekehrt.

## 🎁 Kostenlose Stufe — wie viel du bekommst

**Kein Registrierungsbonus — ein Check-in pro Konto und Tag ist die Finanzierungsschiene.**

| Was | Wert |
| --- | --- |
| Registrierungsbonus | **keiner** — ein frisches Konto startet bei `quota 0`; das Tool registriert das Konto und checkt es sofort ein |
| Täglicher Check-in | `POST /api/user/checkin` → `{"checkin_date":"2026-10-22","quota_awarded":492798}`; gemessene Prämien über zehn Konten **134 516 … 492 798 Quota ≈ $0,27–$0,99 (Median ≈ $0,72)**; ein zweiter Aufruf am selben Tag antwortet mit `Already checked in today` — der Panel-Tag ist UTC+8 |
| Karte / Telefon | **keine** bei keinem Schritt |
| Captcha | **keines** (`turnstile_check=false`) — reines HTTP, kein Browser, kein Solver |
| E-Mail | `email_verification=true`, 6-Hex-Code, ~10 Min. TTL; Gmail-Klasse-Postfächer (der öffentliche Gmail-Pool funktioniert); ein recyceltes Postfach, das bereits ein Konto hat, antwortet mit `Email address is already in use` und das Tool nimmt ein frisches |
| Katalog | 141 Preiszeilen, **128 IDs** auf einem Live-Schlüssel, **0 strikt kostenlose** Zeilen (`model_ratio 0` + `model_price 0`) — das Check-in-Guthaben ist das, was du ausgibst |
| Gruppen | `default` (128 Zeilen) · `次卡` (70) · `国产模型` · `DeepSeek[羊毛]` · `Claude[特价/折扣/高质/精品]` · `GPT[折扣/高质/生图]` · `Gemini[官转/高质/折扣/特价]` · `Grok[官转/折扣]` · `Codex[…]` |
| Ablauf | das Check-in-Guthaben läuft nicht ab; kein veröffentlichtes Ratenlimit pro Schlüssel |

> 💡 Die kostenlose Stufe wird von Moxin Plus festgelegt und kann sich ändern. Prüfe die Live-Zahlen unter [www.moxin.plus](https://www.moxin.plus) — und lass das Gate des Tools selbst entscheiden:

```bash
node src/cli.js --verify     # every key in keys.txt is re-tested with two real chat calls
```

## 🤖 Modelle — alle 128

`GET /v1/models` antwortete mit **128 IDs** auf einem Live-Schlüssel (2026-10-21). Katalog-IDs sind mit Gruppen-Tags versehen (`[次]deepseek-v4.1-flash`, `[vertex次特价]gemini-4-argon`) und die **ID ohne Präfix wird ebenfalls aufgelöst**; dies wurde per Chat Ende-zu-Ende verifiziert:

| Modell-ID | Hinweis |
| --- | --- |
| `deepseek-v4.1-flash` | der Verifizierungs-Standard — 200 `"MX-PONG"`, dann `17*3 → 51`, erneut über unabhängige Ausgänge bewiesen |

> ⚠️ **Die `[次]`-Falle.** 33 der sichtbaren IDs sind als pro-Aufruf markiert (`[次]…`, `[特价次卡]…`), und der Preis-Feed markiert **70 seiner 141 Zeilen mit `quota_type=1` — einen USD-Preis pro Aufruf statt eines Verhältnisses pro Token**. Gemessen auf einem Konto über einen Ausgang (2026-10-21): `[次]deepseek-v4.1-flash` antwortete mit 200 `"MX-PONG"`, verbrannte aber **24 000 Quota (≈ $0,048) pro Aufruf**, während das einfache `deepseek-v4.1-flash` dasselbe für **150 Quota (≈ $0,0003)** antwortete — ein **160-facher Unterschied pro Aufruf für dieselbe Antwort**. Fixiere die einfache ID in deinem Router und halte `[次]`-IDs aus automatischen Kombos heraus.

Der `/api/pricing`-Feed listet 141 Zeilen auf: `deepseek-v4-flash`, `gemini-2.5-flash-lite`, `claude-haiku-4-5`, `qwen3.7-max`, `MiniMax-M3`, `kimi-k3`, `grok-4.7` und mehr, jeweils in einer oder mehreren der oben genannten Gruppen.

## 🧪 Die API verwenden

Basis-URL **`https://www.moxin.plus/v1`** — OpenAI-kompatibel:

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

Lade den Schlüssel durch einen Check-in auf — dieser Aufruf verwendet das **Session-Token**, nicht den API-Schlüssel: `POST /api/user/checkin` mit `Authorization: Bearer <access_token>`.

## 🛠 Schnellstart

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

`keys.txt` (geschrieben unter `src/`, von Git ignoriert) wird **erst** nach dem Live-Gate mit zwei Prompts geschrieben; `accounts.jsonl` bewahrt die Check-in-Nachweise auf (`quotaBefore` → `quotaAwarded` → `quota`), sodass jedes leere Konto später kostenlos mit `--revive` wiederbelebt werden kann.

### 🖱️ Der Launcher

Der Launcher fragt nach der Proxy-Liste (optional — ohne eine läuft die CLI direkt), der Kontenanzahl und dem Verifizierungsmodell, merkt sie sich in `launcher.config.json` und führt die CLI aus: mint, verify, screen proxies, settings, help und *Connect to 9Router*.

## ✅ Verifiziert funktionierend — jeder Schlüssel wird getestet

Alle untenstehenden Prüfungen wurden am **2026-10-21/22** aus dem Ausgangspool erneut ausgeführt (kein WARP):

| Prüfung | Ergebnis |
| --- | --- |
| `GET /api/status` | **200** — `system_name 墨信AI`, `v1.0.0-rc.44`, `price 0.5`, `quota_per_unit 500000`, `register_enabled`+`password_register_enabled` true, `email_verification=true`, **`turnstile_check=false`**, `checkin_enabled=true` |
| Registrierung | **✔** `GET /api/verification?email=<gmail>` 200 → Code aus dem Posteingang → `POST /api/user/register {username,password,password2,email,verification_code}` 200 |
| Check-in-Finanzierung | **✔** `POST /api/user/checkin` → `{"checkin_date":"2026-10-22","quota_awarded":492798}` ⇒ `quota -2 223 → 490 575`; dieselbe Schiene füllte fünf Konten wieder auf — vier davon aus einem negativen Quota (`-27`, `-1 369`, `-2 223`, `-10 682`) — und finanzierte die vier frischen bei der Registrierung |
| Schlüssel | **✔** `POST /api/token/` → `GET /api/token/?p=0&size=20` → **`POST /api/token/{id}/key`** gibt den vollständigen Schlüssel preis (jede Lese-Route maskiert ihn) |
| Live-Chat | **✔** `deepseek-v4.1-flash` → 200 `"MX-PONG"` und `17*3 → 51`, erneut über unabhängige Ausgänge bewiesen |
| Gruppen-Falle | **✔** ein frisches Token kann in `DeepSeek[羊毛]` landen, wo der Chat mit **403** antwortet — `PUT /api/token/ {group:"default", unlimited_quota:true}` behebt das und das Tool prüft erneut, bevor es einem Schlüssel vertraut |
| Skalierung | **✔ 10 Konten, 10/10 Schlüssel beantworten eine echte Completion**; sechs ältere Konten kamen kostenlos mit je einem Check-in zurück, vier wurden frisch erzeugt |
| Pro-Aufruf-Falle | **✔** gemessen: `[次]`-ID **24 000 Quota/Aufruf** vs. **150 Quota** für die einfache ID — dieselbe 200 |

Jederzeit erneut prüfen:

```bash
node src/cli.js --verify     # writes src/verify-report.json
```

## 🧭 So funktioniert es

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: Moxin Plus page → e-mail address → code from the inbox
   ├─▶ session: the account's access token in hand
   ├─▶ funding: POST /api/user/checkin → the daily credit
   ├─▶ key mint: the account's token endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://www.moxin.plus/v1/chat/completions → real content = the key is live
```

| Schritt | Aufruf | Hinweise |
| --- | --- | --- |
| Postfach | öffentlicher Gmail-Pool | das Panel akzeptiert Adressen der Gmail-Klasse; ein **recyceltes** Postfach kann bereits auf dem Panel existieren (`Email address is already in use`) — das Tool versucht es mit einem frischen Postfach erneut |
| Code | `GET /api/verification?email=…` dann den Posteingang lesen | ⚠ der Markenfilter muss auf den **ABSENDER** (`moxin\|studio\|墨信`) achten: die geteilten Posteingänge enthalten auch Codes anderer Panels, und ein generischer Betreff „Verification code" ist kein Beweis — die Code-Mail trägt den eigenen `墨信AI`-Absender des Panels |
| Registrierung | `POST /api/user/register {username,password,password2,email,verification_code}` | die Antwort kann ihr eigenes `access_token` enthalten; andernfalls `POST /api/user/login {username,password}` (Benutzername oder E-Mail funktionieren beide) |
| Finanzierung | `POST /api/user/checkin` | der ganze Sinn: `quota_awarded ≈ 134 516 … 492 798` pro Konto und Tag |
| Schlüssel | `POST /api/token/` → auflisten → `POST /api/token/{id}/key` | dieser Fork maskiert den Schlüssel bei jedem Lesen; die `/{id}/key`-Route gibt ihn preis |
| Gruppe | `PUT /api/token/ {group:"default", unlimited_quota:true}` | ein erzeugtes Token kann in einer Gruppe landen, die das Modell verweigert (403) — das Tool gruppiert neu und beweist erneut |
| Gate | `POST /v1/chat/completions` | ein Schlüssel wird erst dann in `keys.txt` geschrieben, wenn echte Inhalte zurückkommen (zwei Prompts: `MX-PONG`, dann `17*3 → 51`) |

## ⚙️ CLI-Optionen

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

| Umgebungsvariable | Standard | Bedeutung |
| --- | --- | --- |
| `MOXIN_BASE` | `https://www.moxin.plus` | Basis-URL des Panels |
| `MOXIN_PLUS_PROXIES` (oder `MOXIN_PROXIES`) | `proxies.txt` | Ausgangspool, eine Zeile pro Ausgang — optional; ohne einen Pool verbindet sich die CLI direkt |

## 🛰️ Hinter einem Proxy

**Optional — bei Skalierung empfohlen.** `--pool <file>` (oder `MOXIN_PLUS_PROXIES`) akzeptiert einen Ausgang pro Zeile — `http://host:port`, `https://host:port` (CONNECT) oder `socks5://host:port` (mit optionalem `user:pass@`) — und das Tool nimmt einen Ausgang pro Konto. Ohne einen Pool gibt es den Hinweis zum Direktmodus aus und verbindet sich direkt: Registrierung, Check-in und Verifizierung bleiben unverändert, nur der Weg, den die Pakete nehmen, ändert sich. `--screen` testet deine Ausgänge vor einem Lauf gegen das Panel (es wird kein Konto erstellt).

## 📄 Dateien

| Pfad | Inhalt |
| --- | --- |
| `src/keys.txt` | ein live-verifizierter Schlüssel pro Zeile — von Git ignoriert, niemals committet |
| `src/accounts.jsonl` | E-Mail, Passwort, Schlüssel, Check-in-Nachweise (`quotaBefore` / `quotaAwarded` / `quota`), Modell, Ausgang — nur lokal |
| `proxies.txt` | deine Ausgänge, einer pro Zeile — von Git ignoriert |
| `src/verify-report.json` | das letzte `--verify`-Ergebnis — von Git ignoriert |
| `launcher.config.json` | was der Launcher sich merkt — von Git ignoriert |

## 🔌 Mit 9Router verbinden

[9Router](https://9router.com) ist ein selbst gehosteter, OpenAI-kompatibler Router. Moxin Plus stellt einen OpenAI-kompatiblen Endpunkt bereit, also registriere ihn einmal und jeder Schlüssel wird zu einer Verbindung unter einem Provider-Node:

```bash
node src/connect-9router.js \
  --base http://localhost:20128 --password 123456 \
  --api-key YOUR_KEY
```

Führe es ohne `--api-key` aus, um **jeden** Schlüssel in `keys.txt` zu registrieren. Ein erneuter Lauf ist idempotent: der Node wird über `--prefix moxin-plus` abgeglichen, jede Verbindung über den Namen (`moxin-plus-001`, `moxin-plus-002`, …). Standardwerte: `--base http://localhost:20128`, `--password 123456`, `--name "Moxin Plus"`, `--prefix moxin-plus`, `--base-url https://www.moxin.plus/v1`, `--model deepseek-v4.1-flash`. Modelle werden dann als `moxin-plus/<model id>` bereitgestellt — fixiere eine **einfache** ID, keine `[次]`-ID (siehe die Falle oben).

## 🔌 Mit OmniRoute verbinden

[OmniRoute](https://omniroute.online) ist ein selbst gehosteter, OpenAI-kompatibler Router. Moxin Plus stellt einen OpenAI-kompatiblen Endpunkt bereit, also registriere ihn einmal und jeder Schlüssel wird zu einer Verbindung unter einem Provider-Node:

```bash
node src/connect-omniroute.js \
  --base http://localhost:20128 --password 123456 \
  --api-key YOUR_KEY
```

Führe es ohne `--api-key` aus, um **jeden** Schlüssel in `keys.txt` zu registrieren. Ein erneuter Lauf ist idempotent: der Node wird über `--prefix moxin-plus` abgeglichen, jede Verbindung über den Namen (`moxin-plus-001`, `moxin-plus-002`, …). Standardwerte: `--base http://localhost:20128`, `--password 123456`, `--name "Moxin Plus"`, `--prefix moxin-plus`, `--base-url https://www.moxin.plus/v1`, `--model deepseek-v4.1-flash`. Modelle werden dann als `moxin-plus/<model id>` bereitgestellt — fixiere eine **einfache** ID, keine `[次]`-ID (siehe die Falle oben).

## 🔑 Was ein Schlüssel dir bringt

| | |
| --- | --- |
| 🏢 Anbieter | **Moxin Plus (墨信AI)** — [www.moxin.plus](https://www.moxin.plus) |
| 🎁 Was der Anbieter gibt | **kein Registrierungsbonus** — der tägliche Check-in zahlt **≈$0,27–$0,99 pro Konto und Tag** (Median ≈ $0,72) |
| 🔑 Was ein Schlüssel dir bringt | den 128-ID-Katalog unter `https://www.moxin.plus/v1`, finanziert durch das Check-in-Guthaben dieses Kontos |
| 📦 Dieses Repo | **10 Schlüssel, alle chat-verifiziert** am 2026-10-21/22 |
| 🌐 API-Form | OpenAI-kompatibel: `POST https://www.moxin.plus/v1/chat/completions` |
| 🛡️ Gates | **kein Captcha**, nur E-Mail-Code; Absender-Markenfilter auf den geteilten Postfächern erforderlich |
| 🔒 Deine Daten | nur `www.moxin.plus` und der Mailbox-Dienst werden kontaktiert; Schlüssel verlassen niemals deinen Rechner |

## 🐞 Probleme

Wenn das Panel seine Register-/Check-in-Routen, seine E-Mail-Richtlinie oder den Katalog ändert, stoppt das Tool dort und sagt es dir. **[Öffne ein Issue](../../issues)** mit dem Befehl und der exakten Ausgabe.

## 📄 Lizenz

MIT © 2026 — siehe [LICENSE](LICENSE).

<div align="center">

**[MIT](LICENSE)** © 2026 moxin-plus-bulk-apikey contributors

</div>