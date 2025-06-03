# Changelog Murphy Craft NUI

Todas as alterações notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Versionamento Semântico](https://semver.org/lang/pt-BR/).

## [0.1.0] - 2024-03-06

### Adicionado
- Estrutura inicial do projeto
  - Diretórios principais (client, server, nui)
  - Arquivos de configuração base
  - Estrutura de assets (textures, fonts, sounds, illustrations, icons)

- Interface do Livro
  - Implementação do Turn.js para efeito de livro
  - Sistema de navegação por páginas
  - Barra de pesquisa
  - Estrutura HTML base com capa, índice e páginas

- Estilos CSS
  - `book.css` - Estilos base do livro
    - Layout responsivo
    - Temas e cores
    - Efeitos de página
  - `crafting.css` - Estilos do sistema de crafting
    - Cards de receitas
    - Modal de crafting
    - Lista de ingredientes
  - `animations.css` - Animações e efeitos visuais
    - Animações de página
    - Efeitos de hover
    - Animações de crafting

- Sistema de Crafting
  - Classe `CraftingBook` para gerenciamento do livro
  - Classe `CraftingSystem` para lógica de crafting
  - Sistema de verificação de ingredientes
  - Modal de crafting com seleção de quantidade
  - Animações de progresso
  - Sistema de notificações

### Modificado
- Atualização do sistema de arquivos para estrutura NUI
- Implementação de jQuery e Turn.js como dependências

### Corrigido
- Ajustes na estrutura de diretórios
- Correções no sistema de carregamento de assets

## [Não Lançado]

### Pendente
- Integração com backend Lua
- Sistema de renderização de receitas com dados reais
- Sistema de categorias com abas laterais
- Funcionalidades de crafting com backend
- Sistema de texturas e efeitos visuais
- Ilustrações de itens
- Sistema de busca avançado
- Sistema de favoritos
- Sistema de notas pessoais
- Tutorial interativo
- Testes de performance
- Ajustes de compatibilidade
- Deploy final 