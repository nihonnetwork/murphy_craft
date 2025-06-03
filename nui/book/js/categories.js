class CategoryManager {
    constructor(book) {
        this.book = book;
        this.categories = [];
        this.currentCategory = null;
        
        this.setupTabs();
    }
    
    setupTabs() {
        const tabContainer = document.querySelector('.book-tabs');
        
        // Configurar abas para cada categoria
        Object.keys(this.book.recipes).forEach((category, index) => {
            const tab = this.createCategoryTab(category, index);
            tabContainer.appendChild(tab);
            this.categories.push({
                name: category,
                startPage: this.calculateStartPage(index)
            });
        });
    }
    
    createCategoryTab(category, index) {
        const tab = document.createElement('div');
        tab.className = 'category-tab';
        tab.style.top = `${100 + (index * 60)}px`;
        tab.style.backgroundColor = this.getCategoryColor(index);
        
        tab.innerHTML = `<span>${category}</span>`;
        
        tab.addEventListener('click', () => {
            const startPage = this.calculateStartPage(index);
            $('#craftbook').turn('page', startPage);
            this.setActiveCategory(category);
        });
        
        return tab;
    }
    
    getCategoryColor(index) {
        const colors = [
            '#8B4513', // Marrom escuro
            '#654321', // Marrom médio
            '#A0522D', // Siena
            '#D2691E', // Chocolate
            '#8B7355', // Marrom claro
            '#CD853F'  // Peru
        ];
        
        return colors[index % colors.length];
    }
    
    calculateStartPage(index) {
        // 4 páginas iniciais (capa + índice)
        let startPage = 4;
        
        // Adicionar páginas para categorias anteriores
        for (let i = 0; i < index; i++) {
            const recipesInCategory = this.book.recipes[Object.keys(this.book.recipes)[i]].length;
            startPage += Math.ceil(recipesInCategory / 2) + 1; // +1 para página divisória
        }
        
        return startPage;
    }
    
    setActiveCategory(category) {
        if (this.currentCategory === category) return;
        
        // Remover classe ativa de todas as abas
        document.querySelectorAll('.category-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        
        // Adicionar classe ativa à aba selecionada
        const activeTab = Array.from(document.querySelectorAll('.category-tab'))
            .find(tab => tab.textContent === category);
            
        if (activeTab) {
            activeTab.classList.add('active');
            this.currentCategory = category;
        }
    }
    
    updateCurrentCategory(page) {
        // Encontrar categoria atual baseado na página
        const category = this.categories.find((cat, index) => {
            const nextCat = this.categories[index + 1];
            const startPage = cat.startPage;
            const endPage = nextCat ? nextCat.startPage - 1 : Infinity;
            
            return page >= startPage && page <= endPage;
        });
        
        if (category) {
            this.setActiveCategory(category.name);
        }
    }
    
    renderCategoryDivider(category, index) {
        const dividerPage = document.createElement('div');
        dividerPage.className = 'page category-divider';
        dividerPage.style.backgroundColor = this.getCategoryColor(index);
        
        dividerPage.innerHTML = `
            <div class="divider-content">
                <h2>${category}</h2>
                <div class="category-description">
                    ${this.getCategoryDescription(category)}
                </div>
                <div class="category-stats">
                    <div class="stat">
                        <span class="stat-value">${this.book.recipes[category].length}</span>
                        <span class="stat-label">Receitas</span>
                    </div>
                </div>
            </div>
        `;
        
        document.querySelector('#recipe-pages').appendChild(dividerPage);
    }
    
    getCategoryDescription(category) {
        const descriptions = {
            'Tendas': 'Abrigos e estruturas temporárias para sua jornada',
            'Mesas': 'Superfícies de trabalho e mobília funcional',
            'Decoração': 'Itens para personalizar seu espaço',
            'Ferramentas': 'Equipamentos essenciais para sobrevivência',
            'Armas': 'Proteção e caça na fronteira',
            'Consumíveis': 'Itens para restaurar saúde e energia'
        };
        
        return descriptions[category] || 'Receitas especiais desta categoria';
    }
}

// Exportar para uso global
window.CategoryManager = CategoryManager; 