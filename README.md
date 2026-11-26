# ClickPet - Fase 2

Projeto da disciplina **Fundamentos de Sistemas Web** (PUCRS - Análise e Desenvolvimento de Sistemas).
Autor: **Adryan Kevin Moura de Assis**

Site de um petshop fictício. A **Fase 1** fez a estrutura em HTML puro; a **Fase 2** (este repositório) continua o mesmo projeto, agora com **Bootstrap, CSS próprio e JavaScript**, formulário de cadastro, agendamento e acessibilidade.

- Site publicado: https://adryanmoura23-boop.github.io/ClickPet/
- Repositório: https://github.com/adryanmoura23-boop/ClickPet

## Arquivo de ajuda - funcionalidades

| Página | Arquivo | O que tem |
|---|---|---|
| Início | `index.html` | Carrossel (Bootstrap) com 3 slides e botão de pausa, categorias e passo a passo do agendamento. |
| Produtos | `produtos.html` | 3 categorias com 2 produtos cada (foto, descrição e valor) e filtro por categoria (JavaScript). |
| Serviços | `servicos.html` | Banho e tosa com descrição, valor e informação de tele-busca / entrega no local. |
| Cadastro | `cadastro.html` | Formulário do cliente e do pet com validação (CPF, idade mínima, máscaras, campos obrigatórios). |
| Agendamento | `agendamento.html` | Escolha do serviço, método (tele-busca ou entrega no local), calendário e horários, lista de agendamentos. |
| Contato | `contato.html` | Endereço, telefone, e-mail e horário de funcionamento. |

### Funções em JavaScript (js/)
- **Funções temporais:** saudação "Bom dia / Boa tarde / Boa noite" e aviso "Aberto agora / Fechado agora" conforme o horário de funcionamento; ano do rodapé automático.
- **Carrossel:** troca automática de slides, com botão para pausar e respeito à preferência de "menos movimento" do sistema.
- **Filtro de produtos** por categoria.
- **Cadastro:** máscaras de CPF, telefone e CEP; validação do CPF (dígitos verificadores); só maiores de 18 anos; contador de caracteres; mensagens de erro do Bootstrap.
- **Agendamento:** o calendário bloqueia datas passadas, domingos e datas além de 60 dias; os horários mudam conforme o dia (segunda a sexta 9h-19h, sábado 9h-17h); horários já reservados ficam indisponíveis; endereço só é pedido na tele-busca; o agendamento pode ser cancelado.
- Os dados de cadastro e agendamento ficam salvos **apenas no navegador** (`localStorage`), pois o projeto não tem servidor.

### Acessibilidade (para deficientes visuais)
- Atributo `alt` descritivo em todas as imagens (audiodescrição).
- Botões **A- / A+** (tamanho da letra) e **Alto contraste**, com a escolha lembrada entre as páginas.
- Link "Pular para o conteúdo principal", `lang="pt-br"`, uso de `label` em todos os campos, `fieldset/legend` nos grupos, `aria-label`, `aria-live` nas mensagens e `scope`/`caption` nas tabelas.
- Foco do teclado bem visível, cores com bom contraste e menu totalmente navegável por teclado.

### Recursos visuais
- **Fotos** (pasta `imagens/foto-*.jpg`): imagem de destaque do início, categorias e produtos (ração para cães, shampoo, bola e arranhador), otimizadas para carregar rápido e com `alt` descritivo.
- **Ilustrações vetoriais (SVG)** criadas para o projeto: logotipo, 3 banners do carrossel e as imagens da ração para gatos e do tapete higiênico. Não perdem qualidade em nenhum tamanho de tela.
- **Página inicial** com destaque (hero), faixa de diferenciais com ícones, carrossel, categorias, passo a passo do agendamento e chamada para ação.
- **Ícones** do Bootstrap Icons e fonte **Nunito** (Google Fonts), com menu fixo no topo e destaque da página atual.
- **Cards** com cantos arredondados, sombra, etiqueta de categoria, preço em destaque e efeito ao passar o mouse.
- **Animações suaves** ao rolar a página e botão "voltar ao topo". Quem prefere menos movimento no sistema não vê as animações.
- O modo de **alto contraste** continua funcionando em todos os novos elementos.

## Estrutura de pastas
```
index.html  produtos.html  servicos.html
cadastro.html  agendamento.html  contato.html  README.md
css/estilo.css
js/comum.js  efeitos.js  inicio.js  produtos.js  cadastro.js  agendamento.js
imagens/  (fotos em JPG e ilustrações em SVG)
```

## Ajustes realizados (da Fase 1 para a Fase 2)
1. **Organização do código:** estilos separados em `css/` e scripts em `js/`, um arquivo por assunto, todos comentados.
2. **Bootstrap:** menu responsivo (navbar), grade de cards, tabela responsiva, formulários e carrossel; o CSS próprio só complementa.
3. **Serviços:** a Fase 1 listava 6 serviços; ajustados para os 2 pedidos na Fase 2 (**banho e tosa**), com os dois métodos de atendimento (tele-busca ou entrega no local).
4. **Formulário da Fase 1:** o formulário de contato que não funcionava foi removido; o contato agora tem informações e os formulários reais estão em Cadastro e Agendamento.
5. **Novas páginas:** `cadastro.html` e `agendamento.html`, incluídas no menu e no rodapé de todas as páginas.
6. **Cabeçalho e rodapé padronizados** em todas as páginas, com nome do autor e links.
7. **Imagens:** tamanhos fixos (`width`/`height`) trocados por classes responsivas; textos `alt` reescritos de forma descritiva.
8. **HTML validado:** todas as tags fechadas, `id` únicos, todos os campos com `label`, títulos em ordem (h1 > h2 > h3), `caption` e `scope` nas tabelas.
9. **Datas:** corrigido o problema de fuso horário do JavaScript (o dia escolhido no calendário podia virar o dia anterior) e adicionada a proteção contra horário vazio ou duplicado.
10. **Identidade visual:** imagens simples da primeira versão trocadas por ilustrações em SVG, novo layout com ícones, hero, cards e animações (ver "Recursos visuais").
11. **Nome do projeto e links:** padronizados como **ClickPet** (o link do GitHub Pages diferencia maiúsculas de minúsculas).

## Observações
- As imagens são ilustrativas e podem ser trocadas; basta manter os mesmos nomes de arquivo.
- Nome, endereço, telefone e e-mail do petshop são fictícios.
- O site usa Bootstrap 5, Bootstrap Icons e a fonte Nunito por CDN, por isso precisa de internet para ficar com o visual completo.
