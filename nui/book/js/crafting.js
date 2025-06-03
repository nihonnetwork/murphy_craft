/**
 * Murphy Craft - Sistema de Crafting
 * Gerencia modais de crafting, progresso e verificações
 */

class CraftingSystem {
    constructor() {
        // Estado do crafting
        this.state = {
            isModalOpen: false,
            isCrafting: false,
            currentRecipe: null,
            selectedQuantity: 1,
            maxQuantity: 1,
            craftProgress: 0,
            craftTimeRemaining: 0
        };

        // Elementos DOM
        this.elements = {};
        
        // Timers
        this.progressInterval = null;
        this.countdownInterval = null;

        this.init();
    }

    /**
     * Inicialização
     */
    init() {
        this.cacheElements();
        this.setupEventListeners();
        this.setupProgressStages();
        
        console.log('[CraftingSystem] Sistema de crafting inicializado');
    }

    /**
     * Cache dos elementos DOM
     */
    cacheElements() {
        this.elements = {
            // Modal principal
            craftModal: $('#craft-modal'),
            modalBackdrop: $('.modal-backdrop'),
            modalClose: $('.modal-close'),
            
            // Conteúdo do modal
            recipeIcon: $('#modal-recipe-icon'),
            recipeName: $('#modal-recipe-name'),
            recipeDescription: $('#modal-recipe-description'),
            ingredientsList: $('#modal-ingredients-list'),
            
            // Controles de quantidade
            quantityInput: $('#craft-quantity'),
            qtyDecrease: $('#qty-decrease'),
            qtyIncrease: $('#qty-increase'),
            maxQuantityInfo: $('#max-quantity'),
            
            // Informações de crafting
            craftTime: $('#craft-time'),
            totalTime: $('#total-time'),
            
            // Botões
            startCraftBtn: $('#start-craft'),
            cancelCraftBtn: $('#cancel-craft'),
            
            // Modal de progresso
            progressModal: $('#progress-modal'),
            progressFill: $('.progress-fill'),
            progressText: $('#progress-text'),
            progressTime: $('#progress-time'),
            cancelProgressBtn: $('#cancel-progress'),
            
            // Animações
            hammerAnimation: $('.hammer-animation'),
            sparks: $('.sparks')
        };
    }

    /**
     * Event listeners
     */
    setupEventListeners() {
        // Fechar modais
        this.elements.modalClose.on('click', () => {
            this.closeModal();
        });

        this.elements.modalBackdrop.on('click', () => {
            this.closeModal();
        });

        this.elements.cancelCraftBtn.on('click', () => {
            this.closeModal();
        });

        // Controles de quantidade
        this.elements.qtyDecrease.on('click', () => {
            this.decreaseQuantity();
        });

        this.elements.qtyIncrease.on('click', () => {
            this.increaseQuantity();
        });

        this.elements.quantityInput.on('input', (e) => {
            this.setQuantity(parseInt(e.target.value) || 1);
        });

        // Iniciar crafting
        this.elements.startCraftBtn.on('click', () => {
            this.startCrafting();
        });

        // Cancelar progresso
        this.elements.cancelProgressBtn.on('click', () => {
            this.cancelCrafting();
        });

        // Teclas de atalho no modal
        $(document).on('keydown', (e) => {
            if (!this.state.isModalOpen) return;

            switch(e.key) {
                case 'Escape':
                    e.preventDefault();
                    this.closeModal();
                    break;
                case 'Enter':
                    e.preventDefault();
                    if (!this.state.isCrafting && this.canStartCrafting()) {
                        this.startCrafting();
                    }
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    this.increaseQuantity();
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    this.decreaseQuantity();
                    break;
            }
        });
    }

    /**
     * Configurar estágios de progresso
     */
    setupProgressStages() {
        this.progressStages = [
            { percent: 0, text: "Preparando materiais..." },
            { percent: 15, text: "Aquecendo ferramentas..." },
            { percent: 30, text: "Processando materiais..." },
            { percent: 50, text: "Moldando o item..." },
            { percent: 70, text: "Aplicando acabamentos..." },
            { percent: 85, text: "Verificando qualidade..." },
            { percent: 95, text: "Finalizando..." },
            { percent: 100, text: "Item criado com sucesso!" }
        ];
    }

