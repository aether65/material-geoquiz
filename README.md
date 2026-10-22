# GeoQuiz

![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)
![Material Design 3](https://img.shields.io/badge/Material%20Design%203-Expressive-6750A4)
![Acessibilidade](https://img.shields.io/badge/meta-WCAG%202.2%20AA-purple)
![Sem licença](https://img.shields.io/badge/licen%C3%A7a-todos%20os%20direitos%20reservados-lightgrey)

**GeoQuiz** é um jogo de quiz de matemática para alunos do **9º ano do Ensino Fundamental II**, feito para a sala de aula e para estudar em casa. Tem de 1 a 4 jogadores no mesmo dispositivo, explicações didáticas depois de cada questão, relatórios com gráficos, análise de erros e recursos de acessibilidade.

Construído com **React**, roda inteiramente no navegador, sem servidor próprio nem banco de dados.

> **Status:** em desenvolvimento. Algumas funções descritas abaixo podem estar em fases diferentes de implementação.

<!-- Adicione capturas de tela em docs/ e descomente as linhas abaixo
![Tela inicial](docs/tela-inicial.png)
![Tela da questão](docs/tela-questao.png)
![Relatório](docs/relatorio.png)
-->

## Sumário

- [Conteúdo pedagógico](#conteúdo-pedagógico)
- [Como o jogo funciona](#como-o-jogo-funciona)
- [Principais recursos](#principais-recursos)
- [Tecnologias](#tecnologias)
- [Como executar](#como-executar)
- [Publicar no GitHub Pages](#publicar-no-github-pages)
- [Estrutura do projeto](#estrutura-do-projeto)
- [Configurações](#configurações)
- [Modo IA](#modo-ia)
- [Relatórios e análise de erros](#relatórios-e-análise-de-erros)
- [Acessibilidade](#acessibilidade)
- [Idiomas](#idiomas)
- [Design](#design)
- [Perguntas frequentes](#perguntas-frequentes)
- [Como contribuir](#como-contribuir)
- [Licença](#licença)
- [English summary](#english-summary)

## Conteúdo pedagógico

O jogo cobre dois assuntos do 9º ano:

| Assunto | O que é praticado |
| --- | --- |
| **Teorema de Tales** | Retas paralelas cortadas por transversais, proporção entre segmentos, problemas com sombras, postes e ruas |
| **Relações métricas no triângulo retângulo** | Teorema de Pitágoras, h² = m·n, b² = a·m, c² = a·n e a·h = b·c, com escadas, rampas e diagonais |

Esses temas se relacionam às habilidades **EF09MA13** e **EF09MA14** da BNCC.

Cada questão tem **5 alternativas** (A a E), uma figura em SVG sempre que o assunto permite e uma **explicação em 6 partes**, exibida ao fim de cada questão, quando o jogador acerta ou erra:

1. Ideia principal
2. Fórmula, com o significado de cada letra na figura
3. Resolução passo a passo
4. Verificação do resultado
5. Por que cada alternativa errada está errada
6. Dica para não errar de novo

As questões ficam em ordem crescente de dificuldade (fácil, média e difícil), com metade de cada assunto. O banco tem questões escritas à mão e **geradores paramétricos**, que sorteiam valores e criam variações com figura e explicação, validadas por código.

## Como o jogo funciona

- **Jogadores:** de 1 a 4, cada um com nome, cor, forma e teclas próprias.
- **Questões:** 7 por jogador (1 jogador = 7 questões, 4 jogadores = 28).
- **Tempo:** 3 minutos por questão (padrão), configurável de 15 segundos a 30 minutos, ou **sem tempo**.
- **Multijogador (2 a 4):** quem acerta primeiro ganha 1 ponto. Quem erra fica bloqueado naquela questão e os outros continuam. Se todos errarem ou o tempo acabar, ninguém pontua.
- **Modo solo (1 jogador):** uma tentativa por questão, com 1 ponto por acerto.
- **Modo sem tempo:** a questão termina quando alguém acerta ou todos erram, e existe o botão "Encerrar questão" para o jogo não travar.

### Teclas dos jogadores

| Jogador | Alternativas A, B, C, D, E |
| --- | --- |
| Jogador 1 | `1` `2` `3` `4` `5` |
| Jogador 2 | `Q` `W` `E` `R` `T` |
| Jogador 3 | `A` `S` `D` `F` `G` |
| Jogador 4 | `Z` `X` `C` `V` `B` |

Em celulares e tablets, cada jogador também tem **botões na tela**.

## Principais recursos

- Quiz para 1 a 4 jogadores no mesmo dispositivo
- Questões de Tales e relações métricas com figuras SVG proporcionais e rótulos legíveis
- Explicações didáticas completas, inclusive para quem acertou
- Cronômetro configurável, com opção de jogar sem tempo
- Relatório em **HTML, PDF (via impressão), PNG (resumo) e texto (.txt)**, com gráficos e personalização
- **Análise de erros** opcional, com exercícios de reforço e um segundo relatório
- **Modo IA** opcional, que gera questões novas a cada partida
- 8 idiomas e muitos recursos de acessibilidade
- Design em Material Design 3 Expressive, com tema claro e escuro automático e cores dinâmicas

## Tecnologias

- [React](https://react.dev/) para a interface
- JavaScript, HTML e CSS
- SVG para figuras e ícones, e `<canvas>` para o PNG do relatório
- API do Gemini (opcional, somente no Modo IA)

Cada dependência do projeto tem a sua própria licença; veja o `package.json`.

## Como executar

Você precisa do [Node.js](https://nodejs.org/) (versão LTS recomendada) e de um navegador moderno.

1. Clone o repositório e entre na pasta:
   ```bash
   git clone https://github.com/SEU-USUARIO/geoquiz.git
   cd geoquiz
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
4. Abra no navegador o endereço que aparecer no terminal.

> Confira a seção `scripts` do `package.json`: dependendo da ferramenta usada no projeto, o comando de desenvolvimento pode ser `npm start` em vez de `npm run dev`.

Para gerar a versão final (a saída vai para a pasta `dist/` ou `build/`, conforme a ferramenta):

```bash
npm run build
```

Para testar a versão final localmente (se o projeto tiver esse script):

```bash
npm run preview
```

## Publicar no GitHub Pages

Como o resultado do build é um site estático, dá para publicá-lo de graça no GitHub Pages:

1. Gere o build (`npm run build`).
2. Configure o **caminho base** para o nome do repositório. Em projetos com Vite, defina `base: '/geoquiz/'` no `vite.config.js`. Em projetos criados com Create React App, defina `"homepage"` no `package.json`.
3. Publique o conteúdo da pasta de saída (`dist/` ou `build/`), por exemplo com GitHub Actions ou com o pacote `gh-pages`.
4. No repositório, abra **Settings**, depois **Pages**, e escolha a fonte da publicação (a branch `gh-pages` ou o GitHub Actions).

O jogo ficará em `https://SEU-USUARIO.github.io/geoquiz/`.

## Estrutura do projeto

> Exemplo da organização típica de um projeto React. Ajuste a árvore abaixo para refletir o repositório real.

```
geoquiz/
├── public/          # arquivos estáticos (e fontes opcionais)
├── src/             # componentes, lógica, questões, idiomas e estilos
├── docs/            # (opcional) capturas de tela
├── index.html
├── package.json
└── README.md
```

## Configurações

O botão de engrenagem, disponível em todas as telas, abre o menu de configurações:

- **Idioma:** 8 idiomas, com troca imediata.
- **Jogo:** tempo por questão (30 s, 1 min, 2 min, 3 min, 5 min, 10 min, personalizado de 15 s a 30 min ou sem tempo). A opção só muda na tela inicial ou entre partidas.
- **Aparência:** tema automático, claro ou escuro, paletas dinâmicas, cor-semente personalizada, nível de contraste, esquema de movimento e formas decorativas.
- **Acessibilidade:** fonte, espaçamento, perfis prontos, leitura em voz alta e muito mais.
- **Modo IA:** liga ou desliga, chave de API e modelo.
- **Relatório:** tema, cores, fonte, idioma e seções padrão.

As escolhas ficam salvas no navegador (`localStorage`).

## Modo IA

O Modo IA é **opcional e vem desligado**. Quando ligado, gera questões novas a cada partida usando a **API do Gemini com plano gratuito**.

1. Crie uma chave gratuita no [Google AI Studio](https://aistudio.google.com/apikey).
2. Abra **Configurações > Modo IA**, ative o modo e cole a chave.
3. Use "Testar conexão" e, na tela inicial, escolha o modo **IA**.

Como funciona:

- A IA devolve **parâmetros estruturados** (tipo da questão, valores, enunciado e explicação). O próprio jogo **recalcula a resposta correta**, desenha a figura e valida tudo. Questões inconsistentes são descartadas e substituídas.
- Se a internet cair, a chave for inválida ou o limite gratuito acabar, o jogo volta automaticamente ao **modo Clássico** e avisa você.
- A chave fica **somente no `localStorage` do seu navegador**. Ela não está no código e não vai para o repositório.
- **Nenhum nome de jogador ou dado pessoal é enviado** à API. Vão apenas assunto, dificuldade, idioma e uma semente aleatória.
- Os limites da camada gratuita mudam com frequência. Confira os do seu projeto no Google AI Studio.
- Em turmas, prefira que o professor use a própria chave, e não os alunos.

## Relatórios e análise de erros

No fim da partida, "Salvar relatório" oferece quatro formatos:

| Formato | Descrição |
| --- | --- |
| **HTML** | Arquivo autônomo, com estilos e ícones embutidos |
| **PDF** | Gerado pela impressão do navegador ("Salvar como PDF") |
| **PNG** | Imagem com o resumo do relatório, desenhada em canvas |
| **TXT** | Resumo em texto, ideal para leitores de tela |

O relatório inclui placar, acertos e erros por jogador, tempo médio, desempenho por assunto e dificuldade, o detalhamento de cada questão com figura e explicação completa e pontos a revisar. Os gráficos (rosca, barras, evolução, radar e mapa de calor) têm alternativa em tabela e texto. Dá para **personalizar** tema, cores, fonte, idioma e seções antes de salvar, com pré-visualização.

A **análise de erros** é opcional e vem depois do relatório. Para cada questão errada, o jogador faz um autodiagnóstico, vê a causa provável do erro, recebe uma correção guiada, resolve um exercício de reforço e recebe um plano de estudo. Em seguida, o jogo gera um segundo relatório, focado nos erros.

## Acessibilidade

A meta é atender à **WCAG 2.2 nível AA**. O painel de Acessibilidade, acessível em todas as telas, inclui:

- **Leitura facilitada** (um clique) e fontes para dislexia (como OpenDyslexic, Lexend e Atkinson Hyperlegible, quando disponíveis no projeto)
- Tamanho do texto de 80% a 200%, espaçamento ajustável, cores de fundo de leitura e régua de leitura
- Contraste médio e alto, paletas para daltonismo e identificação dos jogadores por forma, e não só por cor
- **Leitura em voz alta** nos 8 idiomas (depende das vozes do navegador), descrição textual das figuras e fórmulas faladas
- Suporte a leitores de tela, navegação completa pelo teclado e alvos de toque grandes
- Glossário integrado, explicação passo a passo e linguagem simplificada
- Perfis prontos: dislexia, baixa visão, daltonismo, foco e atenção, motricidade e leitor de tela
- Respeito às preferências do sistema (movimento, contraste e tema)

As fontes de acessibilidade são opcionais. Consulte a licença de cada uma antes de incluí-la ou redistribuí-la junto ao projeto.

## Idiomas

Português (padrão), English, Español, Italiano, Français, Русский, 中文 (simplificado) e 日本語. A tradução cobre a interface, as questões, as explicações, os relatórios e os recursos de acessibilidade.

## Design

A interface segue o **Material Design 3 Expressive**: cores dinâmicas geradas a partir de uma cor-semente, formas que se transformam, tipografia enfatizada, movimento com física de molas e componentes como botões conectados, indicador de progresso ondulado e folhas de configurações. O tema claro e o escuro seguem o sistema. Os ícones são SVG, sem emojis. O título tem gradiente animado, e todas as animações podem ser desligadas.

## Perguntas frequentes

**O jogo precisa de internet?**
Para jogar no modo Clássico, não depende de servidor próprio nem de banco de dados. O Modo IA precisa de internet.

**Funciona no celular?**
Sim. O layout é responsivo, e cada jogador tem botões na tela.

**Posso editar as questões?**
Sim. Elas ficam nos arquivos de dados do código-fonte (enunciado, alternativas, resposta correta, figura e explicação). Veja a pasta `src/`.

**Os dados dos alunos são enviados para algum servidor?**
Não. Tudo roda no navegador. As configurações ficam no `localStorage`, e os relatórios são gerados e baixados localmente. No Modo IA, só são enviados parâmetros de matemática, nunca nomes.

**A figura não apareceu direito.**
Abra uma issue com a captura de tela, o navegador e o assunto da questão.

## Como contribuir

Sugestões e correções são bem-vindas, principalmente por **issues**. Como o projeto não tem licença (veja abaixo), entre em contato com o autor antes de abrir um Pull Request ou de reutilizar o código.

Ao relatar um problema, informe o navegador, o sistema operacional e a mensagem do Console (tecla `F12`).

## Licença

Este projeto **não possui licença**. Isso significa que **todos os direitos são reservados ao autor**.

Pelos termos de uso do GitHub, outras pessoas podem visualizar o código e criar forks dentro do GitHub. Copiar, modificar, distribuir ou usar o código em outros projetos, inclusive comerciais, **exige autorização do autor**.

Dependências de terceiros (como o React) mantêm as suas próprias licenças.

## English summary

**GeoQuiz** is a math quiz built with React for 9th-grade students (Thales' theorem and metric relations in right triangles). It supports 1 to 4 players on one device, a configurable timer (or no timer), step-by-step explanations after every question, HTML/PDF/PNG/TXT reports with charts, an optional error-analysis mode, an optional AI mode that generates fresh questions with the free Gemini API, 8 interface languages, strong accessibility features (dyslexia-friendly fonts, screen-reader support, text-to-speech) and a Material Design 3 Expressive interface.

To run it locally: install Node.js, then run `npm install` and `npm run dev`.

**License:** none. All rights reserved by the author.
