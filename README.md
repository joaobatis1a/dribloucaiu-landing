# ⚽ Driblou Caiu FC — Landing Page

Site oficial do **Driblou Caiu**, clube de Pro Clubs no **EA FC 26**: elenco, esquema tático interativo, amistosos e redes sociais do time, com uma identidade visual inspirada nos cards do próprio jogo.

🔗 **Site no ar:** [https://dribloucaiu-landing.vercel.app/](https://dribloucaiu-landing.vercel.app/)
📂 **Repositório:** [github.com/joaobatis1a/dribloucaiu-landing](https://github.com/joaobatis1a/dribloucaiu-landing)

---

## ✨ Sobre o projeto

Landing page em single-page, construída com React 19 + TanStack Start (SSR), com animações em cada seção via Framer Motion. O visual segue a estética de cards estilo Ultimate Team — tons de vermelho e preto do escudo do clube, cards com efeito de rating/raridade e um campo tático arrastável.

## 🧩 Seções

- **Início** — hero com escudo do clube, estatísticas rápidas e CTA
- **Sobre** — manifesto do clube, regras e lema
- **Esquema** — campo tático interativo: escolha entre 8 formações, arraste os jogadores pra reorganizar o time e veja vagas em aberto quando não há jogador pra posição
- **Elenco** — cards dos jogadores estilo Ultimate Team, com stats, raridade e foto de cada um
- **Amistosos** — último resultado, histórico de jogos e convite pra marcar partida
- **Redes** — links pro Instagram, TikTok e Discord do clube

## 🛠️ Stack

- **[TanStack Start](https://tanstack.com/start)** — React 19 + SSR
- **[TanStack Router](https://tanstack.com/router)** — roteamento
- **[Tailwind CSS 4](https://tailwindcss.com/)** — estilização utilitária
- **[Framer Motion](https://www.framer.com/motion/)** — animações e drag-and-drop do esquema tático
- **[Radix UI](https://www.radix-ui.com/)** — componentes acessíveis
- **[Recharts](https://recharts.org/)** — gráfico de radar nos cards dos jogadores
- **[Vite 8](https://vite.dev/)** + **[Nitro](https://nitro.build/)** — build e servidor
- **[Bun](https://bun.sh/)** — runtime e gerenciador de pacotes

## 🚀 Rodando localmente

Requer [Bun](https://bun.sh) (ou Node.js + npm).

```bash
# Clone o repositório
git clone https://github.com/joaobatis1a/dribloucaiu-landing.git
cd dribloucaiu-landing

# Instale as dependências
bun install

# Inicie o servidor de desenvolvimento
bun run dev
```

O projeto abre em `http://localhost:3000`.

### Outros comandos

```bash
bun run build     # build de produção
bun run preview   # pré-visualiza o build de produção localmente
bun run lint      # eslint
bun run format    # prettier
```

## 📦 Deploy

O projeto já está configurado pra rodar tanto na **Vercel** quanto no **Cloudflare** (via Nitro, que troca de preset automaticamente pela variável de ambiente `VERCEL`):

1. Conecte o repositório na plataforma escolhida
2. Build command: `bun run build`
3. Deploy automático a cada `git push` na branch `main`

## 📁 Estrutura

```
src/
├── components/
│   ├── Hero.tsx
│   ├── TeamStats.tsx
│   ├── About.tsx
│   ├── Formation.tsx      → esquema tático interativo
│   ├── Squad.tsx           → grade do elenco
│   ├── PlayerCard.tsx      → card individual do jogador
│   ├── Friendlies.tsx      → amistosos
│   ├── SocialLinks.tsx
│   ├── Navbar.tsx
│   ├── SiteFooter.tsx
│   └── ScrollToTop.tsx
├── data/
│   └── team.ts              → elenco, resultados e dados do clube
├── lib/
│   ├── formations.ts        → posições de cada esquema tático
│   └── match.ts              → raridade dos cards e helpers de partida
├── assets/players/           → fotos dos jogadores
└── routes/                   → rotas do TanStack Router
```

## 👤 Autor

**João Batista da Silva Neto**
Estudante de ADS — Faculdade Frassinetti do Recife
Front-End Developer

- GitHub: [@joaobatis1a](https://github.com/joaobatis1a)

## 📧 Contato

Para mais informações, entre em contato por e-mail: **profissionalba1is1a@gmail.com**

---

Feito com 🔴⚫ pelo Driblou Caiu.