    /**
     * Abrir modal de crafting
     */
    openCraftingModal(recipe) {
        if (!recipe || !this.validateRecipe(recipe)) {
            console.error('[CraftingSystem] Receita inválida:', recipe);
            return;
        }

        this.state.currentRecipe = recipe;
        this.state.isModalOpen = true;
        
        // Calcular quantidade máxima possível
        this.calculateMaxQuantity();
        
        // Preencher dados do modal
        this.populateModal();
        
        // Mostrar modal
        this.elements.craftModal.addClass('show');
        $('body').addClass('modal-open');
        
        // Focar no input de quantidade
        setTimeout(() => {
            this.elements.quantityInput.focus().select();
        }, 300);

        // Som de abertura
        this.playSound('modal-open');

        console.log('[CraftingSystem] Modal aberto para:', recipe.label);
    }

    /**
     * Fechar modal
     */
    closeModal() {
        if (this.state.isCrafting) {
            this.showConfirmCancelDialog();
            return;
        }

        this.state.isModalOpen = false;
        this.state.currentRecipe = null;
        
        // Esconder modais
        this.elements.craftModal.removeClass('show');
        this.elements.progressModal.removeClass('show');
        $('body').removeClass('modal-open');
        
        // Reset do estado
        this.resetCraftingState();

        console.log('[CraftingSystem] Modal fechado');
    }

    /**
     * Preencher dados do modal
     */
    populateModal() {
        const recipe = this.state.currentRecipe;
        
        // Informações básicas
        this.elements.recipeName.text(recipe.label);
        this.elements.recipeDescription.text(recipe.description);
        
        // Ícone (com fallback)
        const iconPath = `assets/illustrations/${recipe.icon || 'default'}.png`;
        this.elements.recipeIcon.attr('src', iconPath)
            .on('error', function() {
                $(this).attr('src', 'assets/illustrations/default.png');
            });

        // Lista de ingredientes
        this.renderIngredientsList();
        
        // Tempos
        this.elements.craftTime.text(formatTime(recipe.worktime));
        
        // Quantidade inicial
        this.setQuantity(1);
        
        // Verificar se pode craftar
        this.updateCraftButton();
    }

    /**
     * Renderizar lista de ingredientes
     */
    renderIngredientsList() {
        const recipe = this.state.currentRecipe;
        const quantity = this.state.selectedQuantity;
        
        const ingredientsHTML = recipe.need.map(([item, baseAmount]) => {
            const requiredAmount = baseAmount * quantity;
            const availableAmount = window.murphyCraft?.getPlayerItemAmount(item) || 0;
            const hasEnough = availableAmount >= requiredAmount;
            
            return `
                <div class="ingredient-item ${hasEnough ? 'available' : 'missing'}">
                    <div class="ingredient-info">
                        <span class="ingredient-name">${item}</span>
                        <div class="ingredient-amounts">
                            <span class="required">${requiredAmount}x necessário</span>
                            <span class="available ${hasEnough ? 'enough' : 'not-enough'}">
                                ${availableAmount}x disponível
                            </span>
                        </div>
                    </div>
                    <div class="ingredient-status">
                        ${hasEnough ? '✓' : '✗'}
                    </div>
                </div>
            `;
        }).join('');

        this.elements.ingredientsList.html(ingredientsHTML);
    }

    /**
     * Calcular quantidade máxima possível
     */
    calculateMaxQuantity() {
        const recipe = this.state.currentRecipe;
        let maxQty = Infinity;
        
        recipe.need.forEach(([item, amount]) => {
            const available = window.murphyCraft?.getPlayerItemAmount(item) || 0;
            const possibleQty = Math.floor(available / amount);
            maxQty = Math.min(maxQty, possibleQty);
        });
        
        this.state.maxQuantity = Math.max(1, maxQty === Infinity ? 1 : maxQty);
        
        // Atualizar UI
        this.elements.quantityInput.attr('max', this.state.maxQuantity);
        this.elements.maxQuantityInfo.text(`Máximo: ${this.state.maxQuantity}`);
        
        // Ajustar quantidade atual se necessário
        if (this.state.selectedQuantity > this.state.maxQuantity) {
            this.setQuantity(this.state.maxQuantity);
        }
    }

