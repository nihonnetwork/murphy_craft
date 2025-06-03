# Plano de Migração Murphy Craft - Interface de Livro com Turn.js

## 📋 Sumário Executivo

Este plano detalha a migração do sistema de menus do Murphy Craft para uma interface NUI em formato de livro interativo, usando Turn.js para criar uma experiência imersiva de folhear páginas, mantendo a temática Red Dead Redemption.

---

## 🎯 Conceito Visual

### Design Inspiração
- **Livro de receitas artesanais** do Velho Oeste
- **Páginas envelhecidas** com textura de papel antigo
- **Ilustrações hand-drawn** para itens
- **Caligrafia** estilo época
- **Orelhas/abas** nas bordas para categorias
- **Índice** na primeira página

### Mockup Conceitual
```
┌─────────────────────────────────────────────────────┐
│                    Murphy's Crafting Book            │
├─────────────────────────────────────────────────────┤
│  ┌──────────────────┬──────────────────┐           │
│  │                  │                  │ [Tents]    │
│  │     INDEX        │   TENT RECIPES   │ [Tables]   │
│  │                  │                  │ [Decor]    │
│  │ Tents......p.2   │  [Trader Tent]  │ [Tools]    │
│  │ Tables.....p.8   │                  │            │
│  │ Decor.....p.14   │  Materials:      │            │
│  │ Tools.....p.20   │  • 50x Wood      │            │
│  │                  │  • 35x Iron      │            │
│  │                  │  • 25x Copper    │            │
│  │                  │                  │            │
│  │ [Illustration]   │  Time: 5 min     │            │
│  │                  │                  │            │
│  │                  │  [Craft Button]  │            │
│  └──────────────────┴──────────────────┘           │
│         Page 1              Page 2                   │
└─────────────────────────────────────────────────────┘
```

---

## 🏗️ Arquitetura Técnica

### Stack Tecnológico
```
Frontend:
- HTML5/CSS3/JavaScript (Vanilla ou React)
- Turn.js para efeito de livro
- GSAP para animações complementares
- Canvas para efeitos visuais (manchas, desgaste)

Assets:
- Texturas de papel envelhecido
- Fontes estilo Western/Handwritten
- Ilustrações de itens (estilo sketch)
- Sons de folhear páginas

Backend:
- Estrutura Lua existente
- Handlers NUI adaptados
```

### Estrutura de Arquivos
```
murphy_craft/
├── nui/
│   ├── book/
│   │   ├── index.html
│   │   ├── css/
│   │   │   ├── book.css
│   │   │   ├── pages.css
│   │   │   └── animations.css
│   │   ├── js/
│   │   │   ├── turn.min.js
│   │   │   ├── book.js
│   │   │   ├── crafting.js
│   │   │   └── categories.js
│   │   ├── assets/
│   │   │   ├── textures/
│   │   │   │   ├── page-bg.jpg
│   │   │   │   ├── cover.jpg
│   │   │   │   └── leather.jpg
│   │   │   ├── fonts/
│   │   │   │   ├── western.ttf
│   │   │   │   └── handwritten.woff
│   │   │   ├── sounds/
│   │   │   │   ├── page-turn.mp3
│   │   │   │   └── book-open.mp3
│   │   │   └── illustrations/
│   │   │       └── [item sketches]
│   │   └── templates/
│   │       ├── index-page.html
│   │       ├── recipe-page.html
│   │       └── category-divider.html
```

---

## 📖 Estrutura do Livro

### Organização das Páginas

```
Capa (Cover)
├── Página 0-1: Índice Geral
├── Páginas por Categoria:
│   ├── Página Divisória (Nome da Categoria)
│   ├── Receitas da Categoria (2 por página)
│   └── ...
└── Contracapa
```

