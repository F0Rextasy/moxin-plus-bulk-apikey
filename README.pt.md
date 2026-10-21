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

**Crie contas Moxin Plus (墨信AI) em massa com chaves de API geradas automaticamente — inferência compatível com OpenAI + conector [9Router](https://9router.com).**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-128%20served-412991?style=for-the-badge)](https://www.moxin.plus/pricing)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 Início rápido](#-quick-start) · [🎁 Plano gratuito](#-free-tier--how-much-you-get) · [🤖 Modelos](#-models--all-128-of-them) · [🧪 Use a API](#-how-to-use-the-api) · [✅ Verificado](#-verified-working--every-key-is-tested) · [🧭 Como funciona](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [⚙️ Opções](#️-cli-options) · [🛰️ Proxies](#️-behind-a-proxy) · [🐞 Problemas](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ Por que isto existe

Moxin Plus é o host `www.moxin.plus` da família 墨信AI — um **fork do new-api** (`v1.0.0-rc.44`, `system_name 墨信AI`) **sem captcha** (`turnstile_check=false`) e com cadastro simples por código de e-mail, mas **sem bônus de cadastro**. O que torna uma conta valiosa é o **check-in diário**: `POST /api/user/checkin` pagou a uma conta no negativo (`quota -97`) **201 373 de quota de volta em uma única chamada**, e entre nossas dez contas pagou **134 516 … 492 798 de quota (≈ $0,27–$0,99, mediana ≈ $0,72)** com `quota_per_unit 500000`. O catálogo por trás disso tem **128 ids ativos** (DeepSeek · Gemini · Claude · Qwen · MiniMax · Kimi · Grok) servidos de forma compatível com OpenAI em `https://www.moxin.plus/v1`. Seu host irmão `www.moxin.studio` (`rc.45`, `price 1`) é um **banco de dados separado** — uma chave criada aqui responde `Invalid token` lá, e vice-versa.

## 🎁 Plano gratuito — quanto você recebe

**Sem bônus de cadastro — um check-in por conta por dia é a via de financiamento.**

| O quê | Valor |
| --- | --- |
| Bônus de cadastro | **nenhum** — uma conta nova começa com `quota 0`; a ferramenta registra a conta e faz o check-in imediatamente |
| Check-in diário | `POST /api/user/checkin` → `{"checkin_date":"2026-10-22","quota_awarded":492798}`; prêmios medidos entre dez contas **134 516 … 492 798 de quota ≈ $0,27–$0,99 (mediana ≈ $0,72)**; uma segunda chamada no mesmo dia responde `Already checked in today` — o dia do painel é UTC+8 |
| Cartão / telefone | **nenhum** em nenhuma etapa |
| Captcha | **nenhum** (`turnstile_check=false`) — HTTP puro, sem navegador, sem solucionador |
| E-mail | `email_verification=true`, código de 6 hexadecimais, TTL de ~10 min; caixas classe Gmail (o pool público de gmail funciona); uma caixa reciclada que já tem conta responde `Email address is already in use` e a ferramenta pega uma nova |
| Catálogo | 141 linhas de preço, **128 ids** em uma chave ativa, **0 linhas estritamente gratuitas** (`model_ratio 0` + `model_price 0`) — o crédito do check-in é o que você gasta |
| Grupos | `default` (128 linhas) · `次卡` (70) · `国产模型` · `DeepSeek[羊毛]` · `Claude[特价/折扣/高质/精品]` · `GPT[折扣/高质/生图]` · `Gemini[官转/高质/折扣/特价]` · `Grok[官转/折扣]` · `Codex[…]` |
| Expiração | o crédito do check-in não expira; nenhum limite de taxa por chave publicado |

> 💡 O plano gratuito é definido pelo Moxin Plus e pode mudar. Confira os números ao vivo em [www.moxin.plus](https://www.moxin.plus) — e deixe o próprio gate da ferramenta decidir:

```bash
node src/cli.js --verify     # every key in keys.txt is re-tested with two real chat calls
```

## 🤖 Modelos — todos os 128

`GET /v1/models` respondeu **128 ids** em uma chave ativa (2026-10-21). Os ids do catálogo são marcados por grupo (`[次]deepseek-v4.1-flash`, `[vertex次特价]gemini-4-argon`) e o **id sem prefixo também resolve**; isto foi verificado por chat de ponta a ponta:

| ID do modelo | observação |
| --- | --- |
| `deepseek-v4.1-flash` | o padrão de verificação — 200 `"MX-PONG"`, depois `17*3 → 51`, reprovado por saídas independentes |

> ⚠️ **A armadilha do `[次]`.** 33 dos ids visíveis são marcados como por chamada (`[次]…`, `[特价次卡]…`), e o feed de preços marca **70 de suas 141 linhas como `quota_type=1` — um preço em USD por chamada em vez de uma proporção por token**. Medido em uma conta através de uma saída (2026-10-21): `[次]deepseek-v4.1-flash` respondeu 200 `"MX-PONG"` mas queimou **24 000 de quota (≈ $0,048) por chamada**, enquanto o `deepseek-v4.1-flash` simples respondeu a mesma coisa por **150 de quota (≈ $0,0003)** — uma **diferença de 160× por chamada para a mesma resposta**. Fixe o id simples no seu roteador e mantenha os ids `[次]` fora de combos automáticos.

O feed `/api/pricing` lista 141 linhas: `deepseek-v4-flash`, `gemini-2.5-flash-lite`, `claude-haiku-4-5`, `qwen3.7-max`, `MiniMax-M3`, `kimi-k3`, `grok-4.7` e mais, cada um em um ou mais dos grupos acima.

## 🧪 Como usar a API

URL base **`https://www.moxin.plus/v1`** — compatível com OpenAI:

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

Recarregue a chave fazendo check-in — essa chamada usa o **token de sessão**, não a chave de API: `POST /api/user/checkin` com `Authorization: Bearer <access_token>`.

## 🛠 Início rápido

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

`keys.txt` (gravado em `src/`, ignorado pelo git) é escrito **somente** após o gate ao vivo de dois prompts; `accounts.jsonl` guarda a evidência do check-in (`quotaBefore` → `quotaAwarded` → `quota`) para que qualquer conta seca possa ser revivida depois com `--revive` — de graça.

### 🖱️ O launcher

O launcher pede a lista de proxies (opcional — sem uma, o CLI roda direto), o número de contas e o modelo de verificação, lembra-os em `launcher.config.json` e executa o CLI: criar, verificar, testar proxies, configurações, ajuda e *Conectar ao 9Router*.

## ✅ Verificado e funcionando — toda chave é testada

Todas as verificações abaixo foram refeitas em **2026-10-21/22** a partir do pool de saídas (sem WARP):

| Verificação | Resultado |
| --- | --- |
| `GET /api/status` | **200** — `system_name 墨信AI`, `v1.0.0-rc.44`, `price 0.5`, `quota_per_unit 500000`, `register_enabled`+`password_register_enabled` true, `email_verification=true`, **`turnstile_check=false`**, `checkin_enabled=true` |
| registro | **✔** `GET /api/verification?email=<gmail>` 200 → código da caixa de entrada → `POST /api/user/register {username,password,password2,email,verification_code}` 200 |
| financiamento por check-in | **✔** `POST /api/user/checkin` → `{"checkin_date":"2026-10-22","quota_awarded":492798}` ⇒ `quota -2 223 → 490 575`; a mesma via reabasteceu cinco contas — quatro delas a partir de uma quota negativa (`-27`, `-1 369`, `-2 223`, `-10 682`) — e financiou as quatro novas no registro |
| chave | **✔** `POST /api/token/` → `GET /api/token/?p=0&size=20` → **`POST /api/token/{id}/key`** revela a chave completa (todas as rotas de leitura a mascaram) |
| chat ao vivo | **✔** `deepseek-v4.1-flash` → 200 `"MX-PONG"` e `17*3 → 51`, reprovado por saídas independentes |
| armadilha de grupo | **✔** um token novo pode cair em `DeepSeek[羊毛]` onde o chat responde **403** — `PUT /api/token/ {group:"default", unlimited_quota:true}` corrige isso e a ferramenta reverifica antes de confiar em uma chave |
| escala | **✔ 10 contas, 10/10 chaves respondem a uma conclusão real**; seis contas mais antigas voltaram de graça com um check-in cada, quatro foram criadas do zero |
| armadilha por chamada | **✔** medido: id `[次]` **24 000 de quota/chamada** vs **150 de quota** para o id simples — mesmo 200 |

Reverifique a qualquer momento:

```bash
node src/cli.js --verify     # writes src/verify-report.json
```

## 🧭 Como funciona

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: Moxin Plus page → e-mail address → code from the inbox
   ├─▶ session: the account's access token in hand
   ├─▶ funding: POST /api/user/checkin → the daily credit
   ├─▶ key mint: the account's token endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://www.moxin.plus/v1/chat/completions → real content = the key is live
```

| Etapa | Chamada | Observações |
| --- | --- | --- |
| caixa de correio | pool público de Gmail | o painel aceita endereços classe Gmail; uma caixa **reciclada** pode já existir no painel (`Email address is already in use`) — a ferramenta tenta novamente com uma caixa nova |
| código | `GET /api/verification?email=…` e depois ler a caixa de entrada | ⚠ o filtro de marca deve se basear no **REMETENTE** (`moxin\|studio\|墨信`): as caixas de entrada compartilhadas também carregam códigos de outros painéis, e um assunto genérico "verification code" não é evidência — o e-mail do código carrega o próprio remetente `墨信AI` do painel |
| registro | `POST /api/user/register {username,password,password2,email,verification_code}` | a resposta pode carregar seu próprio `access_token`; caso contrário, `POST /api/user/login {username,password}` (nome de usuário ou e-mail funcionam) |
| financiar | `POST /api/user/checkin` | o ponto principal: `quota_awarded ≈ 134 516 … 492 798` por conta por dia |
| chave | `POST /api/token/` → listar → `POST /api/token/{id}/key` | este fork mascara a chave em toda leitura; a rota `/{id}/key` a revela |
| grupo | `PUT /api/token/ {group:"default", unlimited_quota:true}` | um token criado pode cair em um grupo que recusa o modelo (403) — a ferramenta reagrupa e reprova |
| gate | `POST /v1/chat/completions` | uma chave só é gravada em `keys.txt` depois que conteúdo real retorna (dois prompts: `MX-PONG`, depois `17*3 → 51`) |

## ⚙️ Opções do CLI

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

| Variável de ambiente | Padrão | Significado |
| --- | --- | --- |
| `MOXIN_BASE` | `https://www.moxin.plus` | URL base do painel |
| `MOXIN_PLUS_PROXIES` (ou `MOXIN_PROXIES`) | `proxies.txt` | pool de saídas, uma linha por saída — opcional; sem um pool o CLI se conecta diretamente |

## 🛰️ Atrás de um proxy

**Opcional — recomendado em escala.** `--pool <file>` (ou `MOXIN_PLUS_PROXIES`) aceita uma saída por linha — `http://host:port`, `https://host:port` (CONNECT) ou `socks5://host:port` (com `user:pass@` opcional) — e a ferramenta usa uma saída por conta. Sem um pool, ela imprime a nota de modo direto e se conecta diretamente: cadastro, check-in e verificação permanecem iguais, só muda de onde os pacotes saem. `--screen` testa suas saídas contra o painel antes de uma execução (nenhuma conta é criada).

## 📄 Arquivos

| Caminho | Conteúdo |
| --- | --- |
| `src/keys.txt` | uma chave verificada ao vivo por linha — ignorada pelo git, nunca commitada |
| `src/accounts.jsonl` | e-mail, senha, chave, evidência de check-in (`quotaBefore` / `quotaAwarded` / `quota`), modelo, saída — apenas local |
| `proxies.txt` | suas saídas, uma por linha — ignorado pelo git |
| `src/verify-report.json` | o último resultado de `--verify` — ignorado pelo git |
| `launcher.config.json` | o que o launcher lembra — ignorado pelo git |

## 🔌 Conectar ao 9Router

[9Router](https://9router.com) é um roteador auto-hospedado e compatível com OpenAI. O Moxin Plus serve um endpoint compatível com OpenAI, então registre-o uma vez e toda chave se torna uma conexão sob um único nó de provedor:

```bash
node src/connect-9router.js \
  --base http://localhost:20128 --password 123456 \
  --api-key YOUR_KEY
```

Execute sem `--api-key` para registrar **todas** as chaves em `keys.txt`. Reexecutar é idempotente: o nó é correspondido por `--prefix moxin-plus`, cada conexão por nome (`moxin-plus-001`, `moxin-plus-002`, …). Padrões: `--base http://localhost:20128`, `--password 123456`, `--name "Moxin Plus"`, `--prefix moxin-plus`, `--base-url https://www.moxin.plus/v1`, `--model deepseek-v4.1-flash`. Os modelos são então servidos como `moxin-plus/<model id>` — fixe um id **simples**, não um `[次]` (veja a armadilha acima).

## 🔑 O que uma chave te dá

| | |
| --- | --- |
| 🏢 Provedor | **Moxin Plus (墨信AI)** — [www.moxin.plus](https://www.moxin.plus) |
| 🎁 O que o provedor dá | **sem bônus de cadastro** — o check-in diário paga **≈$0,27–$0,99 por conta por dia** (mediana ≈ $0,72) |
| 🔑 O que uma chave te dá | o catálogo de 128 ids em `https://www.moxin.plus/v1`, financiado pelo crédito de check-in dessa conta |
| 📦 Este repositório | **10 chaves, todas verificadas por chat** em 2026-10-21/22 |
| 🌐 Formato da API | Compatível com OpenAI: `POST https://www.moxin.plus/v1/chat/completions` |
| 🛡️ Gates | **sem captcha**, apenas código de e-mail; filtro de marca do remetente necessário nas caixas compartilhadas |
| 🔒 Seus dados | apenas `www.moxin.plus` e o serviço de caixa de correio são contatados; as chaves nunca saem da sua máquina |

## 🐞 Problemas

Se o painel mudar suas rotas de registro/check-in, sua política de e-mail ou o catálogo, a ferramenta para ali e avisa. **[Abra uma issue](../../issues)** com o comando e a saída exata.

## 📄 Licença

MIT © 2026 — veja [LICENSE](LICENSE).

<div align="center">

**[MIT](LICENSE)** © 2026 moxin-plus-bulk-apikey contributors

</div>