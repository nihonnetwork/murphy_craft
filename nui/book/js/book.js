/**
 * Murphy Craft - Sistema Principal do Livro
 * Gerencia a interface do livro, navegação e comunicação com o backend
 */

class MurphyCraft {
    constructor() {
        // Estado do sistema
        this.state = {
            isOpen: false,
            currentPage: 1,
            totalPages: 1,
            currentCategory: null,
            searchTerm: '',
            activeFilter: 'all',
            isLoading: false
        };

        // Dados
        this.data = {
            workbenchType: null,
            workbenchId: null,
            categories: [],
            recipes: {},
            playerInventory: {},
            favorites: this.loadFavorites()
        };

        // Configurações
        this.config = {
            book: {
                width: 922,
                height: 600,
                autoCenter: true,
                display: 'double',
                acceleration: true,
                elevation: 50,
                gradients: true,
                turnCorners: 'bl,br',
                duration: 600
            },
            debug: false
        };

        // Elementos DOM
        this.elements = {};
        
        this.init();
    }

    /**
     * Inicialização do sistema
     */
    init() {
        this.cacheElements();
        this.setupBook();
        this.setupEventListeners();
        this.setupNUIHandlers();
        
        if (this.config.debug) {
            console.log('[MurphyCraft] Sistema inicializado');
        }
    }

    /**
     * Cache dos elementos DOM
     */
    cacheElements() {
        this.elements = {
            container: $('#craft-book-container'),
            book: $('#craftbook'),
            search: $('#recipe-search'),
            clearSearch: $('#clear-search'),
            filterBtns: $('.filter-btn'),
            closeBtn: $('#close-book'),
            prevBtn: $('#prev-page'),
            nextBtn: $('#next-page'),
            pageIndicator: $('#page-indicator'),
            indexList: $('.index-list'),
            recipePagesContainer: $('#recipe-pages-container'),
            bookTabs: $('.book-tabs'),
            notificationContainer: $('#notification-container')
        };
    }

    /**
     * Configuração do Turn.js
     */
    setupBook() {
        this.elements.book.turn({
            ...this.config.book,
            when: {
                turning: (event, page, view) => {
                    this.onPageTurning(page, view);
                },
                turned: (event, page, view) => {
                    this.onPageTurned(page, view);
                },
                start: (event, pageObject, corner) => {
                    this.playSound('page-start');
                },
                end: (event, pageObject, turned) => {
                    if (turned) {
                        this.playSound('page-turn');
                    }
                }
            }
        });

        // Atualizar estado inicial
        this.state.totalPages = this.elements.book.turn('pages');
        this.updatePageIndicator();
        this.updateNavigationButtons();
    }

    /**
     * Event listeners
     */
    setupEventListeners() {
        // Pesquisa
        this.elements.search.on('input', debounce((e) => {
            this.handleSearch(e.target.value);
        }, 300));

        this.elements.clearSearch.on('click', () => {
            this.clearSearch();
        });

        // Filtros
        this.elements.filterBtns.on('click', (e) => {
            this.handleFilter($(e.target).data('filter'));
        });

        // Navegação
        this.elements.prevBtn.on('click', () => {
            this.previousPage();
        });

        this.elements.nextBtn.on('click', () => {
            this.nextPage();
        });

        // Fechar livro
        this.elements.closeBtn.on('click', () => {
            this.closeBook();
        });

        // Teclas de atalho
        $(document).on('keydown', (e) => {
            if (!this.state.isOpen) return;
            
            switch(e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    this.previousPage();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    this.nextPage();
                    break;
                case 'Escape':
                    e.preventDefault();
                    this.closeBook();
                    break;
                case 'Home':
                    e.preventDefault();
                    this.goToPage(1);
                    break;
                case 'End':
                    e.preventDefault();
                    this.goToPage(this.state.totalPages);
                    break;
            }
        });

        // Redimensionamento da janela
        $(window).on('resize', debounce(() => {
            this.handleResize();
        }, 250));

        // Clique nos itens do índice
        this.elements.indexList.on('click', '.index-item', (e) => {
            const category = $(e.currentTarget).data('category');
            this.goToCategory(category);
        });
    }