### Layout de Página de Receita
```html
<!-- Template de página dupla -->
<div class="page">
    <!-- Página Esquerda -->
    <div class="recipe-page left">
        <div class="recipe-header">
            <h2 class="recipe-title">Trader Tent Small</h2>
            <div class="recipe-illustration">
                <img src="assets/illustrations/tent_trader01.png" />
            </div>
        </div>
        
        <div class="recipe-content">
            <p class="recipe-description">
                A modest shelter for the traveling merchant...
            </p>
            
            <div class="ingredients-list">
                <h3>Required Materials:</h3>
                <ul>
                    <li><span class="qty">50x</span> Wood</li>
                    <li><span class="qty">35x</span> Iron</li>
                    <li><span class="qty">25x</span> Copper</li>
                </ul>
            </div>
            
            <div class="recipe-footer">
                <div class="craft-time">
                    <img src="assets/icons/clock.png" />
                    <span>5 minutes</span>
                </div>
                <button class="craft-btn" data-recipe="tent_trader01">
                    Craft Item
                </button>
            </div>
        </div>
    </div>
    
    <!-- Página Direita -->
    <div class="recipe-page right">
        <!-- Próxima receita -->
    </div>
</div>
```

---

## 🎨 Sistema de Categorias (Orelhas/Abas)

### Implementação das Abas
```javascript
// Estrutura das abas laterais
const categories = [
    { id: 'tents', name: 'Tents', startPage: 2, color: '#8B4513' },
    { id: 'tables', name: 'Tables', startPage: 12, color: '#654321' },
    { id: 'decor', name: 'Decor', startPage: 22, color: '#A0522D' },
    { id: 'essentials', name: 'Essentials', startPage: 32, color: '#D2691E' }
];

// Renderização das abas
function renderTabs() {
    const tabContainer = document.querySelector('.book-tabs');
    
    categories.forEach((cat, index) => {
        const tab = document.createElement('div');
        tab.className = 'category-tab';
        tab.style.top = `${100 + (index * 60)}px`;
        tab.style.backgroundColor = cat.color;
        tab.innerHTML = `<span>${cat.name}</span>`;
        
        tab.addEventListener('click', () => {
            $('#craftbook').turn('page', cat.startPage);
        });
        
        tabContainer.appendChild(tab);
    });
}
```

### CSS das Abas
```css
.category-tab {
    position: absolute;
    right: -30px;
    width: 120px;
    height: 40px;
    transform: rotate(-90deg);
    transform-origin: right center;
    cursor: pointer;
    border-radius: 0 0 8px 8px;
    box-shadow: 2px 2px 5px rgba(0,0,0,0.3);
    transition: all 0.3s ease;
}

.category-tab:hover {
    right: -25px;
    box-shadow: 3px 3px 8px rgba(0,0,0,0.5);
}

.category-tab span {
    display: block;
    text-align: center;
    line-height: 40px;
    font-family: 'WesternFont', serif;
    color: #FFF;
    text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
}
```

---

## 💻 Implementação Turn.js

### Inicialização do Livro
```javascript
// book.js
class CraftingBook {
    constructor() {
        this.currentCategory = null;
        this.recipes = {};
        this.playerInventory = {};
        
        this.initializeBook();
        this.loadRecipes();
        this.setupEventListeners();
    }
    
    initializeBook() {
        $('#craftbook').turn({
            width: 922,
            height: 600,
            autoCenter: true,
            display: 'double',
            acceleration: true,
            pages: 50, // Ajustar conforme necessário
            elevation: 50,
            gradients: true,
            turnCorners: 'bl,br',
            
            when: {
                turning: function(event, page, view) {
                    // Som de virar página
                    playSound('page-turn');
                    
                    // Atualizar categoria atual
                    updateCurrentCategory(page);
                },
                
                turned: function(event, page, view) {
                    // Atualizar índice visual
                    updatePageIndicator(page);
                }
            }
        });
    }
    
    loadRecipes() {
        // Comunicação com o backend Lua
        fetch('https://murphy_craft/getWorkbenchData', {
            method: 'POST',
            body: JSON.stringify({ 
                type: this.workbenchType,
                id: this.workbenchId 
            })
        })
        .then(response => response.json())
        .then(data => {
            this.recipes = this.organizeRecipes(data);
            this.renderPages();
        });
    }
    
    renderPages() {
        // Renderizar índice
        this.renderIndexPage();
        
        // Renderizar páginas por categoria
        Object.keys(this.recipes).forEach(category => {
            this.renderCategoryDivider(category);
            this.renderRecipePages(category);
        });
    }
}
```

