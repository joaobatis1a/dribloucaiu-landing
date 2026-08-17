# Landing page — Driblou Caiu (Pro Clubs EA FC 26)

Página única, escura e dinâmica, com a estética de HUD do EA FC: fundo quase preto, vermelho do clube como cor principal, branco para texto e um verde neon como acento de destaque (números, barras de stats, hover).

## Estrutura da página (uma rota, `/`)

1. **Hero** — nome "DRIBLOU CAIU" em tipografia condensada gigante, escudo/badge ao lado, tag "Pro Clubs · EA FC 26 · Amistosos & Liga", fundo com gradiente radial vermelho, textura de grid/scanline e brilho animado. Um CTA único que rola até o elenco.
2. **Faixa de estatísticas do time** — números grandes (jogos, vitórias, gols, saldo, aproveitamento) com animação de contagem ao entrar na tela.
3. **Elenco** — grid de cards estilo FUT: overall grande, posição, nome, escudo, e barras de atributos (RIT, FIN, PAS, DRI, DEF, FÍS). Hover com inclinação 3D leve e brilho na borda.
4. **Últimos resultados** — lista de partidas com placar, adversário, tipo (amistoso/liga) e badge V/E/D colorido.
5. **Tabela / temporada** — tabela da liga com a linha do Driblou Caiu destacada.
6. **Rodapé** — nome do clube, plataforma e espaço para link do Discord.

## Dinamismo

- Animações de entrada por seção (fade + slide) ao rolar.
- Contadores animados nas estatísticas.
- Hover 3D nos cards de jogador e brilho nos elementos de acento.
- Efeitos sutis de HUD: linhas diagonais, ruído, gradientes em movimento no hero.

## Dados

Tudo fixo no código, num único arquivo de dados (`src/data/team.ts`) com elenco, resultados e tabela — fácil de atualizar depois. Vou preencher com jogadores e resultados de exemplo; você me manda os reais e eu troco.

## Detalhes técnicos

- Tokens de cor em `src/styles.css` (oklch): `--background` quase preto, `--primary` vermelho do clube, `--accent` verde neon, mais gradientes e sombras de brilho como tokens.
- Tipografia condensada esportiva carregada via `<link>` no `__root.tsx` (ex.: Anton/Barlow Condensed + Barlow).
- Componentes em `src/components/` (Hero, TeamStats, SquadGrid, PlayerCard, Results, LeagueTable, Footer), montados em `src/routes/index.tsx` substituindo o placeholder.
- Animações com CSS/Tailwind e um hook de reveal por IntersectionObserver.
- `head()` na rota com título e descrição próprios do clube.
- Escudo: se você mandar a imagem, eu uso; senão gero um escudo vermelho/branco provisório.

## Fora do escopo

Sem backend, login ou painel de edição por enquanto.