    /**
     * Controles de quantidade
     */
    setQuantity(quantity) {
        const newQty = Math.max(1, Math.min(quantity, this.state.maxQuantity));
        
        if (newQty !== this.state.selectedQuantity) {
            this.state.selectedQuantity = newQty;
            
            // Atualizar UI
            this.elements.quantityInput.val(newQty);
            
            // Recalcular ingredientes e tempos
            this.renderIngredientsList();
            this.updateTotalTime();
            this.updateCraftButton();
            
            // Efeito visual
            this.elements.quantityInput.pulse();
        }
    }

    increaseQuantity() {
        this.setQuantity(this.state.selectedQuantity + 1);
    }

    decreaseQuantity() {
        this.setQuantity(this.state.selectedQuantity - 1);
    }

    /**
     * Atualizar tempo total
     */
    updateTotalTime() {
        const totalTime = this.state.currentRecipe.worktime * this.state.selectedQuantity;
        this.elements.totalTime.text(formatTime(totalTime));
    }

    /**
     * Atualizar botão de craft
     */
    updateCraftButton() {
        const canCraft = this.canStartCrafting();
        
        this.elements.startCraftBtn
            .prop('disabled', !canCraft)
            .toggleClass('enabled', canCraft)
            .toggleClass('disabled', !canCraft);
        
        if (canCraft) {
            this.elements.startCraftBtn.find('.btn-text').text('Criar Item');
        } else {
            this.elements.startCraftBtn.find('.btn-text').text('Materiais Insuficientes');
        }
    }

    /**
     * Verificar se pode iniciar crafting
     */
    canStartCrafting() {
        if (!this.state.currentRecipe || this.state.isCrafting) {
            return false;
        }

        const recipe = this.state.currentRecipe;
        const quantity = this.state.selectedQuantity;
        
        return recipe.need.every(([item, amount]) => {
            const required = amount * quantity;
            const available = window.murphyCraft?.getPlayerItemAmount(item) || 0;
            return available >= required;
        });
    }

    /**
     * Iniciar crafting
     */
    startCrafting() {
        if (!this.canStartCrafting()) {
            this.showNotification('Materiais insuficientes!', 'error');
            return;
        }

        this.state.isCrafting = true;
        
        // Esconder modal principal e mostrar progresso
        this.elements.craftModal.removeClass('show');
        this.elements.progressModal.addClass('show');
        
        // Resetar progresso
        this.state.craftProgress = 0;
        this.state.craftTimeRemaining = this.state.currentRecipe.worktime * this.state.selectedQuantity;
        
        // Iniciar animações
        this.startCraftingAnimation();
        
        // Enviar para backend
        this.sendCraftRequest();
        
        // Iniciar progress timer
        this.startProgressTimer();

        console.log('[CraftingSystem] Crafting iniciado:', {
            recipe: this.state.currentRecipe.label,
            quantity: this.state.selectedQuantity,
            totalTime: this.state.craftTimeRemaining
        });
    }