### Sistema de Crafting
```javascript
// crafting.js
class CraftingSystem {
    constructor(book) {
        this.book = book;
        this.currentRecipe = null;
        this.craftingInProgress = false;
    }
    
    selectRecipe(recipeId) {
        const recipe = this.findRecipeById(recipeId);
        if (!recipe) return;
        
        this.currentRecipe = recipe;
        this.showCraftingModal(recipe);
    }
    
    showCraftingModal(recipe) {
        // Criar modal estilo pergaminho
        const modal = `
            <div class="crafting-modal">
                <div class="parchment-bg">
                    <h2>${recipe.label}</h2>
                    <div class="ingredients-check">
                        ${this.renderIngredientsCheck(recipe)}
                    </div>
                    <div class="quantity-selector">
                        <label>Quantity:</label>
                        <input type="range" min="1" max="${this.getMaxCraftable(recipe)}" value="1">
                        <span class="qty-display">1</span>
                    </div>
                    <div class="modal-actions">
                        <button class="confirm-craft">Craft</button>
                        <button class="cancel-craft">Cancel</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modal);
    }
    
    startCrafting(recipe, quantity) {
        if (this.craftingInProgress) return;
        
        this.craftingInProgress = true;
        
        // Mostrar animação de crafting
        this.showCraftingAnimation(recipe.worktime * quantity);
        
        // Enviar para o backend
        fetch('https://murphy_craft/startCrafting', {
            method: 'POST',
            body: JSON.stringify({
                recipe: recipe,
                quantity: quantity
            })
        });
    }
}
```

---

## 🎨 Estilização e Temas

### CSS Base do Livro
```css
/* book.css */
#craftbook {
    margin: 0 auto;
    background: url('../assets/textures/wood-table.jpg');
    padding: 20px;
}

.page {
    background: url('../assets/textures/page-bg.jpg');
    background-size: 100% 100%;
    box-shadow: 
        inset 0 0 30px rgba(0,0,0,0.1),
        inset 0 0 10px rgba(139, 69, 19, 0.2);
    position: relative;
    overflow: hidden;
}

/* Efeito de página envelhecida */
.page::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
        radial-gradient(circle at 20% 80%, transparent 50%, rgba(139, 69, 19, 0.1) 50%),
        radial-gradient(circle at 80% 20%, transparent 50%, rgba(139, 69, 19, 0.1) 50%),
        radial-gradient(circle at 40% 40%, transparent 50%, rgba(139, 69, 19, 0.05) 50%);
    pointer-events: none;
}

/* Fonte manuscrita */
.recipe-title {
    font-family: 'HandwrittenFont', cursive;
    color: #3E2723;
    font-size: 28px;
    text-align: center;
    margin-bottom: 20px;
    text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
}

/* Ilustrações */
.recipe-illustration {
    width: 200px;
    height: 200px;
    margin: 0 auto;
    position: relative;
    filter: sepia(20%) contrast(1.2);
}

.recipe-illustration img {
    width: 100%;
    height: 100%;
    object-fit: contain;
}

