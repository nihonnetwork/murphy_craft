class CraftingSystem {
    constructor() {
        this.currentRecipe = null;
        this.isCrafting = false;
        this.craftProgress = 0;
        this.craftInterval = null;
        
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Botões de crafting
        $(document).on('click', '.craft-btn', (e) => {
            const recipeId = $(e.currentTarget).data('recipe-id');
            this.openCraftingModal(recipeId);
        });

        // Modal
        $('.modal .close').on('click', () => {
            this.closeCraftingModal();
        });

        $('#start-craft').on('click', () => {
            this.startCrafting();
        });

        $('#cancel-craft').on('click', () => {
            this.cancelCrafting();
        });

        // Quantidade
        $('#craft-amount').on('input', (e) => {
            const amount = parseInt(e.target.value);
            if (amount < 1) e.target.value = 1;
            this.updateRequiredMaterials(amount);
        });

        // Eventos NUI
        window.addEventListener('message', (event) => {
            const data = event.data;
            
            switch(data.action) {
                case 'craftingStarted':
                    this.onCraftingStarted(data.data);
                    break;
                case 'craftingFinished':
                    this.onCraftingFinished(data.data);
                    break;
                case 'craftingFailed':
                    this.onCraftingFailed(data.data);
                    break;
                case 'craftingCancelled':
                    this.onCraftingCancelled();
                    break;
                case 'updateMaterials':
                    this.updateMaterialsList(data.data);
                    break;
            }
        });
    }

    openCraftingModal(recipeId) {
        this.currentRecipe = window.craftBook.recipes.find(r => r.id === recipeId);
        if (!this.currentRecipe) return;

        // Atualizar informações do modal
        $('.recipe-name').text(this.currentRecipe.name);
        $('.recipe-description').text(this.currentRecipe.description);
        
        // Resetar quantidade
        $('#craft-amount').val(1);
        this.updateRequiredMaterials(1);

        // Mostrar modal
        $('#craft-modal').show();
    }

    closeCraftingModal() {
        $('#craft-modal').hide();
        this.currentRecipe = null;
        this.resetCraftingState();
    }

    updateRequiredMaterials(amount) {
        if (!this.currentRecipe) return;

        const materials = JSON.parse(this.currentRecipe.materials);
        const html = materials.map(mat => {
            const required = mat.amount * amount;
            return `
                <div class="ingredient">
                    <span class="name">${mat.item}</span>
                    <span class="amount">${required}x</span>
                </div>`;
        }).join('');

        $('.ingredients-list').html(html);

        // Verificar materiais disponíveis
        fetch('https://npp_crafting/checkMaterials', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                recipe: this.currentRecipe.id,
                amount: amount
            })
        });
    }

    startCrafting() {
        if (this.isCrafting || !this.currentRecipe) return;

        const amount = parseInt($('#craft-amount').val());
        if (amount < 1) return;

        fetch('https://npp_crafting/startCraft', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                recipe: this.currentRecipe.id,
                amount: amount
            })
        });
    }

    onCraftingStarted(data) {
        this.isCrafting = true;
        this.craftProgress = 0;

        // Mostrar barra de progresso
        $('.crafting-controls').hide();
        $('.crafting-progress').removeClass('hidden');

        // Iniciar animação
        const duration = data.duration * 1000;
        const updateInterval = 100;
        
        this.craftInterval = setInterval(() => {
            this.craftProgress += (updateInterval / duration) * 100;
            if (this.craftProgress >= 100) {
                this.craftProgress = 100;
                clearInterval(this.craftInterval);
            }
            $('.progress').css('width', `${this.craftProgress}%`);
        }, updateInterval);
    }

    onCraftingFinished(data) {
        this.resetCraftingState();
        this.closeCraftingModal();

        // Mostrar notificação de sucesso
        this.showNotification('Item criado com sucesso!', 'success');
    }

    onCraftingFailed(data) {
        this.resetCraftingState();
        this.showNotification(data.reason || 'Falha ao criar item!', 'error');
    }

    onCraftingCancelled() {
        this.resetCraftingState();
        this.showNotification('Crafting cancelado!', 'warning');
    }

    cancelCrafting() {
        if (!this.isCrafting) return;

        fetch('https://npp_crafting/cancelCraft', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                recipe: this.currentRecipe.id
            })
        });
    }

    resetCraftingState() {
        this.isCrafting = false;
        this.craftProgress = 0;
        
        if (this.craftInterval) {
            clearInterval(this.craftInterval);
            this.craftInterval = null;
        }

        $('.progress').css('width', '0%');
        $('.crafting-progress').addClass('hidden');
        $('.crafting-controls').show();
    }

    updateMaterialsList(materials) {
        $('.ingredient').each((_, el) => {
            const $el = $(el);
            const itemName = $el.find('.name').text();
            const required = parseInt($el.find('.amount').text());
            const available = materials[itemName] || 0;

            $el.toggleClass('available', available >= required);
            $el.find('.amount').text(`${required}x (${available} disponível)`);
        });

        // Habilitar/desabilitar botão de craft
        const canCraft = $('.ingredient.available').length === $('.ingredient').length;
        $('#start-craft').prop('disabled', !canCraft);
    }

    showNotification(message, type = 'info') {
        const notification = $(`
            <div class="notification ${type}">
                <span class="message">${message}</span>
            </div>
        `);

        $('body').append(notification);
        
        setTimeout(() => {
            notification.addClass('fade-out');
            setTimeout(() => notification.remove(), 500);
        }, 3000);
    }
}

// Inicializar quando o documento estiver pronto
$(document).ready(() => {
    window.craftingSystem = new CraftingSystem();
}); 