    /**
     * Enviar requisição de craft para backend
     */
    sendCraftRequest() {
        const data = {
            recipe: this.state.currentRecipe,
            quantity: this.state.selectedQuantity,
            workbenchType: window.murphyCraft?.data.workbenchType,
            workbenchId: window.murphyCraft?.data.workbenchId
        };

        fetch('https://murphy_craft/startCrafting', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }).catch(err => {
            console.error('[CraftingSystem] Erro ao enviar craft request:', err);
            this.onCraftingFailed({ reason: 'Erro de comunicação com servidor' });
        });
    }

    /**
     * Iniciar timer de progresso
     */
    startProgressTimer() {
        const totalTime = this.state.craftTimeRemaining;
        const updateInterval = 100; // 100ms updates para suavidade
        
        this.progressInterval = setInterval(() => {
            this.state.craftProgress += (updateInterval / (totalTime * 1000)) * 100;
            this.state.craftTimeRemaining -= updateInterval / 1000;
            
            // Limitar progresso
            if (this.state.craftProgress >= 100) {
                this.state.craftProgress = 100;
                this.state.craftTimeRemaining = 0;
            }
            
            // Atualizar UI
            this.updateProgressUI();
            
            // Verificar se terminou
            if (this.state.craftProgress >= 100) {
                this.clearProgressTimer();
                // Aguardar confirmação do backend
            }
            
        }, updateInterval);
    }

    /**
     * Atualizar UI de progresso
     */
    updateProgressUI() {
        // Barra de progresso
        this.elements.progressFill.css('width', `${this.state.craftProgress}%`);
        
        // Tempo restante
        this.elements.progressTime.text(`${Math.ceil(this.state.craftTimeRemaining)}s restantes`);
        
        // Texto do estágio
        const currentStage = this.getCurrentProgressStage();
        this.elements.progressText.text(currentStage.text);
    }

    /**
     * Obter estágio atual do progresso
     */
    getCurrentProgressStage() {
        for (let i = this.progressStages.length - 1; i >= 0; i--) {
            if (this.state.craftProgress >= this.progressStages[i].percent) {
                return this.progressStages[i];
            }
        }
        return this.progressStages[0];
    }

    /**
     * Iniciar animação de crafting
     */
    startCraftingAnimation() {
        // Animação do martelo
        this.elements.hammerAnimation.addClass('hammering');
        
        // Faíscas aleatórias
        this.startSparkAnimation();
    }

    /**
     * Animação de faíscas
     */
    startSparkAnimation() {
        const sparkInterval = setInterval(() => {
            if (!this.state.isCrafting) {
                clearInterval(sparkInterval);
                return;
            }
            
            // Criar faísca temporária
            const spark = $('<div class="spark">✨</div>');
            this.elements.sparks.append(spark);
            
            // Animar faísca
            spark.css({
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%',
                transform: `scale(${0.5 + Math.random() * 0.5})`
            });
            
            // Remover após animação
            setTimeout(() => spark.remove(), 1000);
            
        }, 300 + Math.random() * 700);
    }

    /**
     * Cancelar crafting
     */
    cancelCrafting() {
        if (!this.state.isCrafting) return;
        
        this.showConfirmCancelDialog();
    }

    /**
     * Mostrar diálogo de confirmação de cancelamento
     */
    showConfirmCancelDialog() {
        const confirmed = confirm('Tem certeza que deseja cancelar o crafting? O progresso será perdido.');
        
        if (confirmed) {
            this.forceCancelCrafting();
        }
    }

    /**
     * Forçar cancelamento
     */
    forceCancelCrafting() {
        // Notificar backend
        fetch('https://murphy_craft/cancelCrafting', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                recipe: this.state.currentRecipe?.label
            })
        }).catch(err => {
            console.error('[CraftingSystem] Erro ao cancelar craft:', err);
        });
        
        this.onCraftingCancelled();
    }

    /**
     * Limpar timer de progresso
     */
    clearProgressTimer() {
        if (this.progressInterval) {
            clearInterval(this.progressInterval);
            this.progressInterval = null;
        }
        
        if (this.countdownInterval) {
            clearInterval(this.countdownInterval);
            this.countdownInterval = null;
        }
    }

    /**
     * Reset do estado de crafting
     */
    resetCraftingState() {
        this.state.isCrafting = false;
        this.state.craftProgress = 0;
        this.state.craftTimeRemaining = 0;
        this.state.selectedQuantity = 1;
        
        this.clearProgressTimer();
        
        // Parar animações
        this.elements.hammerAnimation.removeClass('hammering');
        this.elements.sparks.empty();
        
        // Reset UI
        this.elements.progressFill.css('width', '0%');
        this.elements.progressText.text('Preparando...');
        this.elements.progressTime.text('');
    }

    /**
     * Eventos do backend
     */
    onCraftingStarted(data) {
        console.log('[CraftingSystem] Crafting confirmado pelo servidor:', data);
        
        // Atualizar tempo baseado no servidor se diferente
        if (data.duration && data.duration !== this.state.craftTimeRemaining) {
            this.state.craftTimeRemaining = data.duration;
        }
    }

    onCraftingFinished(data) {
        console.log('[CraftingSystem] Crafting finalizado:', data);
        
        // Completar progresso
        this.state.craftProgress = 100;
        this.updateProgressUI();
        
        // Mostrar sucesso
        setTimeout(() => {
            this.showNotification(`${data.item || 'Item'} criado com sucesso!`, 'success');
            this.closeModal();
            
            // Atualizar inventário
            if (window.murphyCraft) {
                window.murphyCraft.requestPlayerInventory();
            }
        }, 1500);
        
        // Som de sucesso
        this.playSound('craft-success');
    }

    onCraftingFailed(data) {
        console.error('[CraftingSystem] Crafting falhou:', data);
        
        this.showNotification(data.reason || 'Falha ao criar item!', 'error');
        this.closeModal();
        
        // Som de erro
        this.playSound('craft-failed');
    }

    onCraftingCancelled(data) {
        console.log('[CraftingSystem] Crafting cancelado:', data);
        
        this.showNotification('Crafting cancelado', 'warning');
        this.closeModal();
    }

    /**
     * Validar receita
     */
    validateRecipe(recipe) {
        if (!recipe) return false;
        
        const required = ['label', 'description', 'need', 'craft', 'worktime'];
        
        for (const field of required) {
            if (!recipe.hasOwnProperty(field)) {
                console.warn(`[CraftingSystem] Recipe missing field: ${field}`, recipe);
                return false;
            }
        }
        
        if (!Array.isArray(recipe.need) || !Array.isArray(recipe.craft)) {
            console.warn('[CraftingSystem] Recipe need/craft must be arrays', recipe);
            return false;
        }
        
        return true;
    }

    /**
     * Sistema de notificações
     */
    showNotification(message, type = 'info') {
        if (window.murphyCraft) {
            window.murphyCraft.showNotification({ text: message, type });
        } else {
            // Fallback notification
            console.log(`[CraftingSystem] ${type.toUpperCase()}: ${message}`);
        }
    }

    /**
     * Sistema de áudio
     */
    playSound(soundName) {
        if (window.murphyCraft) {
            window.murphyCraft.playSound(soundName);
        }
    }
}

