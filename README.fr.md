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

**Créez en masse des comptes Moxin Plus (墨信AI) avec des clés API générées automatiquement — inférence compatible OpenAI + connecteur [9Router](https://9router.com).**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-128%20served-412991?style=for-the-badge)](https://www.moxin.plus/pricing)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![OmniRoute](https://img.shields.io/badge/OmniRoute-connector-8B5CF6?style=for-the-badge)](#-connect-to-omniroute)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 Démarrage rapide](#-quick-start) · [🎁 Offre gratuite](#-free-tier--how-much-you-get) · [🤖 Modèles](#-models--all-128-of-them) · [🧪 Utiliser l'API](#-how-to-use-the-api) · [✅ Vérifié](#-verified-working--every-key-is-tested) · [🧭 Comment ça marche](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [⚙️ Options](#️-cli-options) · [🛰️ Proxys](#️-behind-a-proxy) · [🐞 Problèmes](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ Pourquoi cela existe

Moxin Plus est l'hôte `www.moxin.plus` de la famille 墨信AI — un **fork de new-api** (`v1.0.0-rc.44`, `system_name 墨信AI`) **sans captcha** (`turnstile_check=false`) et avec une inscription simple par code e-mail, mais **sans bonus d'inscription**. Ce qui rend un compte intéressant, c'est le **check-in quotidien** : `POST /api/user/checkin` a reversé à un compte à découvert (`quota -97`) **201 373 quota en un seul appel**, et sur nos dix comptes il a versé **134 516 … 492 798 quota (≈ 0,27 $–0,99 $, médiane ≈ 0,72 $)** à `quota_per_unit 500000`. Le catalogue derrière compte **128 ids actifs** (DeepSeek · Gemini · Claude · Qwen · MiniMax · Kimi · Grok) servis en compatible OpenAI sur `https://www.moxin.plus/v1`. Son hôte frère `www.moxin.studio` (`rc.45`, `price 1`) est une **base de données distincte** — une clé créée ici répond `Invalid token` là-bas, et inversement.

## 🎁 Offre gratuite — combien vous obtenez

**Aucun bonus d'inscription — un check-in par compte et par jour est le moyen de financement.**

| Quoi | Valeur |
| --- | --- |
| Bonus d'inscription | **aucun** — un compte neuf démarre à `quota 0` ; l'outil enregistre le compte et le fait immédiatement pointer |
| Check-in quotidien | `POST /api/user/checkin` → `{"checkin_date":"2026-10-22","quota_awarded":492798}` ; montants mesurés sur dix comptes **134 516 … 492 798 quota ≈ 0,27 $–0,99 $ (médiane ≈ 0,72 $)** ; un second appel le même jour répond `Already checked in today` — le jour du panneau est en UTC+8 |
| Carte / téléphone | **aucun** à aucune étape |
| Captcha | **aucun** (`turnstile_check=false`) — HTTP simple, pas de navigateur, pas de solveur |
| E-mail | `email_verification=true`, code de 6 caractères hexadécimaux, TTL ~10 min ; boîtes de classe Gmail (le pool gmail public fonctionne) ; une boîte recyclée qui a déjà un compte répond `Email address is already in use` et l'outil en prend une nouvelle |
| Catalogue | 141 lignes de tarification, **128 ids** sur une clé active, **0 ligne strictement gratuite** (`model_ratio 0` + `model_price 0`) — le crédit du check-in est ce que vous dépensez |
| Groupes | `default` (128 lignes) · `次卡` (70) · `国产模型` · `DeepSeek[羊毛]` · `Claude[特价/折扣/高质/精品]` · `GPT[折扣/高质/生图]` · `Gemini[官转/高质/折扣/特价]` · `Grok[官转/折扣]` · `Codex[…]` |
| Expiration | le crédit du check-in n'expire pas ; aucune limite de débit par clé publiée |

> 💡 L'offre gratuite est définie par Moxin Plus et peut changer. Consultez les chiffres en direct sur [www.moxin.plus](https://www.moxin.plus) — et laissez la propre barrière de l'outil décider :

```bash
node src/cli.js --verify     # every key in keys.txt is re-tested with two real chat calls
```

## 🤖 Modèles — les 128

`GET /v1/models` a répondu **128 ids** sur une clé active (2026-10-21). Les ids du catalogue sont étiquetés par groupe (`[次]deepseek-v4.1-flash`, `[vertex次特价]gemini-4-argon`) et **l'id sans préfixe se résout aussi** ; cela a été vérifié par chat de bout en bout :

| ID du modèle | note |
| --- | --- |
| `deepseek-v4.1-flash` | la valeur par défaut de vérification — 200 `"MX-PONG"`, puis `17*3 → 51`, revérifié via des sorties indépendantes |

> ⚠️ **Le piège `[次]`.** 33 des ids visibles sont étiquetés comme facturés à l'appel (`[次]…`, `[特价次卡]…`), et le flux de tarification marque **70 de ses 141 lignes `quota_type=1` — un prix USD par appel au lieu d'un ratio par token**. Mesuré sur un compte via une sortie (2026-10-21) : `[次]deepseek-v4.1-flash` a répondu 200 `"MX-PONG"` mais a brûlé **24 000 quota (≈ 0,048 $) par appel**, tandis que le simple `deepseek-v4.1-flash` a répondu la même chose pour **150 quota (≈ 0,0003 $)** — une **différence de 160× par appel pour la même réponse**. Épinglez l'id simple dans votre routeur et tenez les ids `[次]` hors des combos automatiques.

Le flux `/api/pricing` liste 141 lignes : `deepseek-v4-flash`, `gemini-2.5-flash-lite`, `claude-haiku-4-5`, `qwen3.7-max`, `MiniMax-M3`, `kimi-k3`, `grok-4.7` et plus, chacun dans un ou plusieurs des groupes ci-dessus.

## 🧪 Comment utiliser l'API

URL de base **`https://www.moxin.plus/v1`** — compatible OpenAI :

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

Rechargez la clé en pointant — cet appel prend le **jeton de session**, pas la clé API : `POST /api/user/checkin` avec `Authorization: Bearer <access_token>`.

## 🛠 Démarrage rapide

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

`keys.txt` (écrit sous `src/`, ignoré par git) n'est écrit **qu'**après la barrière en direct à deux invites ; `accounts.jsonl` conserve les preuves de check-in (`quotaBefore` → `quotaAwarded` → `quota`) afin que tout compte à sec puisse être réactivé plus tard avec `--revive` — gratuitement.

### 🖱️ Le lanceur

Le lanceur demande la liste de proxys (facultative — sans elle, le CLI se connecte directement), le nombre de comptes et le modèle de vérification, les mémorise dans `launcher.config.json`, et exécute le CLI : mint, verify, screen proxies, settings, help, et *Connect to 9Router*.

## ✅ Vérifié fonctionnel — chaque clé est testée

Toutes les vérifications ci-dessous ont été relancées le **2026-10-21/22** depuis le pool de sorties (sans WARP) :

| Vérification | Résultat |
| --- | --- |
| `GET /api/status` | **200** — `system_name 墨信AI`, `v1.0.0-rc.44`, `price 0.5`, `quota_per_unit 500000`, `register_enabled`+`password_register_enabled` true, `email_verification=true`, **`turnstile_check=false`**, `checkin_enabled=true` |
| inscription | **✔** `GET /api/verification?email=<gmail>` 200 → code depuis la boîte de réception → `POST /api/user/register {username,password,password2,email,verification_code}` 200 |
| financement par check-in | **✔** `POST /api/user/checkin` → `{"checkin_date":"2026-10-22","quota_awarded":492798}` ⇒ `quota -2 223 → 490 575` ; ce même mécanisme a rechargé cinq comptes — dont quatre depuis un quota négatif (`-27`, `-1 369`, `-2 223`, `-10 682`) — et a financé les quatre nouveaux à l'inscription |
| clé | **✔** `POST /api/token/` → `GET /api/token/?p=0&size=20` → **`POST /api/token/{id}/key`** révèle la clé complète (toutes les routes de lecture la masquent) |
| chat en direct | **✔** `deepseek-v4.1-flash` → 200 `"MX-PONG"` et `17*3 → 51`, revérifié via des sorties indépendantes |
| piège de groupe | **✔** un jeton neuf peut atterrir dans `DeepSeek[羊毛]` où le chat répond **403** — `PUT /api/token/ {group:"default", unlimited_quota:true}` corrige cela et l'outil revérifie avant de faire confiance à une clé |
| échelle | **✔ 10 comptes, 10/10 clés répondent à une vraie complétion** ; six comptes plus anciens sont revenus gratuitement avec un check-in chacun, quatre ont été créés de zéro |
| piège par appel | **✔** mesuré : id `[次]` **24 000 quota/appel** contre **150 quota** pour l'id simple — même 200 |

Revérifiez à tout moment :

```bash
node src/cli.js --verify     # writes src/verify-report.json
```

## 🧭 Comment ça marche

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: Moxin Plus page → e-mail address → code from the inbox
   ├─▶ session: the account's access token in hand
   ├─▶ funding: POST /api/user/checkin → the daily credit
   ├─▶ key mint: the account's token endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://www.moxin.plus/v1/chat/completions → real content = the key is live
```

| Étape | Appel | Notes |
| --- | --- | --- |
| boîte mail | pool Gmail public | le panneau accepte les adresses de classe Gmail ; une boîte **recyclée** peut déjà exister sur le panneau (`Email address is already in use`) — l'outil réessaie avec une boîte neuve |
| code | `GET /api/verification?email=…` puis lecture de la boîte | ⚠ le filtre de marque doit porter sur l'**EXPÉDITEUR** (`moxin\|studio\|墨信`) : les boîtes partagées transportent aussi les codes d'autres panneaux, et un objet générique « verification code » n'est pas une preuve — le mail de code porte l'expéditeur propre au panneau `墨信AI` |
| inscription | `POST /api/user/register {username,password,password2,email,verification_code}` | la réponse peut porter son propre `access_token` ; sinon `POST /api/user/login {username,password}` (nom d'utilisateur ou e-mail, les deux fonctionnent) |
| financement | `POST /api/user/checkin` | tout l'intérêt : `quota_awarded ≈ 134 516 … 492 798` par compte et par jour |
| clé | `POST /api/token/` → list → `POST /api/token/{id}/key` | ce fork masque la clé dans chaque lecture ; la route `/{id}/key` la révèle |
| groupe | `PUT /api/token/ {group:"default", unlimited_quota:true}` | un jeton créé peut atterrir dans un groupe qui refuse le modèle (403) — l'outil regroupe et revérifie |
| barrière | `POST /v1/chat/completions` | une clé n'est écrite dans `keys.txt` qu'après le retour d'un contenu réel (deux invites : `MX-PONG`, puis `17*3 → 51`) |

## ⚙️ Options du CLI

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

| Variable d'environnement | Défaut | Signification |
| --- | --- | --- |
| `MOXIN_BASE` | `https://www.moxin.plus` | URL de base du panneau |
| `MOXIN_PLUS_PROXIES` (ou `MOXIN_PROXIES`) | `proxies.txt` | pool de sorties, une ligne par sortie — facultatif ; sans pool, le CLI se connecte directement |

## 🛰️ Derrière un proxy

**Facultatif — recommandé à grande échelle.** `--pool <file>` (ou `MOXIN_PLUS_PROXIES`) accepte une sortie par ligne — `http://host:port`, `https://host:port` (CONNECT) ou `socks5://host:port` (avec `user:pass@` facultatif) — et l'outil prend une sortie par compte. Sans pool, il affiche la note de mode direct et se connecte directement : inscription, check-in et vérification sont inchangés, seul le point de départ des paquets change. `--screen` teste vos sorties contre le panneau avant une exécution (aucun compte n'est créé).

