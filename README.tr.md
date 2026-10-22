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

**Otomatik oluşturulan API anahtarlarıyla toplu Moxin Plus (墨信AI) hesabı oluşturun — OpenAI uyumlu çıkarım + [9Router](https://9router.com) bağlayıcısı.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-128%20served-412991?style=for-the-badge)](https://www.moxin.plus/pricing)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![OmniRoute](https://img.shields.io/badge/OmniRoute-connector-8B5CF6?style=for-the-badge)](#-connect-to-omniroute)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 Hızlı başlangıç](#-quick-start) · [🎁 Ücretsiz katman](#-free-tier--how-much-you-get) · [🤖 Modeller](#-models--all-128-of-them) · [🧪 API'yi kullanma](#-how-to-use-the-api) · [✅ Doğrulandı](#-verified-working--every-key-is-tested) · [🧭 Nasıl çalışır](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [⚙️ Seçenekler](#️-cli-options) · [🛰️ Proxy'ler](#️-behind-a-proxy) · [🐞 Sorunlar](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ Bu neden var

Moxin Plus, 墨信AI ailesinin `www.moxin.plus` sunucusudur — bir **new-api çatalı** (`v1.0.0-rc.44`, `system_name 墨信AI`), **captcha yok** (`turnstile_check=false`) ve düz e-posta kodu ile kayıt var, ancak **kayıt bonusu yok**. Bir hesabı değerli kılan şey **günlük giriş**tir: `POST /api/user/checkin` bir eksi bakiyeli hesaba (`quota -97`) **tek çağrıda 201 373 kota geri ödedi** ve on hesabımız genelinde **134 516 … 492 798 kota (≈ $0.27–$0.99, medyan ≈ $0.72)** ödedi; `quota_per_unit 500000` ile. Arkasındaki katalog **128 canlı id**dir (DeepSeek · Gemini · Claude · Qwen · MiniMax · Kimi · Grok) ve `https://www.moxin.plus/v1` üzerinde OpenAI uyumlu olarak sunulur. Kardeş sunucusu `www.moxin.studio` (`rc.45`, `price 1`) **ayrı bir veritabanıdır** — burada üretilen bir anahtar orada `Invalid token` yanıtı verir ve tersi de geçerlidir.

## 🎁 Ücretsiz katman — ne kadar alıyorsunuz

**Kayıt bonusu yok — hesap başına günde bir giriş, fonlama rayıdır.**

| Ne | Değer |
| --- | --- |
| Kayıt bonusu | **yok** — yeni bir hesap `quota 0` ile başlar; araç hesabı kaydeder ve hemen giriş yapar |
| Günlük giriş | `POST /api/user/checkin` → `{"checkin_date":"2026-10-22","quota_awarded":492798}`; on hesap genelinde ölçülen ödüller **134 516 … 492 798 kota ≈ $0.27–$0.99 (medyan ≈ $0.72)**; aynı gün ikinci çağrı `Already checked in today` yanıtı verir — panel günü UTC+8'dir |
| Kart / telefon | hiçbir adımda **yok** |
| Captcha | **yok** (`turnstile_check=false`) — düz HTTP, tarayıcı yok, çözücü yok |
| E-posta | `email_verification=true`, 6 haneli hex kod, ~10 dk TTL; Gmail sınıfı kutular (herkese açık gmail havuzu çalışır); zaten hesabı olan geri dönüştürülmüş bir kutu `Email address is already in use` yanıtı verir ve araç yeni bir tane alır |
| Katalog | 141 fiyatlandırma satırı, canlı bir anahtarda **128 id**, **0 katı ücretsiz** satır (`model_ratio 0` + `model_price 0`) — harcadığınız şey giriş kredisidir |
| Gruplar | `default` (128 satır) · `次卡` (70) · `国产模型` · `DeepSeek[羊毛]` · `Claude[特价/折扣/高质/精品]` · `GPT[折扣/高质/生图]` · `Gemini[官转/高质/折扣/特价]` · `Grok[官转/折扣]` · `Codex[…]` |
| Bitiş | giriş kredisinin süresi dolmaz; yayınlanmış anahtar başına hız sınırı yoktur |

> 💡 Ücretsiz katman Moxin Plus tarafından belirlenir ve değişebilir. Canlı sayıları [www.moxin.plus](https://www.moxin.plus) adresinden kontrol edin — ve kararı aracın kendi kapısına bırakın:

```bash
node src/cli.js --verify     # every key in keys.txt is re-tested with two real chat calls
```

## 🤖 Modeller — 128'inin tamamı

`GET /v1/models` canlı bir anahtarda **128 id** yanıtladı (2026-10-21). Katalog id'leri grup etiketlidir (`[次]deepseek-v4.1-flash`, `[vertex次特价]gemini-4-argon`) ve **öneksiz id de çözümlenir**; bu, uçtan uca sohbet ile doğrulandı:

| Model ID | not |
| --- | --- |
| `deepseek-v4.1-flash` | doğrulama varsayılanı — 200 `"MX-PONG"`, ardından `17*3 → 51`, bağımsız çıkışlar üzerinden yeniden kanıtlandı |

> ⚠️ **`[次]` tuzağı.** Görünen id'lerin 33'ü çağrı başına olarak etiketlenmiştir (`[次]…`, `[特价次卡]…`) ve fiyatlandırma akışı **141 satırının 70'ini `quota_type=1` olarak işaretler — token başına oran yerine çağrı başına USD fiyatı**. Bir hesapta tek bir çıkış üzerinden ölçüldü (2026-10-21): `[次]deepseek-v4.1-flash` 200 `"MX-PONG"` yanıtladı ancak **çağrı başına 24 000 kota (≈ $0.048) yaktı**, oysa düz `deepseek-v4.1-flash` aynı şeyi **150 kota (≈ $0.0003)** karşılığında yanıtladı — **aynı yanıt için çağrı başına 160× fark**. Yönlendiricinizde düz id'yi sabitleyin ve `[次]` id'lerini otomatik kombinasyonların dışında tutun.

`/api/pricing` akışı 141 satır listeler: `deepseek-v4-flash`, `gemini-2.5-flash-lite`, `claude-haiku-4-5`, `qwen3.7-max`, `MiniMax-M3`, `kimi-k3`, `grok-4.7` ve daha fazlası; her biri yukarıdaki gruplardan birinde veya daha fazlasında.

## 🧪 API nasıl kullanılır

Temel URL **`https://www.moxin.plus/v1`** — OpenAI uyumlu:

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

Anahtarı giriş yaparak doldurun — bu çağrı API anahtarını değil, **oturum tokenını** alır: `Authorization: Bearer <access_token>` ile `POST /api/user/checkin`.

## 🛠 Hızlı başlangıç

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

`keys.txt` (`src/` altında yazılır, git tarafından yok sayılır) **yalnızca** canlı iki istemli kapıdan sonra yazılır; `accounts.jsonl` giriş kanıtını (`quotaBefore` → `quotaAwarded` → `quota`) saklar, böylece kuru herhangi bir hesap daha sonra `--revive` ile ücretsiz olarak canlandırılabilir.

### 🖱️ Başlatıcı

Başlatıcı proxy listesini (isteğe bağlı — olmadan CLI doğrudan çalışır), hesap sayısını ve doğrulama modelini sorar, bunları `launcher.config.json` içinde hatırlar ve CLI'yi çalıştırır: üret, doğrula, proxy'leri tara, ayarlar, yardım ve *9Router'a Bağlan*.

## ✅ Çalıştığı doğrulandı — her anahtar test edilir

Aşağıdaki tüm kontroller **2026-10-21/22** tarihinde çıkış havuzundan (WARP olmadan) yeniden çalıştırıldı:

| Kontrol | Sonuç |
| --- | --- |
| `GET /api/status` | **200** — `system_name 墨信AI`, `v1.0.0-rc.44`, `price 0.5`, `quota_per_unit 500000`, `register_enabled`+`password_register_enabled` true, `email_verification=true`, **`turnstile_check=false`**, `checkin_enabled=true` |
| kayıt | **✔** `GET /api/verification?email=<gmail>` 200 → gelen kutusundan kod → `POST /api/user/register {username,password,password2,email,verification_code}` 200 |
| giriş fonlaması | **✔** `POST /api/user/checkin` → `{"checkin_date":"2026-10-22","quota_awarded":492798}` ⇒ `quota -2 223 → 490 575`; aynı ray beş hesabı yeniden doldurdu — dördü eksi bakiyeden (`-27`, `-1 369`, `-2 223`, `-10 682`) — ve dört yeni hesabı kayıt sırasında fonladı |
| anahtar | **✔** `POST /api/token/` → `GET /api/token/?p=0&size=20` → **`POST /api/token/{id}/key`** tam anahtarı açığa çıkarır (her okuma rotası onu maskeler) |
| canlı sohbet | **✔** `deepseek-v4.1-flash` → 200 `"MX-PONG"` ve `17*3 → 51`, bağımsız çıkışlar üzerinden yeniden kanıtlandı |
| grup tuzağı | **✔** yeni bir token, sohbetin **403** yanıtladığı `DeepSeek[羊毛]` grubuna düşebilir — `PUT /api/token/ {group:"default", unlimited_quota:true}` bunu düzeltir ve araç bir anahtara güvenmeden önce yeniden kontrol eder |
| ölçek | **✔ 10 hesap, 10/10 anahtar gerçek bir tamamlama yanıtlıyor**; altı eski hesap her biri bir girişle ücretsiz geri geldi, dördü yeni üretildi |
| çağrı başına tuzak | **✔** ölçüldü: `[次]` id **24 000 kota/çağrı** vs düz id için **150 kota** — aynı 200 |

İstediğiniz zaman yeniden kontrol edin:

```bash
node src/cli.js --verify     # writes src/verify-report.json
```

## 🧭 Nasıl çalışır

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: Moxin Plus page → e-mail address → code from the inbox
   ├─▶ session: the account's access token in hand
   ├─▶ funding: POST /api/user/checkin → the daily credit
   ├─▶ key mint: the account's token endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://www.moxin.plus/v1/chat/completions → real content = the key is live
```

| Adım | Çağrı | Notlar |
| --- | --- | --- |
| posta kutusu | herkese açık Gmail havuzu | panel Gmail sınıfı adresleri kabul eder; **geri dönüştürülmüş** bir kutu panelde zaten var olabilir (`Email address is already in use`) — araç yeni bir kutuyla yeniden dener |
| kod | `GET /api/verification?email=…` ardından gelen kutusunu oku | ⚠ marka filtresi **GÖNDEREN** üzerinden anahtarlanmalıdır (`moxin\|studio\|墨信`): paylaşılan gelen kutuları diğer panellerin kodlarını da taşır ve genel bir "verification code" konusu kanıt değildir — kod postası panelin kendi `墨信AI` gönderenini taşır |
| kayıt | `POST /api/user/register {username,password,password2,email,verification_code}` | yanıt kendi `access_token`'ını taşıyabilir; aksi halde `POST /api/user/login {username,password}` (kullanıcı adı veya e-posta ikisi de çalışır) |
| fonlama | `POST /api/user/checkin` | asıl mesele: hesap başına günde `quota_awarded ≈ 134 516 … 492 798` |
| anahtar | `POST /api/token/` → listele → `POST /api/token/{id}/key` | bu çatal her okumada anahtarı maskeler; `/{id}/key` rotası onu açığa çıkarır |
| grup | `PUT /api/token/ {group:"default", unlimited_quota:true}` | üretilen bir token, modeli reddeden bir gruba düşebilir (403) — araç yeniden gruplar ve yeniden kanıtlar |
| kapı | `POST /v1/chat/completions` | bir anahtar `keys.txt` dosyasına yalnızca gerçek içerik geri geldikten sonra yazılır (iki istem: `MX-PONG`, ardından `17*3 → 51`) |

## ⚙️ CLI seçenekleri

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

| Ortam değişkeni | Varsayılan | Anlamı |
| --- | --- | --- |
| `MOXIN_BASE` | `https://www.moxin.plus` | panel temel URL'si |
| `MOXIN_PLUS_PROXIES` (veya `MOXIN_PROXIES`) | `proxies.txt` | çıkış havuzu, satır başına bir çıkış — isteğe bağlı; havuz olmadan CLI doğrudan bağlanır |

## 🛰️ Proxy arkasında

**İsteğe bağlı — ölçekte önerilir.** `--pool <file>` (veya `MOXIN_PLUS_PROXIES`) satır başına bir çıkış kabul eder — `http://host:port`, `https://host:port` (CONNECT) veya `socks5://host:port` (isteğe bağlı `user:pass@` ile) — ve araç hesap başına bir çıkış alır. Havuz olmadan doğrudan mod notunu yazdırır ve doğrudan bağlanır: kayıt, giriş ve doğrulama değişmez, yalnızca paketlerin nereden çıktığı değişir. `--screen`, bir çalıştırmadan önce çıkışlarınızı panele karşı test eder (hiçbir hesap oluşturulmaz).

## 📄 Dosyalar

| Yol | İçerik |
| --- | --- |
| `src/keys.txt` | satır başına bir canlı doğrulanmış anahtar — git tarafından yok sayılır, asla işlenmez |
| `src/accounts.jsonl` | e-posta, parola, anahtar, giriş kanıtı (`quotaBefore` / `quotaAwarded` / `quota`), model, çıkış — yalnızca yerel |
| `proxies.txt` | çıkışlarınız, satır başına bir tane — git tarafından yok sayılır |
| `src/verify-report.json` | son `--verify` sonucu — git tarafından yok sayılır |
| `launcher.config.json` | başlatıcının hatırladıkları — git tarafından yok sayılır |

## 🔌 9Router'a bağlan

[9Router](https://9router.com) kendi kendine barındırılan, OpenAI uyumlu bir yönlendiricidir. Moxin Plus, OpenAI uyumlu bir uç nokta sunar; bu yüzden bir kez kaydedin ve her anahtar tek bir sağlayıcı düğümü altında bir bağlantı haline gelir:

```bash
node src/connect-9router.js \
  --base http://localhost:20128 --password 123456 \
  --api-key YOUR_KEY
```

`--api-key` olmadan çalıştırın, `keys.txt` içindeki **her** anahtarı kaydetmek için. Yeniden çalıştırmak etkisizdir (idempotent): düğüm `--prefix moxin-plus` ile, her bağlantı adıyla (`moxin-plus-001`, `moxin-plus-002`, …) eşleştirilir. Varsayılanlar: `--base http://localhost:20128`, `--password 123456`, `--name "Moxin Plus"`, `--prefix moxin-plus`, `--base-url https://www.moxin.plus/v1`, `--model deepseek-v4.1-flash`. Modeller daha sonra `moxin-plus/<model id>` olarak sunulur — `[次]` olanı değil, **düz** bir id sabitleyin (yukarıdaki tuzağa bakın).

## 🔌 OmniRoute'a bağlan

[OmniRoute](https://omniroute.online) kendi kendine barındırılan, OpenAI uyumlu bir yönlendiricidir. Moxin Plus, OpenAI uyumlu bir uç nokta sunar; bu yüzden bir kez kaydedin ve her anahtar tek bir sağlayıcı düğümü altında bir bağlantı haline gelir:

```bash
node src/connect-omniroute.js \
  --base http://localhost:20128 --password 123456 \
  --api-key YOUR_KEY
```

`--api-key` olmadan çalıştırın, `keys.txt` içindeki **her** anahtarı kaydetmek için. Yeniden çalıştırmak etkisizdir (idempotent): düğüm `--prefix moxin-plus` ile, her bağlantı adıyla (`moxin-plus-001`, `moxin-plus-002`, …) eşleştirilir. Varsayılanlar: `--base http://localhost:20128`, `--password 123456`, `--name "Moxin Plus"`, `--prefix moxin-plus`, `--base-url https://www.moxin.plus/v1`, `--model deepseek-v4.1-flash`. Modeller daha sonra `moxin-plus/<model id>` olarak sunulur — `[次]` olanı değil, **düz** bir id sabitleyin (yukarıdaki tuzağa bakın).
## 🔑 Bir anahtar size ne kazandırır

| | |
| --- | --- |
| 🏢 Sağlayıcı | **Moxin Plus (墨信AI)** — [www.moxin.plus](https://www.moxin.plus) |
| 🎁 Sağlayıcının verdikleri | **kayıt bonusu yok** — günlük giriş **hesap başına günde ≈$0.27–$0.99** öder (medyan ≈ $0.72) |
| 🔑 Bir anahtarın size kazandırdıkları | `https://www.moxin.plus/v1` üzerindeki 128 id'lik katalog, o hesabın giriş kredisiyle fonlanır |
| 📦 Bu depo | **10 anahtar, tamamı sohbet ile doğrulandı** 2026-10-21/22 tarihinde |
| 🌐 API şekli | OpenAI uyumlu: `POST https://www.moxin.plus/v1/chat/completions` |
| 🛡️ Kapılar | **captcha yok**, yalnızca e-posta kodu; paylaşılan posta kutularında gönderen marka filtresi gerekir |
| 🔒 Verileriniz | yalnızca `www.moxin.plus` ve posta kutusu hizmetiyle iletişim kurulur; anahtarlar makinenizden asla ayrılmaz |

## 🐞 Sorunlar

Panel kayıt/giriş rotalarını, e-posta politikasını veya kataloğu değiştirirse, araç orada durur ve bunu söyler. Komut ve tam çıktıyla birlikte **[bir sorun açın](../../issues)**.

## 📄 Lisans

MIT © 2026 — bkz. [LICENSE](LICENSE).

<div align="center">

**[MIT](LICENSE)** © 2026 moxin-plus-bulk-apikey katkıda bulunanlar

</div>