/**
 * Sistema de Tooltips para Crafting
 */
class CraftingTooltips {
    constructor() {
        this.tooltip = null;
        this.init();
    }

    init() {
        this.createTooltip();
        this.setupEventListeners();
    }

    createTooltip() {
        this.tooltip = $(`
            <div id="crafting-tooltip" class="crafting-tooltip">
                <div class="tooltip-content">
                    <div class="tooltip-header">
                        <img class="tooltip-icon" src="" alt="">
                        <h4 class="tooltip-title"></h4>
                    </div>
                    <div class="tooltip-body">
                        <p class="tooltip-description"></p>
                        <div class="tooltip-stats"></div>
                    </div>
                </div>
                <div class="tooltip-arrow"></div>
            </div>
        `);

        $('body').append(this.tooltip);
    }

    setupEventListeners() {
        // Mostrar tooltip em receitas
        $(document).on('mouseenter', '.recipe-card', (e) => {
            const $card = $(e.currentTarget);
            const recipeId = $card.data('recipe-id');
            
            if (recipeId) {
                const recipe = window.murphyCraft?.findRecipeByLabel(recipeId);
                if (recipe) {
                    this.showRecipeTooltip(recipe, e);
                }
            }
        });

        $(document).on('mouseleave', '.recipe-card', () => {
            this.hideTooltip();
        });

        // Mostrar tooltip em ingredientes
        $(document).on('mouseenter', '.ingredient-item', (e) => {
            const $item = $(e.currentTarget);
            const itemName = $item.find('.ingredient-name').text();
            
            if (itemName) {
                this.showIngredientTooltip(itemName, e);
            }
        });

        $(document).on('mouseleave', '.ingredient-item', () => {
            this.hideTooltip();
        });

        // Seguir mouse
        $(document).on('mousemove', (e) => {
            if (this.tooltip.is(':visible')) {
                this.positionTooltip(e);
            }
        });
    }