## 📄 Fichiers

| Chemin | Contenu |
| --- | --- |
| `src/keys.txt` | une clé vérifiée en direct par ligne — ignoré par git, jamais commité |
| `src/accounts.jsonl` | e-mail, mot de passe, clé, preuves de check-in (`quotaBefore` / `quotaAwarded` / `quota`), modèle, sortie — local uniquement |
| `proxies.txt` | vos sorties, une par ligne — ignoré par git |
| `src/verify-report.json` | le dernier résultat de `--verify` — ignoré par git |
| `launcher.config.json` | ce que le lanceur mémorise — ignoré par git |

## 🔌 Connexion à 9Router

[9Router](https://9router.com) est un routeur auto-hébergé compatible OpenAI. Moxin Plus sert un point de terminaison compatible OpenAI, alors enregistrez-le une fois et chaque clé devient une connexion sous un même nœud fournisseur :

```bash
node src/connect-9router.js \
  --base http://localhost:20128 --password 123456 \
  --api-key YOUR_KEY
```

Exécutez-le sans `--api-key` pour enregistrer **toutes** les clés de `keys.txt`. La réexécution est idempotente : le nœud est mis en correspondance par `--prefix moxin-plus`, chaque connexion par son nom (`moxin-plus-001`, `moxin-plus-002`, …). Valeurs par défaut : `--base http://localhost:20128`, `--password 123456`, `--name "Moxin Plus"`, `--prefix moxin-plus`, `--base-url https://www.moxin.plus/v1`, `--model deepseek-v4.1-flash`. Les modèles sont alors servis sous `moxin-plus/<model id>` — épinglez un id **simple**, pas un id `[次]` (voir le piège ci-dessus).

## 🔌 Connexion à OmniRoute

[OmniRoute](https://omniroute.online) est un routeur auto-hébergé compatible OpenAI. Moxin Plus sert un point de terminaison compatible OpenAI, alors enregistrez-le une fois et chaque clé devient une connexion sous un même nœud fournisseur :

```bash
node src/connect-omniroute.js \
  --base http://localhost:20128 --password 123456 \
  --api-key YOUR_KEY
```

Exécutez-le sans `--api-key` pour enregistrer **toutes** les clés de `keys.txt`. La réexécution est idempotente : le nœud est mis en correspondance par `--prefix moxin-plus`, chaque connexion par son nom (`moxin-plus-001`, `moxin-plus-002`, …). Valeurs par défaut : `--base http://localhost:20128`, `--password 123456`, `--name "Moxin Plus"`, `--prefix moxin-plus`, `--base-url https://www.moxin.plus/v1`, `--model deepseek-v4.1-flash`. Les modèles sont alors servis sous `moxin-plus/<model id>` — épinglez un id **simple**, pas un id `[次]` (voir le piège ci-dessus).
## 🔑 Ce qu'une clé vous apporte

| | |
| --- | --- |
| 🏢 Fournisseur | **Moxin Plus (墨信AI)** — [www.moxin.plus](https://www.moxin.plus) |
| 🎁 Ce que le fournisseur donne | **aucun bonus d'inscription** — le check-in quotidien verse **≈ 0,27 $–0,99 $ par compte et par jour** (médiane ≈ 0,72 $) |
| 🔑 Ce qu'une clé vous apporte | le catalogue de 128 ids sur `https://www.moxin.plus/v1`, financé par le crédit de check-in de ce compte |
| 📦 Ce dépôt | **10 clés, toutes vérifiées par chat** le 2026-10-21/22 |
| 🌐 Forme de l'API | compatible OpenAI : `POST https://www.moxin.plus/v1/chat/completions` |
| 🛡️ Barrières | **aucun captcha**, code e-mail uniquement ; filtre de marque d'expéditeur requis sur les boîtes partagées |
| 🔒 Vos données | seuls `www.moxin.plus` et le service de boîte mail sont contactés ; les clés ne quittent jamais votre machine |

## 🐞 Problèmes

Si le panneau modifie ses routes d'inscription/check-in, sa politique e-mail ou le catalogue, l'outil s'arrête là et le signale. **[Ouvrez un ticket](../../issues)** avec la commande et la sortie exacte.

## 📄 Licence

MIT © 2026 — voir [LICENSE](LICENSE).

<div align="center">

**[MIT](LICENSE)** © 2026 moxin-plus-bulk-apikey contributors

</div>