    /**
     * Handlers para comunicação NUI
     */
    setupNUIHandlers() {
        window.addEventListener('message', (event) => {
            const { action, data } = event.data;

            switch (action) {
                case 'openBook':
                    this.openBook(data);
                    break;
                case 'closeBook':
                    this.closeBook();
                    break;
                case 'updateRecipes':
                    this.updateRecipes(data);
                    break;
                case 'updateInventory':
                    this.updateInventory(data);
                    break;
                case 'showNotification':
                    this.showNotification(data);
                    break;
                case 'craftingStarted':
                    window.craftingSystem?.onCraftingStarted(data);
                    break;
                case 'craftingFinished':
                    window.craftingSystem?.onCraftingFinished(data);
                    break;
                case 'craftingCancelled':
                    window.craftingSystem?.onCraftingCancelled(data);
                    break;
            }
        });
    }

    /**
     * Abrir o livro
     */
    openBook(data) {
        this.state.isOpen = true;
        this.data.workbenchType = data.type;
        this.data.workbenchId = data.identification;
        
        // Mostrar container
        this.elements.container.removeClass('hidden').addClass('opening');
        
        // Carregar dados
        this.loadWorkbenchData(data);
        
        // Focar no livro
        this.elements.book.focus();
        
        // Som de abertura
        this.playSound('book-open');
        
        // Notificar backend
        this.sendNUIMessage('bookOpened', {
            type: data.type,
            id: data.identification
        });

        if (this.config.debug) {
            console.log('[MurphyCraft] Livro aberto:', data);
        }
    }

    /**
     * Fechar o livro
     */
    closeBook() {
        if (!this.state.isOpen) return;

        this.state.isOpen = false;
        
        // Animação de fechamento
        this.elements.container.addClass('closing');
        
        setTimeout(() => {
            this.elements.container.addClass('hidden').removeClass('opening closing');
            this.resetBook();
        }, 500);

        // Som de fechamento
        this.playSound('book-close');

        // Notificar backend
        this.sendNUIMessage('closeBook', {});

        if (this.config.debug) {
            console.log('[MurphyCraft] Livro fechado');
        }
    }

    /**
     * Carregar dados do workbench
     */
    loadWorkbenchData(data) {
        this.state.isLoading = true;
        
        // Mostrar loading
        this.showLoading();

        // Organizar dados
        if (data.categories) {
            this.data.categories = data.categories;
            this.organizeRecipes();
            this.renderBook();
        }

        // Solicitar inventário do jogador
        this.requestPlayerInventory();

        this.state.isLoading = false;
        this.hideLoading();
    }

    /**
     * Organizar receitas por categoria
     */
    organizeRecipes() {
        this.data.recipes = {};
        
        this.data.categories.forEach(category => {
            if (!this.data.recipes[category.header]) {
                this.data.recipes[category.header] = [];
            }
            
            if (category.recipe) {
                category.recipe.forEach(recipe => {
                    this.data.recipes[category.header].push({
                        ...recipe,
                        categoryType: category.type,
                        categoryIcon: category.icon,
                        categoryHeader: category.header,
                        categorySubheader: category.subheader
                    });
                });
            }
        });

        if (this.config.debug) {
            console.log('[MurphyCraft] Receitas organizadas:', this.data.recipes);
        }
    }

    /**
     * Renderizar o livro completo
     */
    renderBook() {
        this.renderIndex();
        this.renderCategoryTabs();
        this.renderRecipePages();
        this.updateBookStructure();
    }