    showRecipeTooltip(recipe, event) {
        const iconSrc = `assets/illustrations/${recipe.icon || 'default'}.png`;
        
        this.tooltip.find('.tooltip-icon').attr('src', iconSrc);
        this.tooltip.find('.tooltip-title').text(recipe.label);
        this.tooltip.find('.tooltip-description').text(recipe.description);
        
        // Stats da receita
        const stats = `
            <div class="stat-row">
                <span class="stat-label">Tempo:</span>
                <span class="stat-value">${formatTime(recipe.worktime)}</span>
            </div>
            <div class="stat-row">
                <span class="stat-label">Materiais:</span>
                <span class="stat-value">${recipe.need.length} tipos</span>
            </div>
            <div class="stat-row">
                <span class="stat-label">Resultado:</span>
                <span class="stat-value">${recipe.craft.map(([item, amt]) => `${amt}x ${item}`).join(', ')}</span>
            </div>
        `;
        
        this.tooltip.find('.tooltip-stats').html(stats);
        this.positionTooltip(event);
        this.tooltip.addClass('show');
    }

    showIngredientTooltip(itemName, event) {
        // Informações básicas do item
        this.tooltip.find('.tooltip-icon').attr('src', `assets/illustrations/items/${itemName}.png`);
        this.tooltip.find('.tooltip-title').text(itemName);
        this.tooltip.find('.tooltip-description').text(this.getItemDescription(itemName));
        
        // Stats do item
        const playerAmount = window.murphyCraft?.getPlayerItemAmount(itemName) || 0;
        const stats = `
            <div class="stat-row">
                <span class="stat-label">Disponível:</span>
                <span class="stat-value">${playerAmount}x</span>
            </div>
        `;
        
        this.tooltip.find('.tooltip-stats').html(stats);
        this.positionTooltip(event);
        this.tooltip.addClass('show');
    }

    positionTooltip(event) {
        const mouseX = event.clientX;
        const mouseY = event.clientY;
        const tooltipWidth = this.tooltip.outerWidth();
        const tooltipHeight = this.tooltip.outerHeight();
        const windowWidth = $(window).width();
        const windowHeight = $(window).height();
        
        let left = mouseX + 15;
        let top = mouseY - tooltipHeight / 2;
        
        // Ajustar se sair da tela
        if (left + tooltipWidth > windowWidth) {
            left = mouseX - tooltipWidth - 15;
        }
        
        if (top < 0) {
            top = 10;
        } else if (top + tooltipHeight > windowHeight) {
            top = windowHeight - tooltipHeight - 10;
        }
        
        this.tooltip.css({ left, top });
    }

    hideTooltip() {
        this.tooltip.removeClass('show');
    }

    getItemDescription(itemName) {
        // Descrições básicas dos itens
        const descriptions = {
            'wood': 'Madeira resistente para construção',
            'iron': 'Metal versátil para ferramentas',
            'copper': 'Metal maleável para detalhes',
            'nails': 'Pregos para fixação',
            'cloth': 'Tecido para revestimento',
            'leather': 'Couro durável para acabamento'
        };
        
        return descriptions[itemName.toLowerCase()] || 'Material para crafting';
    }
}

/**
 * Sistema de Atalhos de Teclado para Crafting
 */
class CraftingKeyboard {
    constructor(craftingSystem) {
        this.craftingSystem = craftingSystem;
        this.setupKeyboardShortcuts();
    }

    setupKeyboardShortcuts() {
        $(document).on('keydown', (e) => {
            // Apenas quando modal estiver aberto
            if (!this.craftingSystem.state.isModalOpen) return;
            
            // Ctrl/Cmd + Enter = Craft máximo
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                this.craftingSystem.setQuantity(this.craftingSystem.state.maxQuantity);
                if (this.craftingSystem.canStartCrafting()) {
                    this.craftingSystem.startCrafting();
                }
            }
            
            // Ctrl/Cmd + A = Selecionar quantidade máxima
            if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
                e.preventDefault();
                this.craftingSystem.setQuantity(this.craftingSystem.state.maxQuantity);
            }
            
            // Page Up/Down = +10/-10 quantidade
            if (e.key === 'PageUp') {
                e.preventDefault();
                this.craftingSystem.setQuantity(this.craftingSystem.state.selectedQuantity + 10);
            }
            
            if (e.key === 'PageDown') {
                e.preventDefault();
                this.craftingSystem.setQuantity(this.craftingSystem.state.selectedQuantity - 10);
            }
        });
    }
}

