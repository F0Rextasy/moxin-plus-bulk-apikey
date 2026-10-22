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

**Массовое создание аккаунтов Moxin Plus (墨信AI) с автоматически сгенерированными API-ключами — инференс, совместимый с OpenAI, + коннектор [9Router](https://9router.com).**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-128%20served-412991?style=for-the-badge)](https://www.moxin.plus/pricing)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 Быстрый старт](#-quick-start) · [🎁 Бесплатный тариф](#-free-tier--how-much-you-get) · [🤖 Модели](#-models--all-128-of-them) · [🧪 Использование API](#-how-to-use-the-api) · [✅ Проверено](#-verified-working--every-key-is-tested) · [🧭 Как это работает](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [⚙️ Опции](#️-cli-options) · [🛰️ Прокси](#️-behind-a-proxy) · [🐞 Проблемы](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ Зачем это нужно

Moxin Plus — это хост `www.moxin.plus` семейства 墨信AI — **форк new-api** (`v1.0.0-rc.44`, `system_name 墨信AI`) **без капчи** (`turnstile_check=false`) и с простой регистрацией по e-mail-коду, но **без бонуса за регистрацию**. Ценность аккаунта заключается в **ежедневной отметке (check-in)**: `POST /api/user/checkin` вернул одному ушедшему в минус аккаунту (`quota -97`) **201 373 quota за один вызов**, а по нашим десяти аккаунтам выплатил **134 516 … 492 798 quota (≈ $0.27–$0.99, медиана ≈ $0.72)** при `quota_per_unit 500000`. За этим стоит каталог из **128 живых id** (DeepSeek · Gemini · Claude · Qwen · MiniMax · Kimi · Grok), обслуживаемый через OpenAI-совместимый эндпоинт на `https://www.moxin.plus/v1`. Его родственный хост `www.moxin.studio` (`rc.45`, `price 1`) — это **отдельная база данных**: ключ, созданный здесь, отвечает `Invalid token` там, и наоборот.

## 🎁 Бесплатный тариф — сколько вы получаете

**Бонуса за регистрацию нет — один check-in на аккаунт в день является источником средств.**

| Что | Значение |
| --- | --- |
| Бонус за регистрацию | **нет** — новый аккаунт начинается с `quota 0`; инструмент регистрирует аккаунт и сразу выполняет check-in |
| Ежедневный check-in | `POST /api/user/checkin` → `{"checkin_date":"2026-10-22","quota_awarded":492798}`; измеренные награды по десяти аккаунтам **134 516 … 492 798 quota ≈ $0.27–$0.99 (медиана ≈ $0.72)**; повторный вызов в тот же день отвечает `Already checked in today` — день панели по UTC+8 |
| Карта / телефон | **нет** ни на одном шаге |
| Капча | **нет** (`turnstile_check=false`) — обычный HTTP, без браузера, без решателя |
| E-mail | `email_verification=true`, 6-символьный hex-код, TTL ~10 мин; ящики класса Gmail (публичный пул gmail работает); переиспользованный ящик, на котором уже есть аккаунт, отвечает `Email address is already in use`, и инструмент берёт свежий |
| Каталог | 141 строка цен, **128 id** на живом ключе, **0 строго бесплатных** строк (`model_ratio 0` + `model_price 0`) — вы тратите именно кредит от check-in |
| Группы | `default` (128 строк) · `次卡` (70) · `国产模型` · `DeepSeek[羊毛]` · `Claude[特价/折扣/高质/精品]` · `GPT[折扣/高质/生图]` · `Gemini[官转/高质/折扣/特价]` · `Grok[官转/折扣]` · `Codex[…]` |
| Срок действия | кредит от check-in не истекает; опубликованного лимита запросов на ключ нет |

> 💡 Бесплатный тариф устанавливается Moxin Plus и может измениться. Проверяйте актуальные цифры на [www.moxin.plus](https://www.moxin.plus) — и пусть решение принимает собственный гейт инструмента:

```bash
node src/cli.js --verify     # every key in keys.txt is re-tested with two real chat calls
```

## 🤖 Модели — все 128

`GET /v1/models` вернул **128 id** на живом ключе (2026-10-21). Id каталога помечены тегами групп (`[次]deepseek-v4.1-flash`, `[vertex次特价]gemini-4-argon`), и **id без префикса тоже разрешается**; это было проверено чатом от начала до конца:

| Model ID | примечание |
| --- | --- |
| `deepseek-v4.1-flash` | модель по умолчанию для проверки — 200 `"MX-PONG"`, затем `17*3 → 51`, повторно подтверждено через независимые выходы |

> ⚠️ **Ловушка `[次]`.** 33 из видимых id помечены как оплачиваемые за вызов (`[次]…`, `[特价次卡]…`), а лента цен помечает **70 из своих 141 строк `quota_type=1` — цена в USD за вызов вместо коэффициента за токен**. Измерено на одном аккаунте через один выход (2026-10-21): `[次]deepseek-v4.1-flash` ответил 200 `"MX-PONG"`, но сжёг **24 000 quota (≈ $0.048) за вызов**, тогда как обычный `deepseek-v4.1-flash` ответил то же самое за **150 quota (≈ $0.0003)** — **разница в 160× за вызов при одинаковом ответе**. Закрепите обычный id в вашем роутере и держите id `[次]` вне автоматических комбинаций.

Лента `/api/pricing` перечисляет 141 строку: `deepseek-v4-flash`, `gemini-2.5-flash-lite`, `claude-haiku-4-5`, `qwen3.7-max`, `MiniMax-M3`, `kimi-k3`, `grok-4.7` и другие, каждая в одной или нескольких из указанных выше групп.

## 🧪 Как использовать API

Базовый URL **`https://www.moxin.plus/v1`** — совместим с OpenAI:

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

Пополняйте ключ через check-in — этот вызов принимает **токен сессии**, а не API-ключ: `POST /api/user/checkin` с `Authorization: Bearer <access_token>`.

## 🛠 Быстрый старт

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

`keys.txt` (записывается в `src/`, игнорируется git) записывается **только** после живого гейта с двумя запросами; `accounts.jsonl` хранит доказательства check-in (`quotaBefore` → `quotaAwarded` → `quota`), так что любой опустошённый аккаунт можно позже оживить с помощью `--revive` — бесплатно.

### 🖱️ Лаунчер

Лаунчер запрашивает список прокси (необязательно — без него CLI работает напрямую), количество аккаунтов и модель для проверки, запоминает их в `launcher.config.json` и запускает CLI: mint, verify, screen proxies, settings, help и *Connect to 9Router*.

## ✅ Проверено в работе — каждый ключ протестирован

Все проверки ниже были повторно выполнены **2026-10-21/22** из пула выходов (без WARP):

| Проверка | Результат |
| --- | --- |
| `GET /api/status` | **200** — `system_name 墨信AI`, `v1.0.0-rc.44`, `price 0.5`, `quota_per_unit 500000`, `register_enabled`+`password_register_enabled` true, `email_verification=true`, **`turnstile_check=false`**, `checkin_enabled=true` |
| регистрация | **✔** `GET /api/verification?email=<gmail>` 200 → код из ящика → `POST /api/user/register {username,password,password2,email,verification_code}` 200 |
| финансирование через check-in | **✔** `POST /api/user/checkin` → `{"checkin_date":"2026-10-22","quota_awarded":492798}` ⇒ `quota -2 223 → 490 575`; тот же механизм пополнил пять аккаунтов — четыре из них с отрицательной quota (`-27`, `-1 369`, `-2 223`, `-10 682`) — и профинансировал четыре свежих при регистрации |
| ключ | **✔** `POST /api/token/` → `GET /api/token/?p=0&size=20` → **`POST /api/token/{id}/key`** раскрывает полный ключ (все маршруты чтения маскируют его) |
| живой чат | **✔** `deepseek-v4.1-flash` → 200 `"MX-PONG"` и `17*3 → 51`, повторно подтверждено через независимые выходы |
| ловушка группы | **✔** свежий токен может попасть в `DeepSeek[羊毛]`, где чат отвечает **403** — `PUT /api/token/ {group:"default", unlimited_quota:true}` исправляет это, и инструмент перепроверяет, прежде чем доверять ключу |
| масштаб | **✔ 10 аккаунтов, 10/10 ключей отвечают на реальный запрос завершения**; шесть старых аккаунтов вернулись бесплатно с одним check-in каждый, четыре были созданы заново |
| ловушка за вызов | **✔** измерено: id `[次]` **24 000 quota/вызов** против **150 quota** для обычного id — одинаковый 200 |

Перепроверить в любой момент:

```bash
node src/cli.js --verify     # writes src/verify-report.json
```

## 🧭 Как это работает

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: Moxin Plus page → e-mail address → code from the inbox
   ├─▶ session: the account's access token in hand
   ├─▶ funding: POST /api/user/checkin → the daily credit
   ├─▶ key mint: the account's token endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://www.moxin.plus/v1/chat/completions → real content = the key is live
```

| Шаг | Вызов | Примечания |
| --- | --- | --- |
| почтовый ящик | публичный пул Gmail | панель принимает адреса класса Gmail; **переиспользованный** ящик может уже существовать на панели (`Email address is already in use`) — инструмент повторяет попытку со свежим ящиком |
| код | `GET /api/verification?email=…`, затем чтение ящика | ⚠ фильтр бренда должен опираться на **ОТПРАВИТЕЛЯ** (`moxin\|studio\|墨信`): общие ящики также содержат коды других панелей, и общая тема «verification code» не является доказательством — письмо с кодом несёт собственного отправителя панели `墨信AI` |
| регистрация | `POST /api/user/register {username,password,password2,email,verification_code}` | ответ может содержать собственный `access_token`; иначе `POST /api/user/login {username,password}` (подходят и имя пользователя, и e-mail) |
| финансирование | `POST /api/user/checkin` | весь смысл: `quota_awarded ≈ 134 516 … 492 798` на аккаунт в день |
| ключ | `POST /api/token/` → список → `POST /api/token/{id}/key` | этот форк маскирует ключ при любом чтении; маршрут `/{id}/key` раскрывает его |
| группа | `PUT /api/token/ {group:"default", unlimited_quota:true}` | созданный токен может попасть в группу, которая отказывает в модели (403) — инструмент меняет группу и перепроверяет |
| гейт | `POST /v1/chat/completions` | ключ записывается в `keys.txt` только после получения реального контента (два запроса: `MX-PONG`, затем `17*3 → 51`) |

## ⚙️ Опции CLI

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

| Переменная окружения | По умолчанию | Значение |
| --- | --- | --- |
| `MOXIN_BASE` | `https://www.moxin.plus` | базовый URL панели |
| `MOXIN_PLUS_PROXIES` (или `MOXIN_PROXIES`) | `proxies.txt` | пул выходов, по одному в строке — необязательно; без пула CLI подключается напрямую |

## 🛰️ За прокси

**Необязательно — рекомендуется при масштабе.** `--pool <file>` (или `MOXIN_PLUS_PROXIES`) принимает по одному выходу в строке — `http://host:port`, `https://host:port` (CONNECT) или `socks5://host:port` (с необязательным `user:pass@`) — и инструмент берёт по одному выходу на аккаунт. Без пула он выводит примечание о прямом режиме и подключается напрямую: регистрация, check-in и проверка не меняются, меняется только то, откуда уходят пакеты. `--screen` тестирует ваши выходы против панели перед запуском (аккаунт не создаётся).

## 📄 Файлы

| Путь | Содержимое |
| --- | --- |
| `src/keys.txt` | по одному проверенному в работе ключу в строке — игнорируется git, никогда не коммитится |
| `src/accounts.jsonl` | e-mail, пароль, ключ, доказательства check-in (`quotaBefore` / `quotaAwarded` / `quota`), модель, выход — только локально |
| `proxies.txt` | ваши выходы, по одному в строке — игнорируется git |
| `src/verify-report.json` | результат последнего `--verify` — игнорируется git |
| `launcher.config.json` | то, что запоминает лаунчер — игнорируется git |

## 🔌 Подключение к 9Router

[9Router](https://9router.com) — это самостоятельно размещаемый роутер, совместимый с OpenAI. Moxin Plus предоставляет OpenAI-совместимый эндпоинт, поэтому зарегистрируйте его один раз, и каждый ключ станет соединением под одним узлом-провайдером:

```bash
node src/connect-9router.js \
  --base http://localhost:20128 --password 123456 \
  --api-key YOUR_KEY
```

Запустите его без `--api-key`, чтобы зарегистрировать **каждый** ключ из `keys.txt`. Повторный запуск идемпотентен: узел сопоставляется по `--prefix moxin-plus`, каждое соединение — по имени (`moxin-plus-001`, `moxin-plus-002`, …). Значения по умолчанию: `--base http://localhost:20128`, `--password 123456`, `--name "Moxin Plus"`, `--prefix moxin-plus`, `--base-url https://www.moxin.plus/v1`, `--model deepseek-v4.1-flash`. Затем модели обслуживаются как `moxin-plus/<model id>` — закрепите **обычный** id, а не `[次]` (см. ловушку выше).

## 🔑 Что даёт один ключ

| | |
| --- | --- |
| 🏢 Провайдер | **Moxin Plus (墨信AI)** — [www.moxin.plus](https://www.moxin.plus) |
| 🎁 Что даёт провайдер | **бонуса за регистрацию нет** — ежедневный check-in выплачивает **≈$0.27–$0.99 на аккаунт в день** (медиана ≈ $0.72) |
| 🔑 Что даёт один ключ | каталог из 128 id на `https://www.moxin.plus/v1`, финансируемый кредитом check-in этого аккаунта |
| 📦 Этот репозиторий | **10 ключей, все проверены чатом** 2026-10-21/22 |
| 🌐 Форма API | совместим с OpenAI: `POST https://www.moxin.plus/v1/chat/completions` |
| 🛡️ Гейты | **без капчи**, только e-mail-код; требуется фильтр бренда отправителя на общих ящиках |
| 🔒 Ваши данные | контакт только с `www.moxin.plus` и почтовым сервисом; ключи никогда не покидают вашу машину |

## 🐞 Проблемы

Если панель изменит свои маршруты регистрации/check-in, свою политику e-mail или каталог, инструмент остановится на этом месте и сообщит об этом. **[Откройте issue](../../issues)** с командой и точным выводом.

## 📄 Лицензия

MIT © 2026 — см. [LICENSE](LICENSE).

<div align="center">

**[MIT](LICENSE)** © 2026 moxin-plus-bulk-apikey contributors

</div>