    /**
     * Renderizar índice
     */
    renderIndex() {
        const indexHTML = Object.keys(this.data.recipes).map((category, index) => {
            const recipes = this.data.recipes[category];
            const startPage = this.calculateCategoryStartPage(index);
            
            return `
                <div class="index-item" data-category="${category}" data-page="${startPage}">
                    <span class="index-category">${category}</span>
                    <span class="index-count">${recipes.length} receitas</span>
                </div>
            `;
        }).join('');

        this.elements.indexList.html(indexHTML);
    }

    /**
     * Renderizar abas de categorias
     */
    renderCategoryTabs() {
        const tabsHTML = Object.keys(this.data.recipes).map((category, index) => {
            const startPage = this.calculateCategoryStartPage(index);
            const topPosition = 100 + (index * 60);
            
            return `
                <div class="category-tab" 
                     data-category="${category}" 
                     data-page="${startPage}"
                     style="top: ${topPosition}px;">
                    <span>${category}</span>
                </div>
            `;
        }).join('');

        this.elements.bookTabs.html(tabsHTML);

        // Event listeners para as abas
        this.elements.bookTabs.find('.category-tab').on('click', (e) => {
            const page = parseInt($(e.currentTarget).data('page'));
            this.goToPage(page);
        });
    }

    /**
     * Renderizar páginas de receitas
     */
    renderRecipePages() {
        let pagesHTML = '';
        let pageCount = 2; // Começar após capa e índice

        Object.entries(this.data.recipes).forEach(([category, recipes]) => {
            // Página divisória da categoria
            pagesHTML += this.renderCategoryDivider(category, recipes);
            pageCount++;

            // Páginas de receitas (2 por página)
            for (let i = 0; i < recipes.length; i += 2) {
                const leftRecipe = recipes[i];
                const rightRecipe = recipes[i + 1];
                
                pagesHTML += this.renderRecipePage(leftRecipe, rightRecipe, pageCount);
                pageCount++;
            }
        });

        this.elements.recipePagesContainer.html(pagesHTML);
    }