/**
 * Sistema de Cache de Receitas
 */
class RecipeCache {
    constructor() {
        this.cache = new Map();
        this.maxSize = 100;
        this.ttl = 5 * 60 * 1000; // 5 minutos
    }

    set(key, value) {
        // Remover entradas antigas se cache estiver cheio
        if (this.cache.size >= this.maxSize) {
            const firstKey = this.cache.keys().next().value;
            this.cache.delete(firstKey);
        }

        this.cache.set(key, {
            value,
            timestamp: Date.now()
        });
    }

    get(key) {
        const entry = this.cache.get(key);
        
        if (!entry) return null;
        
        // Verificar TTL
        if (Date.now() - entry.timestamp > this.ttl) {
            this.cache.delete(key);
            return null;
        }
        
        return entry.value;
    }

    clear() {
        this.cache.clear();
    }

    cleanup() {
        const now = Date.now();
        
        for (const [key, entry] of this.cache.entries()) {
            if (now - entry.timestamp > this.ttl) {
                this.cache.delete(key);
            }
        }
    }
}

/**
 * Sistema de Estatísticas de Crafting
 */
class CraftingStats {
    constructor() {
        this.stats = this.loadStats();
    }

    loadStats() {
        try {
            return JSON.parse(localStorage.getItem('murphy_craft_stats') || '{}');
        } catch {
            return {};
        }
    }

    saveStats() {
        localStorage.setItem('murphy_craft_stats', JSON.stringify(this.stats));
    }

    recordCraft(recipe, quantity = 1) {
        const key = recipe.label;
        
        if (!this.stats[key]) {
            this.stats[key] = {
                name: recipe.label,
                totalCrafted: 0,
                timesUsed: 0,
                totalTimeSpent: 0,
                firstCrafted: Date.now(),
                lastCrafted: Date.now()
            };
        }
        
        this.stats[key].totalCrafted += quantity;
        this.stats[key].timesUsed += 1;
        this.stats[key].totalTimeSpent += recipe.worktime * quantity;
        this.stats[key].lastCrafted = Date.now();
        
        this.saveStats();
    }

    getMostCrafted(limit = 5) {
        return Object.values(this.stats)
            .sort((a, b) => b.totalCrafted - a.totalCrafted)
            .slice(0, limit);
    }

    getTotalCrafted() {
        return Object.values(this.stats)
            .reduce((total, stat) => total + stat.totalCrafted, 0);
    }

    getTotalTimeSpent() {
        return Object.values(this.stats)
            .reduce((total, stat) => total + stat.totalTimeSpent, 0);
    }

    getStats() {
        return {
            totalItems: this.getTotalCrafted(),
            totalTime: this.getTotalTimeSpent(),
            totalRecipes: Object.keys(this.stats).length,
            mostCrafted: this.getMostCrafted(),
            allStats: this.stats
        };
    }
}

/**
 * Inicialização quando documento estiver pronto
 */
$(document).ready(() => {
    // Criar instância global do sistema de crafting
    window.craftingSystem = new CraftingSystem();
    
    // Sistemas auxiliares
    window.craftingTooltips = new CraftingTooltips();
    window.craftingKeyboard = new CraftingKeyboard(window.craftingSystem);
    window.recipeCache = new RecipeCache();
    window.craftingStats = new CraftingStats();
    
    // Cleanup periódico do cache
    setInterval(() => {
        window.recipeCache.cleanup();
    }, 60000); // Cada minuto
    
    console.log('[CraftingSystem] Todos os sistemas de crafting inicializados');
});

// Exportar classes para uso global
if (typeof window !== 'undefined') {
    window.CraftingSystem = CraftingSystem;
    window.CraftingTooltips = CraftingTooltips;
    window.CraftingKeyboard = CraftingKeyboard;
    window.RecipeCache = RecipeCache;
    window.CraftingStats = CraftingStats;
}