/* Botão de craft estilo Western */
.craft-btn {
    background: linear-gradient(to bottom, #8B4513, #654321);
    border: 2px solid #3E2723;
    color: #FFF;
    padding: 10px 20px;
    font-family: 'WesternFont', serif;
    font-size: 18px;
    cursor: pointer;
    border-radius: 4px;
    box-shadow: 
        0 4px 6px rgba(0,0,0,0.3),
        inset 0 1px 0 rgba(255,255,255,0.2);
    transition: all 0.3s ease;
}

.craft-btn:hover {
    background: linear-gradient(to bottom, #A0522D, #8B4513);
    transform: translateY(-2px);
    box-shadow: 
        0 6px 8px rgba(0,0,0,0.4),
        inset 0 1px 0 rgba(255,255,255,0.3);
}

.craft-btn:active {
    transform: translateY(0);
    box-shadow: 
        0 2px 4px rgba(0,0,0,0.3),
        inset 0 1px 0 rgba(0,0,0,0.2);
}
```

### Animações
```css
/* animations.css */
@keyframes pageFlutter {
    0% { transform: rotateY(0deg); }
    50% { transform: rotateY(5deg); }
    100% { transform: rotateY(0deg); }
}

.page-turning {
    animation: pageFlutter 0.6s ease-in-out;
}

/* Efeito de hover nas receitas */
.recipe-content:hover .recipe-illustration {
    animation: float 3s ease-in-out infinite;
}

@keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
}

/* Animação de crafting */
.crafting-progress {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: url('../assets/textures/parchment.jpg');
    padding: 40px;
    border-radius: 10px;
    box-shadow: 0 0 50px rgba(0,0,0,0.8);
}

.crafting-animation {
    width: 200px;
    height: 200px;
    position: relative;
}

.hammer-animation {
    animation: hammerStrike 1s ease-in-out infinite;
}

@keyframes hammerStrike {
    0%, 100% { transform: rotate(-30deg); }
    50% { transform: rotate(30deg); }
}
```

---

## 🔊 Sistema de Sons

### Implementação de Áudio
```javascript
// sounds.js
const soundManager = {
    sounds: {
        'book-open': new Audio('assets/sounds/book-open.mp3'),
        'page-turn': new Audio('assets/sounds/page-turn.mp3'),
        'craft-start': new Audio('assets/sounds/craft-start.mp3'),
        'craft-complete': new Audio('assets/sounds/craft-complete.mp3'),
        'hover': new Audio('assets/sounds/hover.mp3')
    },
    
    play(soundName) {
        if (this.sounds[soundName]) {
            this.sounds[soundName].currentTime = 0;
            this.sounds[soundName].play();
        }
    },
    
    preloadAll() {
        Object.values(this.sounds).forEach(audio => {
            audio.load();
            audio.volume = 0.5;
        });
    }
};
```

---

## 📱 Responsividade

### Adaptação para Diferentes Resoluções
```javascript
// responsive.js
function adjustBookSize() {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    
    let bookWidth = 922;
    let bookHeight = 600;
    
    // Ajustar para resoluções menores
    if (screenWidth < 1024) {
        const scale = screenWidth / 1024;
        bookWidth = Math.floor(922 * scale);
        bookHeight = Math.floor(600 * scale);
    }
    
    $('#craftbook').turn('size', bookWidth, bookHeight);
}

window.addEventListener('resize', debounce(adjustBookSize, 250));
```

---

## 🔄 Integração com Sistema Existente

### Adaptação dos Eventos Lua
```lua
-- client/nui_handler.lua
local bookOpen = false

RegisterNetEvent("murphy_craft:OpenCraftingMenu", function(type, identification)
    if bookOpen then return end
    
    local menuData = Workbench[type]
    if not menuData then 
        print("ERROR: No craft data found for " .. tostring(type))
        return 
    end
    
    -- Preparar dados para o livro
    local bookData = {
        type = type,
        identification = identification,
        title = menuData.main_header,
        subtitle = menuData.main_subheader,
        categories = {}
    }
    
    -- Organizar receitas por categoria
    for _, category in ipairs(menuData.categories) do
        table.insert(bookData.categories, {
            type = category.type,
            header = category.header,
            subheader = category.subheader,
            icon = category.icon,
            recipes = category.recipe
        })
    end
    
    -- Enviar para NUI
    SendNUIMessage({
        action = "openBook",
        data = bookData
    })
    
    SetNuiFocus(true, true)
    bookOpen = true
    
    -- Animação de abrir livro
    PlaySound(-1, "BOOK_OPEN", "HUD_FRONTEND_DEFAULT_SOUNDSET", 0, 0, 1)
end)

RegisterNUICallback('closeBook', function(data, cb)
    SetNuiFocus(false, false)
    bookOpen = false
    PlaySound(-1, "BOOK_CLOSE", "HUD_FRONTEND_DEFAULT_SOUNDSET", 0, 0, 1)
    cb('ok')
end)

RegisterNUICallback('startCrafting', function(data, cb)
    -- Verificar requisitos
    TriggerServerEvent("murphy_craft:TryCraft", data.settings, data.recipeIndex, data.amount)
    cb('ok')
end)
```

---

## 📊 Funcionalidades Adicionais

### 1. Sistema de Busca no Índice
```javascript
// search.js
class RecipeSearch {
    constructor(book) {
        this.book = book;
        this.searchInput = document.querySelector('#recipe-search');
        
        this.searchInput.addEventListener('input', 
            debounce(this.handleSearch.bind(this), 300)
        );
    }
    
    handleSearch(event) {
        const query = event.target.value.toLowerCase();
        
        if (query.length < 2) {
            this.showAllRecipes();
            return;
        }
        
        const results = this.findRecipes(query);
        this.highlightResults(results);
    }
    
    findRecipes(query) {
        return Object.values(this.book.recipes)
            .flat()
            .filter(recipe => 
                recipe.label.toLowerCase().includes(query) ||
                recipe.description.toLowerCase().includes(query)
            );
    }
}
```

### 2. Sistema de Favoritos
```javascript
// favorites.js
class FavoritesSystem {
    constructor() {
        this.favorites = this.loadFavorites();
    }
    
    toggleFavorite(recipeId) {
        const index = this.favorites.indexOf(recipeId);
        
        if (index > -1) {
            this.favorites.splice(index, 1);
        } else {
            this.favorites.push(recipeId);
        }
        
        this.saveFavorites();
        this.updateUI(recipeId);
    }
    
    loadFavorites() {
        // Carregar do localStorage ou do servidor
        return JSON.parse(localStorage.getItem('craftingFavorites') || '[]');
    }
    
    saveFavorites() {
        localStorage.setItem('craftingFavorites', JSON.stringify(this.favorites));
        
        // Sincronizar com servidor
        fetch('https://murphy_craft/saveFavorites', {
            method: 'POST',
            body: JSON.stringify({ favorites: this.favorites })
        });
    }
}
```

### 3. Notas Pessoais nas Receitas
```javascript
// notes.js
class RecipeNotes {
    constructor() {
        this.notes = {};
    }
    
    addNote(recipeId, note) {
        this.notes[recipeId] = {
            text: note,
            timestamp: Date.now()
        };
        
        this.saveNotes();
        this.renderNote(recipeId);
    }
    
    renderNote(recipeId) {
        const noteElement = `
            <div class="recipe-note">
                <div class="note-paper">
                    <p>${this.notes[recipeId].text}</p>
                    <span class="note-date">
                        ${new Date(this.notes[recipeId].timestamp).toLocaleDateString()}
                    </span>
                </div>
            </div>
        `;
        
        // Adicionar à página da receita
        document.querySelector(`[data-recipe="${recipeId}"] .recipe-content`)
            .insertAdjacentHTML('beforeend', noteElement);
    }
}
```

---

## 🚀 Cronograma de Implementação

### Fase 1: Setup e Prototipagem (1 semana)
- [ ] Configurar estrutura de arquivos
- [ ] Integrar Turn.js
- [ ] Criar templates HTML base
- [ ] Desenvolver estilos CSS iniciais
- [ ] Implementar sistema de páginas

### Fase 2: Desenvolvimento Core (2 semanas)
- [ ] Sistema de renderização de receitas
- [ ] Integração com backend Lua
- [ ] Sistema de categorias (abas)
- [ ] Funcionalidade de crafting


### Fase 3: Refinamento Visual (1 semana)
- [ ] Texturas e efeitos visuais
- [ ] Animações detalhadas
- [ ] Ilustrações de itens
- [ ] Ajustes de tipografia

### Fase 4: Funcionalidades Extras (1 semana)
- [ ] Sistema de busca
- [ ] Favoritos
- [ ] Notas pessoais
- [ ] Tutorial interativo

### Fase 5: Testes e Otimização (1 semana)
- [ ] Testes de performance
- [ ] Compatibilidade com resoluções
- [ ] Ajustes finais
- [ ] Deploy

---

## 🎯 Métricas de Sucesso

- **Performance**: Transições de página < 100ms
- **Usabilidade**: Interface intuitiva sem necessidade de tutorial
- **Imersão**: Feedback positivo sobre a experiência "livro"
- **Compatibilidade**: Funcional em todas as resoluções comuns

---

## 📝 Considerações Finais

Esta implementação transforma completamente a experiência de crafting, criando uma interface imersiva que se encaixa perfeitamente no universo Red Dead Redemption. O formato de livro não apenas é visualmente atraente, mas também organiza o conteúdo de forma intuitiva e escalável.