    /**
     * Renderizar página divisória de categoria
     */
    renderCategoryDivider(category, recipes) {
        const categoryData = this.data.categories.find(cat => cat.header === category);
        
        return `
            <div class="page category-divider">
                <div class="page-content">
                    <div class="divider-header">
                        <h2 class="category-title">${category}</h2>
                        <p class="category-subtitle">${categoryData?.subheader || ''}</p>
                        <div class="category-ornament">❦</div>
                    </div>
                    
                    <div class="category-stats">
                        <div class="stat-item">
                            <span class="stat-number">${recipes.length}</span>
                            <span class="stat-label">Receitas</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-number">${this.getAvailableRecipesCount(recipes)}</span>
                            <span class="stat-label">Disponíveis</span>
                        </div>
                    </div>
                    
                    <div class="category-description">
                        <p>${this.getCategoryDescription(category)}</p>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Renderizar página de receita
     */
    renderRecipePage(leftRecipe, rightRecipe, pageNumber) {
        return `
            <div class="page recipe-page-double">
                <div class="page-left">
                    ${leftRecipe ? this.renderSingleRecipe(leftRecipe) : '<div class="empty-recipe"></div>'}
                </div>
                <div class="page-right">
                    ${rightRecipe ? this.renderSingleRecipe(rightRecipe) : '<div class="empty-recipe"></div>'}
                </div>
            </div>
        `;
    }

    /**
     * Renderizar receita individual
     */
    renderSingleRecipe(recipe) {
        const isAvailable = this.isRecipeAvailable(recipe);
        const canCraft = this.canCraftRecipe(recipe);
        
        return `
            <div class="recipe-card ${isAvailable ? 'available' : 'unavailable'}" data-recipe-id="${recipe.label}">
                <div class="recipe-header">
                    <h3 class="recipe-title">${recipe.label}</h3>
                    <div class="recipe-actions">
                        <button class="favorite-btn ${this.isFavorite(recipe.label) ? 'active' : ''}" 
                                data-recipe="${recipe.label}">
                            ⭐
                        </button>
                    </div>
                </div>
                
                <div class="recipe-illustration">
                    <img src="assets/illustrations/${recipe.icon || 'default'}.png" 
                         alt="${recipe.label}"
                         onerror="this.src='assets/illustrations/default.png'" />
                </div>
                
                <div class="recipe-content">
                    <p class="recipe-description">${recipe.description}</p>
                    
                    <div class="ingredients-list">
                        <h4>Materiais:</h4>
                        <ul>
                            ${recipe.need.map(([item, amount]) => {
                                const hasAmount = this.getPlayerItemAmount(item);
                                const hasEnough = hasAmount >= amount;
                                
                                return `
                                    <li class="ingredient ${hasEnough ? 'has-enough' : 'missing'}">
                                        <span class="ingredient-name">${item}</span>
                                        <span class="ingredient-amount">${amount}x</span>
                                        <span class="ingredient-owned">(${hasAmount})</span>
                                    </li>
                                `;
                            }).join('')}
                        </ul>
                    </div>
                    
                    <div class="recipe-result">
                        <h4>Resultado:</h4>
                        <div class="result-items">
                            ${recipe.craft.map(([item, amount]) => `
                                <span class="result-item">${amount}x ${item}</span>
                            `).join('')}
                        </div>
                    </div>
                    
                    <div class="recipe-info">
                        <div class="info-item">
                            <span class="info-icon">⏱️</span>
                            <span>${recipe.worktime}s</span>
                        </div>
                    </div>
                </div>
                
                <div class="recipe-footer">
                    <button class="craft-btn ${canCraft ? 'enabled' : 'disabled'}" 
                            data-recipe="${recipe.label}"
                            ${!canCraft ? 'disabled' : ''}>
                        <span class="btn-icon">🔨</span>
                        <span class="btn-text">Craftar</span>
                    </button>
                </div>
            </div>
        `;
    }

    /**
     * Atualizar estrutura do livro
     */
    updateBookStructure() {
        // Refresh do Turn.js
        this.elements.book.turn('refresh');
        
        // Atualizar contadores
        this.state.totalPages = this.elements.book.turn('pages');
        this.updatePageIndicator();
        this.updateNavigationButtons();
        
        // Event listeners para receitas
        this.setupRecipeEventListeners();
    }

    /**
     * Event listeners para receitas
     */
    setupRecipeEventListeners() {
        // Botões de craft
        $(document).off('click', '.craft-btn').on('click', '.craft-btn', (e) => {
            if ($(e.currentTarget).hasClass('disabled')) return;
            
            const recipeLabel = $(e.currentTarget).data('recipe');
            const recipe = this.findRecipeByLabel(recipeLabel);
            
            if (recipe) {
                window.craftingSystem?.openCraftingModal(recipe);
            }
        });

        // Botões de favorito
        $(document).off('click', '.favorite-btn').on('click', '.favorite-btn', (e) => {
            e.stopPropagation();
            const recipeLabel = $(e.currentTarget).data('recipe');
            this.toggleFavorite(recipeLabel);
        });

        // Hover nas receitas
        $(document).off('mouseenter mouseleave', '.recipe-card')
            .on('mouseenter', '.recipe-card', (e) => {
                $(e.currentTarget).addClass('hovered');
                this.playSound('hover');
            })
            .on('mouseleave', '.recipe-card', (e) => {
                $(e.currentTarget).removeClass('hovered');
            });
    }

    /**
     * Navegação de páginas
     */
    nextPage() {
        if (this.state.currentPage < this.state.totalPages) {
            this.elements.book.turn('next');
        }
    }

    previousPage() {
        if (this.state.currentPage > 1) {
            this.elements.book.turn('previous');
        }
    }

    goToPage(page) {
        if (page >= 1 && page <= this.state.totalPages) {
            this.elements.book.turn('page', page);
        }
    }

    goToCategory(category) {
        const categoryIndex = Object.keys(this.data.recipes).indexOf(category);
        if (categoryIndex >= 0) {
            const page = this.calculateCategoryStartPage(categoryIndex);
            this.goToPage(page);
        }
    }

    /**
     * Eventos de página
     */
    onPageTurning(page, view) {
        this.state.currentPage = page;
        this.updatePageIndicator();
        this.updateNavigationButtons();
        this.updateActiveTab();
    }

    onPageTurned(page, view) {
        // Opcional: ações após virar página
        if (this.config.debug) {
            console.log('[MurphyCraft] Página virada:', page);
        }
    }

    /**
     * Pesquisa
     */
    handleSearch(searchTerm) {
        this.state.searchTerm = searchTerm.toLowerCase();
        this.filterRecipes();
    }

    clearSearch() {
        this.elements.search.val('');
        this.state.searchTerm = '';
        this.filterRecipes();
    }

    /**
     * Filtros
     */
    handleFilter(filter) {
        this.elements.filterBtns.removeClass('active');
        this.elements.filterBtns.filter(`[data-filter="${filter}"]`).addClass('active');
        
        this.state.activeFilter = filter;
        this.filterRecipes();
    }

    filterRecipes() {
        $('.recipe-card').each((index, element) => {
            const $card = $(element);
            const recipe = this.findRecipeByLabel($card.data('recipe-id'));
            
            let show = true;

            // Filtro de pesquisa
            if (this.state.searchTerm) {
                const searchText = [
                    recipe.label,
                    recipe.description,
                    ...recipe.need.map(([item]) => item),
                    ...recipe.craft.map(([item]) => item)
                ].join(' ').toLowerCase();
                
                show = show && searchText.includes(this.state.searchTerm);
            }

            // Filtro de disponibilidade
            if (this.state.activeFilter === 'available') {
                show = show && this.canCraftRecipe(recipe);
            } else if (this.state.activeFilter === 'favorites') {
                show = show && this.isFavorite(recipe.label);
            }

            $card.toggle(show);
        });
    }

    /**
     * Sistema de favoritos
     */
    toggleFavorite(recipeLabel) {
        const index = this.data.favorites.indexOf(recipeLabel);
        
        if (index > -1) {
            this.data.favorites.splice(index, 1);
        } else {
            this.data.favorites.push(recipeLabel);
        }
        
        this.saveFavorites();
        this.updateFavoriteButtons();
        this.playSound('favorite');
    }

    isFavorite(recipeLabel) {
        return this.data.favorites.includes(recipeLabel);
    }

    loadFavorites() {
        try {
            return JSON.parse(localStorage.getItem('murphy_craft_favorites') || '[]');
        } catch {
            return [];
        }
    }

    saveFavorites() {
        localStorage.setItem('murphy_craft_favorites', JSON.stringify(this.data.favorites));
        
        // Sync com servidor (opcional)
        this.sendNUIMessage('saveFavorites', { favorites: this.data.favorites });
    }

    updateFavoriteButtons() {
        $('.favorite-btn').each((index, button) => {
            const $btn = $(button);
            const recipeLabel = $btn.data('recipe');
            $btn.toggleClass('active', this.isFavorite(recipeLabel));
        });
    }

    /**
     * Utilitários
     */
    calculateCategoryStartPage(categoryIndex) {
        let page = 2; // Após capa e índice
        
        for (let i = 0; i < categoryIndex; i++) {
            const category = Object.keys(this.data.recipes)[i];
            const recipes = this.data.recipes[category];
            page += 1; // Página divisória
            page += Math.ceil(recipes.length / 2); // Páginas de receitas
        }
        
        return page + 1; // Página divisória da categoria atual
    }

    findRecipeByLabel(label) {
        for (const category of Object.values(this.data.recipes)) {
            const recipe = category.find(r => r.label === label);
            if (recipe) return recipe;
        }
        return null;
    }

    isRecipeAvailable(recipe) {
        // Verificar se o jogador tem os materiais necessários
        return recipe.need.every(([item, amount]) => {
            return this.getPlayerItemAmount(item) >= amount;
        });
    }

    canCraftRecipe(recipe) {
        // Por enquanto, mesmo que isRecipeAvailable
        // Pode incluir outras verificações (nível, job, etc.)
        return this.isRecipeAvailable(recipe);
    }

    getPlayerItemAmount(itemName) {
        return this.data.playerInventory[itemName] || 0;
    }

    getAvailableRecipesCount(recipes) {
        return recipes.filter(recipe => this.isRecipeAvailable(recipe)).length;
    }

    getCategoryDescription(category) {
        const descriptions = {
            'Tents': 'Abrigos e estruturas temporárias para proteção durante suas jornadas.',
            'Tables': 'Superfícies de trabalho e mobília funcional para organizar seu acampamento.',
            'Decor': 'Itens decorativos para personalizar e embelezar seu espaço.',
            'Essentials': 'Equipamentos essenciais para sobrevivência e trabalho.'
        };
        
        return descriptions[category] || 'Receitas especiais desta categoria.';
    }

    updatePageIndicator() {
        this.elements.pageIndicator.text(`${this.state.currentPage} / ${this.state.totalPages}`);
    }

    updateNavigationButtons() {
        this.elements.prevBtn.prop('disabled', this.state.currentPage <= 1);
        this.elements.nextBtn.prop('disabled', this.state.currentPage >= this.state.totalPages);
    }

    updateActiveTab() {
        // Determinar qual categoria está ativa baseada na página atual
        let activeCategory = null;
        let currentPage = this.state.currentPage;
        
        if (currentPage <= 2) {
            // Capa ou índice
            this.elements.bookTabs.find('.category-tab').removeClass('active');
            return;
        }
        
        Object.keys(this.data.recipes).forEach((category, index) => {
            const startPage = this.calculateCategoryStartPage(index);
            const recipes = this.data.recipes[category];
            const endPage = startPage + Math.ceil(recipes.length / 2);
            
            if (currentPage >= startPage && currentPage <= endPage) {
                activeCategory = category;
            }
        });
        
        this.elements.bookTabs.find('.category-tab').removeClass('active');
        if (activeCategory) {
            this.elements.bookTabs.find(`[data-category="${activeCategory}"]`).addClass('active');
        }
    }

    /**
     * Comunicação com backend
     */
    sendNUIMessage(action, data) {
        fetch(`https://murphy_craft/${action}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }).catch(err => {
            if (this.config.debug) {
                console.error('[MurphyCraft] Erro ao enviar mensagem NUI:', err);
            }
        });
    }

    requestPlayerInventory() {
        this.sendNUIMessage('requestInventory', {
            type: this.data.workbenchType,
            id: this.data.workbenchId
        });
    }

    updateInventory(inventory) {
        this.data.playerInventory = inventory;
        this.updateRecipeAvailability();
        
        if (this.config.debug) {
            console.log('[MurphyCraft] Inventário atualizado:', inventory);
        }
    }

    updateRecipeAvailability() {
        $('.recipe-card').each((index, element) => {
            const $card = $(element);
            const recipe = this.findRecipeByLabel($card.data('recipe-id'));
            
            if (recipe) {
                const isAvailable = this.isRecipeAvailable(recipe);
                const canCraft = this.canCraftRecipe(recipe);
                
                $card.toggleClass('available', isAvailable);
                $card.toggleClass('unavailable', !isAvailable);
                
                const $craftBtn = $card.find('.craft-btn');
                $craftBtn.toggleClass('enabled', canCraft);
                $craftBtn.toggleClass('disabled', !canCraft);
                $craftBtn.prop('disabled', !canCraft);
                
                // Atualizar contadores de ingredientes
                $card.find('.ingredient').each((i, ing) => {
                    const $ing = $(ing);
                    const itemName = $ing.find('.ingredient-name').text();
                    const requiredAmount = parseInt($ing.find('.ingredient-amount').text());
                    const hasAmount = this.getPlayerItemAmount(itemName);
                    
                    $ing.find('.ingredient-owned').text(`(${hasAmount})`);
                    $ing.toggleClass('has-enough', hasAmount >= requiredAmount);
                    $ing.toggleClass('missing', hasAmount < requiredAmount);
                });
            }
        });
    }

    /**
     * Sistema de notificações
     */
    showNotification(data) {
        const { text, type = 'info', duration = 5000 } = data;
        
        const notification = $(`
            <div class="notification ${type}">
                <div class="notification-content">
                    <span class="notification-text">${text}</span>
                    <button class="notification-close">✕</button>
                </div>
            </div>
        `);
        
        this.elements.notificationContainer.append(notification);
        
        // Auto remove
        setTimeout(() => {
            notification.addClass('fade-out');
            setTimeout(() => notification.remove(), 300);
        }, duration);
        
        // Manual close
        notification.find('.notification-close').on('click', () => {
            notification.addClass('fade-out');
            setTimeout(() => notification.remove(), 300);
        });
    }

    /**
     * Sistema de áudio
     */
    playSound(soundName) {
        // Implementar quando os arquivos de som estiverem disponíveis
        if (this.config.debug) {
            console.log('[MurphyCraft] Som:', soundName);
        }
    }

    /**
     * Loading states
     */
    showLoading() {
        this.elements.container.addClass('loading');
    }

    hideLoading() {
        this.elements.container.removeClass('loading');
    }

    /**
     * Redimensionamento
     */
    handleResize() {
        // Recalcular tamanho do livro se necessário
        const containerWidth = this.elements.container.width();
        const containerHeight = this.elements.container.height();
        
        // Ajustar tamanho do livro para telas menores
        if (containerWidth < 1024) {
            const scale = Math.min(containerWidth / 1024, containerHeight / 700);
            this.elements.book.css('transform', `scale(${scale})`);
        } else {
            this.elements.book.css('transform', 'scale(1)');
        }
        
        // Refresh do Turn.js
        setTimeout(() => {
            this.elements.book.turn('refresh');
        }, 100);
    }

    /**
     * Reset do livro
     */
    resetBook() {
        this.state.currentPage = 1;
        this.state.currentCategory = null;
        this.state.searchTerm = '';
        this.state.activeFilter = 'all';
        
        // Limpar dados
        this.data.recipes = {};
        this.data.categories = [];
        this.data.playerInventory = {};
        
        // Reset UI
        this.elements.search.val('');
        this.elements.filterBtns.removeClass('active').first().addClass('active');
        this.elements.recipePagesContainer.empty();
        this.elements.bookTabs.empty();
        this.elements.indexList.empty();
        
        // Voltar para primeira página
        this.elements.book.turn('page', 1);
    }

    /**
     * Debug mode
     */
    enableDebug() {
        this.config.debug = true;
        console.log('[MurphyCraft] Debug mode enabled');
        
        // Adicionar informações de debug
        $('body').append(`
            <div id="debug-info" style="position: fixed; top: 10px; left: 10px; background: rgba(0,0,0,0.8); color: white; padding: 10px; border-radius: 5px; font-family: monospace; font-size: 12px; z-index: 10000;">
                <div>Página: <span id="debug-page">${this.state.currentPage}</span>/<span id="debug-total">${this.state.totalPages}</span></div>
                <div>Categoria: <span id="debug-category">${this.state.currentCategory || 'Nenhuma'}</span></div>
                <div>Filtro: <span id="debug-filter">${this.state.activeFilter}</span></div>
                <div>Pesquisa: <span id="debug-search">${this.state.searchTerm || 'Nenhuma'}</span></div>
                <div>Receitas: <span id="debug-recipes">${Object.keys(this.data.recipes).length}</span></div>
                <button onclick="window.murphyCraft.exportDebugData()" style="margin-top: 5px; padding: 2px 5px;">Export Data</button>
            </div>
        `);
        
        // Atualizar debug info quando state mudar
        this.updateDebugInfo();
    }

    updateDebugInfo() {
        if (!this.config.debug) return;
        
        $('#debug-page').text(this.state.currentPage);
        $('#debug-total').text(this.state.totalPages);
        $('#debug-category').text(this.state.currentCategory || 'Nenhuma');
        $('#debug-filter').text(this.state.activeFilter);
        $('#debug-search').text(this.state.searchTerm || 'Nenhuma');
        $('#debug-recipes').text(Object.keys(this.data.recipes).length);
    }

    exportDebugData() {
        const debugData = {
            state: this.state,
            data: this.data,
            config: this.config,
            timestamp: new Date().toISOString()
        };
        
        console.log('[MurphyCraft] Debug Data:', debugData);
        
        // Download como JSON
        const blob = new Blob([JSON.stringify(debugData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `murphy_craft_debug_${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }
}

/**
 * Funções utilitárias
 */

// Debounce function
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func.apply(this, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(this, args);
    };
}

// Throttle function
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Função para validar dados de receita
function validateRecipe(recipe) {
    const required = ['label', 'description', 'need', 'craft', 'worktime'];
    
    for (const field of required) {
        if (!recipe.hasOwnProperty(field)) {
            console.warn(`[MurphyCraft] Recipe missing field: ${field}`, recipe);
            return false;
        }
    }
    
    if (!Array.isArray(recipe.need) || !Array.isArray(recipe.craft)) {
        console.warn('[MurphyCraft] Recipe need/craft must be arrays', recipe);
        return false;
    }
    
    return true;
}

// Função para formatar tempo
function formatTime(seconds) {
    if (seconds < 60) {
        return `${seconds}s`;
    } else if (seconds < 3600) {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return secs > 0 ? `${minutes}m ${secs}s` : `${minutes}m`;
    } else {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
    }
}

// Função para capitalizar primeira letra
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Função para sanitizar HTML
function sanitizeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

/**
 * Extensões do jQuery para funcionalidades específicas
 */
$.fn.shake = function(duration = 500) {
    return this.each(function() {
        const $element = $(this);
        const originalPos = $element.css('position');
        
        $element.css('position', 'relative');
        
        for (let i = 0; i < 4; i++) {
            $element.animate({ left: -10 }, 50)
                   .animate({ left: 10 }, 50)
                   .animate({ left: 0 }, 50);
        }
        
        setTimeout(() => {
            $element.css('position', originalPos);
        }, duration);
    });
};

$.fn.pulse = function(times = 1) {
    return this.each(function() {
        const $element = $(this);
        
        for (let i = 0; i < times; i++) {
            $element.animate({ transform: 'scale(1.1)' }, 150)
                   .animate({ transform: 'scale(1)' }, 150);
        }
    });
};

$.fn.glow = function(duration = 2000) {
    return this.each(function() {
        const $element = $(this);
        $element.addClass('glowing');
        
        setTimeout(() => {
            $element.removeClass('glowing');
        }, duration);
    });
};

/**
 * Event listeners globais para debugging
 */
if (typeof window !== 'undefined') {
    // Prevenir erros de Turn.js em modo debug
    window.addEventListener('error', (event) => {
        if (event.error && event.error.message && event.error.message.includes('turn')) {
            console.warn('[MurphyCraft] Turn.js error caught:', event.error.message);
            event.preventDefault();
        }
    });
    
    // Log de performance
    window.addEventListener('load', () => {
        if (window.murphyCraft && window.murphyCraft.config.debug) {
            console.log('[MurphyCraft] Page loaded in:', performance.now(), 'ms');
        }
    });
}

// Exportar para uso global
if (typeof window !== 'undefined') {
    window.MurphyCraft = MurphyCraft;
    window.validateRecipe = validateRecipe;
    window.formatTime = formatTime;
    window.capitalize = capitalize;
    window.sanitizeHTML = sanitizeHTML;
}