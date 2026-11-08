# Driblou Caiu FC

**Landing page de clube de Pro Clubs** · React · TanStack Start

[![Site no ar](https://img.shields.io/badge/site-online-DC2626?style=flat-square)](https://dribloucaiu-landing.vercel.app)
[![React](https://img.shields.io/badge/React-19-DC2626?style=flat-square&logo=react&logoColor=white)](https://react.dev)
[![License: MIT](https://img.shields.io/badge/license-MIT-DC2626?style=flat-square)](LICENSE)

Site oficial do **Driblou Caiu**, clube de Pro Clubs no **EA FC 26**: elenco, esquema tático interativo, jogos e redes sociais do time, com identidade visual de **futebol de várzea**: muro caiado com estêncil, placar de chapa, álbum de figurinhas, lambe-lambe e súmula datilografada.

🔗 **Site no ar:** [dribloucaiu-landing.vercel.app](https://dribloucaiu-landing.vercel.app)

![Captura de tela do site](docs/img/preview.png)

## Sobre o projeto

A identidade parte do escudo e do lugar de onde o futebol do time vem: a várzea. O site é o muro do campo: nome pintado em estêncil (Big Shoulders Stencil), placar de chapinhas penduradas no prego, regras da casa em placas pintadas, próximo jogo num lambe-lambe amarelo, resultados numa súmula em máquina de escrever (Courier Prime) e um rodapé com um muro pichável, onde o visitante arrasta e picha com spray. A paleta usa só as cores do jogo: cal, vermelho do escudo, preto piche, amarelo cartão e verde gramado.

O movimento é parte da identidade: rolagem suave com inércia ([Lenis](https://lenis.darkroom.engineering/)), letras do nome carimbadas uma a uma, parallax no topo, manifesto que acende palavra por palavra e escalação que entra do meio-campo. Tudo respeita a preferência de movimento reduzido do sistema.

## Seções

- **Início**: nome carimbado no muro, escudo e placar de chapa com o último jogo e a forma recente
- **Números**: jogos, vitórias, gols, saldo e aproveitamento, calculados a partir das partidas
- **Clube**: manifesto, selo giratório, regras da casa em placas e o lema pintado numa faixa vermelha
- **Esquema**: os 11 slots numerados no campo, com o nome de quem estiver escalado
- **Elenco**: lista de chamada por setor, com a foto seguindo o cursor e a ficha de atributos. Sem jogadores, mostra "elenco em reformulação"
- **Próximo jogo**: lambe-lambe com data, adversário e contagem regressiva
- **Jogos**: súmula com resultados (gols, assistências e craque do jogo), tabela da liga e artilharia
- **Redes**: Instagram e TikTok do clube
- **Rodapé**: muro pichável, links e próximo jogo

## Painel admin (atualizar o site sem mexer no código)

Em `/admin` (o "Vestiário", protegido por senha) dá pra registrar partidas com placar, gols e assistências por jogador, definir o próximo jogo, montar a **escalação** (escolher o esquema, arrastar os 11 slots no campo e definir camisa e jogador de cada um), adicionar, editar e remover jogadores do **elenco** (foto, atributos, capitão), editar a tabela da liga e o histórico. Artilharia, aproveitamento e contadores do site são calculados sozinhos a partir das partidas.

Os dados ficam num Redis (Upstash) acessado por REST. Configuração na Vercel:

1. **Storage → Marketplace → Upstash Redis** e conecte ao projeto (cria `KV_REST_API_URL` e `KV_REST_API_TOKEN`).
2. **Settings → Environment Variables**: crie `ADMIN_PASSWORD` com a senha do painel (e, opcionalmente, `ADMIN_SECRET`, um texto aleatório longo que assina a sessão).
3. Faça um novo deploy.

Sem Redis o site continua funcionando com os dados iniciais (`src/data/team.ts`), só não dá pra salvar. Em desenvolvimento (`bun run dev`) os dados vão para `.data/db.json` e a senha padrão é `driblou`.

## Elenco

O elenco começa vazio (em reformulação) e é montado pelo painel. As fotos enviadas lá ficam guardadas no banco junto com os dados.

## Stack

- **[TanStack Start](https://tanstack.com/start)**, React 19 + SSR
- **[TanStack Router](https://tanstack.com/router)**, roteamento
- **[Tailwind CSS 4](https://tailwindcss.com/)**, estilização utilitária
- **[Framer Motion](https://www.framer.com/motion/)**, animações, parallax e o editor de escalação arrastável
- **[Lenis](https://lenis.darkroom.engineering/)**, rolagem suave
- **[Radix UI](https://www.radix-ui.com/)**, componentes acessíveis
- **[Vite 8](https://vite.dev/)** + **[Nitro](https://nitro.build/)**, build e servidor
- **[Bun](https://bun.sh/)**, runtime e gerenciador de pacotes

## Como rodar

Requer [Bun](https://bun.sh) (ou Node.js + npm).

```bash
git clone https://github.com/joaobatis1a/dribloucaiu-landing.git
cd dribloucaiu-landing
bun install
bun run dev
```

Acesse `http://localhost:3000`.

### Outros comandos

```bash
bun run build     # build de produção
bun run preview   # pré-visualiza o build de produção localmente
bun run lint      # eslint
bun run format    # prettier
```

## Deploy

O projeto já está configurado pra rodar tanto na Vercel quanto no Cloudflare (via Nitro, que troca de preset automaticamente pela variável de ambiente `VERCEL`):

1. Conecte o repositório na plataforma escolhida
2. Build command: `bun run build`
3. Deploy automático a cada `git push` na branch `main`

## Estrutura

```
src/
├── components/
│   ├── Hero.tsx, Scoreboard.tsx     # muro com o nome e o placar de chapa
│   ├── About.tsx                    # manifesto, selo e placas das regras
│   ├── Formation.tsx, Pitch.tsx     # escalação (o Pitch também é o editor do painel)
│   ├── Squad.tsx                    # lista de chamada do elenco
│   ├── NextMatch.tsx, MatchCenter.tsx
│   ├── SiteFooter.tsx, SprayWall.tsx # rodapé com o muro pichável
│   ├── motion/                      # Lenis e revelações no scroll
│   └── admin/                       # abas do painel (Vestiário)
├── data/team.ts                     # identidade do clube e conteúdo inicial
├── lib/
│   ├── site-schema.ts               # formato dos dados (zod)
│   ├── site.functions.ts            # server functions (leitura, login, salvar)
│   ├── formations.ts                # posições padrão de cada esquema
│   └── site-derive.ts               # números, artilharia e ordenação
├── server/                          # Redis/arquivo, sessão do painel
└── routes/                          # /, /admin e /api/photo/$id
```

## Autor

**João Batista da Silva Neto**
Desenvolvedor Front-End

- GitHub: [@joaobatis1a](https://github.com/joaobatis1a)
- LinkedIn: [joao-batista-silva-neto](https://linkedin.com/in/joao-batista-silva-neto)
- E-mail: [profissionalba1is1a@gmail.com](mailto:profissionalba1is1a@gmail.com)

## Licença

Distribuído sob a licença MIT. Veja [`LICENSE`](LICENSE) para mais detalhes.
