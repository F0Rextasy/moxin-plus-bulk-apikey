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

**Crea cuentas de Moxin Plus (墨信AI) en masa con claves API autogeneradas — inferencia compatible con OpenAI + conector [9Router](https://9router.com).**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-128%20served-412991?style=for-the-badge)](https://www.moxin.plus/pricing)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![OmniRoute](https://img.shields.io/badge/OmniRoute-connector-8B5CF6?style=for-the-badge)](#-connect-to-omniroute)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 Inicio rápido](#-quick-start) · [🎁 Nivel gratuito](#-free-tier--how-much-you-get) · [🤖 Modelos](#-models--all-128-of-them) · [🧪 Usar la API](#-how-to-use-the-api) · [✅ Verificado](#-verified-working--every-key-is-tested) · [🧭 Cómo funciona](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [🔌 OmniRoute](#-connect-to-omniroute) · [⚙️ Opciones](#️-cli-options) · [🛰️ Proxies](#️-behind-a-proxy) · [🐞 Problemas](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ Por qué existe esto

Moxin Plus es el host `www.moxin.plus` de la familia 墨信AI — un **fork de new-api** (`v1.0.0-rc.44`, `system_name 墨信AI`) **sin captcha** (`turnstile_check=false`) y con un registro sencillo por correo electrónico y código, pero **sin bono de registro**. Lo que hace que una cuenta valga la pena es el **check-in diario**: `POST /api/user/checkin` pagó a una cuenta sobregirada (`quota -97`) **201 373 de quota en una sola llamada**, y entre nuestras diez cuentas pagó **134 516 … 492 798 de quota (≈ $0.27–$0.99, mediana ≈ $0.72)** con `quota_per_unit 500000`. El catálogo detrás es de **128 ids activos** (DeepSeek · Gemini · Claude · Qwen · MiniMax · Kimi · Grok) servidos de forma compatible con OpenAI en `https://www.moxin.plus/v1`. Su host hermano `www.moxin.studio` (`rc.45`, `price 1`) es una **base de datos separada** — una clave generada aquí responde `Invalid token` allí, y viceversa.

## 🎁 Nivel gratuito — cuánto obtienes

**Sin bono de registro — un check-in por cuenta al día es la vía de financiación.**

| Qué | Valor |
| --- | --- |
| Bono de registro | **ninguno** — una cuenta nueva empieza en `quota 0`; la herramienta registra la cuenta y hace check-in inmediatamente |
| Check-in diario | `POST /api/user/checkin` → `{"checkin_date":"2026-10-22","quota_awarded":492798}`; premios medidos entre diez cuentas **134 516 … 492 798 de quota ≈ $0.27–$0.99 (mediana ≈ $0.72)**; una segunda llamada el mismo día responde `Already checked in today` — el día del panel es UTC+8 |
| Tarjeta / teléfono | **ninguno** en ningún paso |
| Captcha | **ninguno** (`turnstile_check=false`) — HTTP simple, sin navegador, sin solucionador |
| Correo electrónico | `email_verification=true`, código de 6 hex, TTL ~10 min; buzones tipo Gmail (el pool público de gmail funciona); un buzón reciclado que ya tiene una cuenta responde `Email address is already in use` y la herramienta toma uno nuevo |
| Catálogo | 141 filas de precios, **128 ids** en una clave activa, **0 filas estrictamente gratuitas** (`model_ratio 0` + `model_price 0`) — el crédito del check-in es lo que gastas |
| Grupos | `default` (128 filas) · `次卡` (70) · `国产模型` · `DeepSeek[羊毛]` · `Claude[特价/折扣/高质/精品]` · `GPT[折扣/高质/生图]` · `Gemini[官转/高质/折扣/特价]` · `Grok[官转/折扣]` · `Codex[…]` |
| Caducidad | el crédito del check-in no caduca; no hay límite de tasa publicado por clave |

> 💡 El nivel gratuito lo establece Moxin Plus y puede cambiar. Consulta los números en vivo en [www.moxin.plus](https://www.moxin.plus) — y deja que la propia puerta de la herramienta decida:

```bash
node src/cli.js --verify     # every key in keys.txt is re-tested with two real chat calls
```

## 🤖 Modelos — los 128

`GET /v1/models` respondió **128 ids** en una clave activa (2026-10-21). Los ids del catálogo llevan etiqueta de grupo (`[次]deepseek-v4.1-flash`, `[vertex次特价]gemini-4-argon`) y el **id sin prefijo también resuelve**; esto se verificó por chat de extremo a extremo:

| ID de modelo | nota |
| --- | --- |
| `deepseek-v4.1-flash` | el predeterminado de verificación — 200 `"MX-PONG"`, luego `17*3 → 51`, reprobado a través de salidas independientes |

> ⚠️ **La trampa `[次]`.** 33 de los ids visibles están etiquetados como por llamada (`[次]…`, `[特价次卡]…`), y el feed de precios marca **70 de sus 141 filas `quota_type=1` — un precio por llamada en USD en lugar de una ratio por token**. Medido en una cuenta a través de una salida (2026-10-21): `[次]deepseek-v4.1-flash` respondió 200 `"MX-PONG"` pero quemó **24 000 de quota (≈ $0.048) por llamada**, mientras que el `deepseek-v4.1-flash` simple respondió lo mismo por **150 de quota (≈ $0.0003)** — una **diferencia de 160× por llamada para la misma respuesta**. Fija el id simple en tu router y mantén los ids `[次]` fuera de las combinaciones automáticas.

El feed `/api/pricing` lista 141 filas: `deepseek-v4-flash`, `gemini-2.5-flash-lite`, `claude-haiku-4-5`, `qwen3.7-max`, `MiniMax-M3`, `kimi-k3`, `grok-4.7` y más, cada uno en uno o varios de los grupos anteriores.

## 🧪 Cómo usar la API

URL base **`https://www.moxin.plus/v1`** — compatible con OpenAI:

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

Recarga la clave haciendo check-in — esa llamada toma el **token de sesión**, no la clave API: `POST /api/user/checkin` con `Authorization: Bearer <access_token>`.

## 🛠 Inicio rápido

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

`keys.txt` (escrito bajo `src/`, ignorado por git) se escribe **solo** después de la puerta en vivo de dos prompts; `accounts.jsonl` guarda la evidencia del check-in (`quotaBefore` → `quotaAwarded` → `quota`) para que cualquier cuenta seca pueda revivirse después con `--revive` — gratis.

### 🖱️ El lanzador

El lanzador pide la lista de proxies (opcional — sin una, el CLI se ejecuta directo), el número de cuentas y el modelo de verificación, los recuerda en `launcher.config.json` y ejecuta el CLI: mint, verify, screen proxies, settings, help y *Connect to 9Router*.

## ✅ Verificado funcionando — cada clave se prueba

Todas las comprobaciones siguientes se volvieron a ejecutar el **2026-10-21/22** desde el pool de salidas (sin WARP):

| Comprobación | Resultado |
| --- | --- |
| `GET /api/status` | **200** — `system_name 墨信AI`, `v1.0.0-rc.44`, `price 0.5`, `quota_per_unit 500000`, `register_enabled`+`password_register_enabled` true, `email_verification=true`, **`turnstile_check=false`**, `checkin_enabled=true` |
| registro | **✔** `GET /api/verification?email=<gmail>` 200 → código desde la bandeja de entrada → `POST /api/user/register {username,password,password2,email,verification_code}` 200 |
| financiación por check-in | **✔** `POST /api/user/checkin` → `{"checkin_date":"2026-10-22","quota_awarded":492798}` ⇒ `quota -2 223 → 490 575`; la misma vía recargó cinco cuentas — cuatro de ellas desde una quota negativa (`-27`, `-1 369`, `-2 223`, `-10 682`) — y financió las cuatro nuevas en el registro |
| clave | **✔** `POST /api/token/` → `GET /api/token/?p=0&size=20` → **`POST /api/token/{id}/key`** revela la clave completa (todas las rutas de lectura la enmascaran) |
| chat en vivo | **✔** `deepseek-v4.1-flash` → 200 `"MX-PONG"` y `17*3 → 51`, reprobado a través de salidas independientes |
| trampa de grupo | **✔** un token nuevo puede caer en `DeepSeek[羊毛]` donde el chat responde **403** — `PUT /api/token/ {group:"default", unlimited_quota:true}` lo arregla y la herramienta vuelve a comprobar antes de confiar en una clave |
| escala | **✔ 10 cuentas, 10/10 claves responden una completion real**; seis cuentas antiguas volvieron gratis con un check-in cada una, cuatro se crearon nuevas |
| trampa por llamada | **✔** medido: id `[次]` **24 000 de quota/llamada** vs **150 de quota** para el id simple — mismo 200 |

Vuelve a comprobar en cualquier momento:

```bash
node src/cli.js --verify     # writes src/verify-report.json
```

## 🧭 Cómo funciona

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: Moxin Plus page → e-mail address → code from the inbox
   ├─▶ session: the account's access token in hand
   ├─▶ funding: POST /api/user/checkin → the daily credit
   ├─▶ key mint: the account's token endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://www.moxin.plus/v1/chat/completions → real content = the key is live
```

| Paso | Llamada | Notas |
| --- | --- | --- |
| buzón | pool público de Gmail | el panel acepta direcciones tipo Gmail; un buzón **reciclado** puede existir ya en el panel (`Email address is already in use`) — la herramienta reintenta con un buzón nuevo |
| código | `GET /api/verification?email=…` y luego leer la bandeja de entrada | ⚠ el filtro de marca debe basarse en el **REMITENTE** (`moxin\|studio\|墨信`): las bandejas compartidas también llevan códigos de otros paneles, y un asunto genérico de "verification code" no es evidencia — el correo del código lleva el remitente propio del panel, `墨信AI` |
| registro | `POST /api/user/register {username,password,password2,email,verification_code}` | la respuesta puede traer su propio `access_token`; si no, `POST /api/user/login {username,password}` (tanto el nombre de usuario como el correo funcionan) |
| financiar | `POST /api/user/checkin` | el objetivo: `quota_awarded ≈ 134 516 … 492 798` por cuenta por día |
| clave | `POST /api/token/` → listar → `POST /api/token/{id}/key` | este fork enmascara la clave en cada lectura; la ruta `/{id}/key` la revela |
| grupo | `PUT /api/token/ {group:"default", unlimited_quota:true}` | un token recién creado puede caer en un grupo que rechaza el modelo (403) — la herramienta reagrupa y vuelve a probar |
| puerta | `POST /v1/chat/completions` | una clave se escribe en `keys.txt` solo después de que vuelve contenido real (dos prompts: `MX-PONG`, luego `17*3 → 51`) |

## ⚙️ Opciones del CLI

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

| Variable de entorno | Predeterminado | Significado |
| --- | --- | --- |
| `MOXIN_BASE` | `https://www.moxin.plus` | URL base del panel |
| `MOXIN_PLUS_PROXIES` (o `MOXIN_PROXIES`) | `proxies.txt` | pool de salidas, una línea por salida — opcional; sin pool el CLI se conecta directamente |

## 🛰️ Detrás de un proxy

**Opcional — recomendado a escala.** `--pool <file>` (o `MOXIN_PLUS_PROXIES`) acepta una salida por línea — `http://host:port`, `https://host:port` (CONNECT) o `socks5://host:port` (con `user:pass@` opcional) — y la herramienta toma una salida por cuenta. Sin un pool, imprime la nota de modo directo y se conecta directamente: el registro, el check-in y la verificación no cambian, solo desde dónde salen los paquetes. `--screen` prueba tus salidas contra el panel antes de una ejecución (no se crea ninguna cuenta).

## 📄 Archivos

| Ruta | Contenido |
| --- | --- |
| `src/keys.txt` | una clave verificada en vivo por línea — ignorada por git, nunca comprometida |
| `src/accounts.jsonl` | correo, contraseña, clave, evidencia del check-in (`quotaBefore` / `quotaAwarded` / `quota`), modelo, salida — solo local |
| `proxies.txt` | tus salidas, una por línea — ignorado por git |
| `src/verify-report.json` | el último resultado de `--verify` — ignorado por git |
| `launcher.config.json` | lo que recuerda el lanzador — ignorado por git |

## 🔌 Conectar con 9Router

[9Router](https://9router.com) es un router autoalojado y compatible con OpenAI. Moxin Plus sirve un endpoint compatible con OpenAI, así que regístralo una vez y cada clave se convierte en una conexión bajo un único nodo de proveedor:

```bash
node src/connect-9router.js \
  --base http://localhost:20128 --password 123456 \
  --api-key YOUR_KEY
```

Ejecútalo sin `--api-key` para registrar **todas** las claves en `keys.txt`. Volver a ejecutarlo es idempotente: el nodo se empareja por `--prefix moxin-plus`, cada conexión por nombre (`moxin-plus-001`, `moxin-plus-002`, …). Predeterminados: `--base http://localhost:20128`, `--password 123456`, `--name "Moxin Plus"`, `--prefix moxin-plus`, `--base-url https://www.moxin.plus/v1`, `--model deepseek-v4.1-flash`. Los modelos se sirven entonces como `moxin-plus/<model id>` — fija un id **simple**, no uno `[次]` (ver la trampa anterior).

## 🔌 Conectar con OmniRoute

[OmniRoute](https://omniroute.online) es un router autoalojado y compatible con OpenAI. Moxin Plus sirve un endpoint compatible con OpenAI, así que regístralo una vez y cada clave se convierte en una conexión bajo un único nodo de proveedor:

```bash
node src/connect-omniroute.js \
  --base http://localhost:20128 --password 123456 \
  --api-key YOUR_KEY
```

Ejecútalo sin `--api-key` para registrar **todas** las claves en `keys.txt`. Volver a ejecutarlo es idempotente: el nodo se empareja por `--prefix moxin-plus`, cada conexión por nombre (`moxin-plus-001`, `moxin-plus-002`, …). Predeterminados: `--base http://localhost:20128`, `--password 123456`, `--name "Moxin Plus"`, `--prefix moxin-plus`, `--base-url https://www.moxin.plus/v1`, `--model deepseek-v4.1-flash`. Los modelos se sirven entonces como `moxin-plus/<model id>` — fija un id **simple**, no uno `[次]` (ver la trampa anterior).

## 🔑 Qué te da una clave

| | |
| --- | --- |
| 🏢 Proveedor | **Moxin Plus (墨信AI)** — [www.moxin.plus](https://www.moxin.plus) |
| 🎁 Qué da el proveedor | **sin bono de registro** — el check-in diario paga **≈$0.27–$0.99 por cuenta por día** (mediana ≈ $0.72) |
| 🔑 Qué te da una clave | el catálogo de 128 ids en `https://www.moxin.plus/v1`, financiado por el crédito de check-in de esa cuenta |
| 📦 Este repositorio | **10 claves, todas verificadas por chat** el 2026-10-21/22 |
| 🌐 Forma de la API | Compatible con OpenAI: `POST https://www.moxin.plus/v1/chat/completions` |
| 🛡️ Puertas | **sin captcha**, solo código por correo; se requiere filtro de marca del remitente en los buzones compartidos |
| 🔒 Tus datos | solo se contacta con `www.moxin.plus` y el servicio de buzón; las claves nunca salen de tu máquina |

## 🐞 Problemas

Si el panel cambia sus rutas de registro/check-in, su política de correo o el catálogo, la herramienta se detiene ahí y lo indica. **[Abre un issue](../../issues)** con el comando y la salida exacta.

## 📄 Licencia

MIT © 2026 — ver [LICENSE](LICENSE).

<div align="center">

**[MIT](LICENSE)** © 2026 moxin-plus-bulk-apikey contributors

</div>