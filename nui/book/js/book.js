class Book {
    constructor() {
        this.currentPage = 0;
        this.currentCategory = null;
        this.recipes = {};
        this.categories = [];
        this.searchTerm = '';
        
        this.initializeBook();
        this.setupEventListeners();
    }

    initializeBook() {
        // Inicializar Turn.js
        $('#book').turn({
            width: 922,
            height: 600,
            elevation: 50,
            gradients: true,
            autoCenter: true,
            when: {
                turning: (event, page) => {
                    this.currentPage = page;
                    this.updateState();
                }
            }
        });

        // Solicitar categorias ao carregar
        fetch('https://npp_crafting/requestCategories', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({})
        });
    }

    setupEventListeners() {
        // Pesquisa
        $('#recipe-search').on('input', (e) => {
            this.searchTerm = e.target.value.toLowerCase();
            this.filterRecipes();
        });

        // Filtro de categorias
        $('.categories-filter').on('click', '.category-btn', (e) => {
            const category = $(e.target).data('category');
            this.loadCategory(category);
        });

        // Eventos NUI
        window.addEventListener('message', (event) => {
            const data = event.data;
            
            switch(data.action) {
                case 'updateCategories':
                    this.renderCategories(data.data);
                    break;
                case 'updateRecipes':
                    this.renderRecipes(data.data);
                    break;
                case 'openBook':
                    this.openBook(data.data);
                    break;
                case 'closeBook':
                    this.closeBook();
                    break;
            }
        });
    }

    renderCategories(categories) {
        this.categories = categories;
        
        // Renderizar filtros
        const filterHtml = categories.map(cat => 
            `<button class="category-btn" data-category="${cat}">${cat}</button>`
        ).join('');
        $('.categories-filter').html(filterHtml);

        // Renderizar índice
        const indexHtml = categories.map(cat =>
            `<div class="category-item" data-category="${cat}">
                <h3>${cat}</h3>
                <div class="category-preview"></div>
            </div>`
        ).join('');
        $('.category-list').html(indexHtml);
    }

    renderRecipes(recipes) {
        if (!recipes || !recipes.length) return;

        const recipesHtml = recipes.map((recipe, index) => {
            const materials = JSON.parse(recipe.materials);
            const result = JSON.parse(recipe.result)[0];

            return `
                <div class="page recipe-page" data-recipe-id="${recipe.id}">
                    <div class="recipe-content">
                        <h2>${recipe.name}</h2>
                        <div class="recipe-description">${recipe.description}</div>
                        
                        <div class="recipe-details">
                            <div class="materials">
                                <h3>Materiais Necessários:</h3>
                                <ul>
                                    ${materials.map(mat => 
                                        `<li>${mat.amount}x ${mat.item}</li>`
                                    ).join('')}
                                </ul>
                            </div>
                            
                            <div class="result">
                                <h3>Resultado:</h3>
                                <p>${result.amount}x ${result.item}</p>
                            </div>

                            <div class="recipe-info">
                                <p>Tempo: ${recipe.worktime}s</p>
                                <p>Nível: ${recipe.level}</p>
                            </div>
                        </div>

                        <button class="craft-btn" data-recipe-id="${recipe.id}">
                            Criar Item
                        </button>
                    </div>
                </div>`;
        }).join('');

        $('#recipe-pages').html(recipesHtml);
        $('#book').turn('refresh');
    }

    loadCategory(category) {
        this.currentCategory = category;
        
        fetch('https://npp_crafting/requestRecipes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ category })
        });
    }

    filterRecipes() {
        if (!this.searchTerm) {
            $('.recipe-page').show();
            return;
        }

        $('.recipe-page').each((_, page) => {
            const $page = $(page);
            const text = $page.text().toLowerCase();
            $page.toggle(text.includes(this.searchTerm));
        });
    }

    updateState() {
        fetch('https://npp_crafting/updateBookState', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                page: this.currentPage,
                category: this.currentCategory
            })
        });
    }

    openBook(data) {
        $('#craft-book').show();
        $('#book').turn('page', 1);
    }

    closeBook() {
        $('#craft-book').hide();
    }
}

// Inicializar quando o documento estiver pronto
$(document).ready(() => {
    window.craftBook = new Book();
}); 