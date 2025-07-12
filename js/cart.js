// Carrinho de Compras - Funcionalidades
document.addEventListener('DOMContentLoaded', function() {
    // Elementos do DOM
    const cartToggle = document.getElementById('cartToggle');
    const cartContainer = document.getElementById('cartContainer');
    const cartOverlay = document.getElementById('cartOverlay');
    const cartClose = document.getElementById('cartClose');
    const cartItemsList = document.getElementById('cartItems');
    const cartEmptyView = document.getElementById('cartEmpty');
    const cartSubtotalPrice = document.getElementById('cartSubtotalPrice');
    const cartItemCount = document.getElementById('cartItemCount');
    const checkoutBtn = document.getElementById('checkoutBtn');
    
    // Estado do carrinho
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Inicializar
    updateCartUI();
    
    // Toggle do carrinho
    cartToggle.addEventListener('click', function() {
        cartContainer.classList.add('active');
        cartOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
    
    // Fechar carrinho
    function closeCart() {
        cartContainer.classList.remove('active');
        cartOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    cartClose.addEventListener('click', closeCart);
    cartOverlay.addEventListener('click', closeCart);
    
    // Fechar carrinho com Esc
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeCart();
        }
    });
    
    // Adicionar item ao carrinho
    window.addToCart = function(itemData) {
        const existingItemIndex = cart.findIndex(item => item.id === itemData.id);
        
        if (existingItemIndex > -1) {
            // Item já existe no carrinho, aumenta quantidade
            cart[existingItemIndex].quantity += 1;
        } else {
            // Novo item
            cart.push({
                ...itemData,
                quantity: 1
            });
        }
        
        // Salvar e atualizar UI
        saveCart();
        updateCartUI();
        
        // Mostrar notificação
        if (window.showCartNotification) {
            showCartNotification(itemData);
        }
    };
    
    // Remover item do carrinho
    window.removeFromCart = function(itemId) {
        cart = cart.filter(item => item.id !== itemId);
        saveCart();
        updateCartUI();
    };
    
    // Atualizar quantidade de um item
    window.updateItemQuantity = function(itemId, newQuantity) {
        const itemIndex = cart.findIndex(item => item.id === itemId);
        
        if (itemIndex > -1) {
            if (newQuantity > 0) {
                cart[itemIndex].quantity = newQuantity;
            } else {
                // Se a quantidade for 0 ou negativa, remove o item
                cart.splice(itemIndex, 1);
            }
            
            saveCart();
            updateCartUI();
        }
    };
    
    // Salvar carrinho no localStorage
    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }
    
    // Atualizar interface do carrinho
    function updateCartUI() {
        // Atualizar contador de itens no ícone do carrinho
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartItemCount.textContent = totalItems;
        cartToggle.setAttribute('data-count', totalItems);
        
        // Calcular subtotal
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        // Formatar para Real brasileiro
        const formatter = new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
        
        cartSubtotalPrice.textContent = formatter.format(subtotal);
        
        // Renderizar itens ou mostrar mensagem de vazio
        if (cart.length === 0) {
            cartEmptyView.style.display = 'flex';
            cartItemsList.innerHTML = '';
            checkoutBtn.disabled = true;
        } else {
            cartEmptyView.style.display = 'none';
            renderCartItems();
            checkoutBtn.disabled = false;
        }
    }
    
    // Renderizar itens do carrinho
    function renderCartItems() {
        cartItemsList.innerHTML = '';
        
        cart.forEach(item => {
            const cartItem = document.createElement('li');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="cart-item-img">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-content">
                    <h4 class="cart-item-name">${item.name}</h4>
                    <p class="cart-item-price">${formatPrice(item.price)}</p>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn minus-btn" onclick="updateItemQuantity('${item.id}', ${item.quantity - 1})">
                            <i class="fas fa-minus"></i>
                        </button>
                        <input type="text" class="quantity-input" value="${item.quantity}" 
                            onchange="updateItemQuantity('${item.id}', parseInt(this.value) || 1)">
                        <button class="quantity-btn plus-btn" onclick="updateItemQuantity('${item.id}', ${item.quantity + 1})">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                </div>
                <button class="cart-item-remove" onclick="removeFromCart('${item.id}')">
                    <i class="fas fa-times"></i>
                </button>
            `;
            
            cartItemsList.appendChild(cartItem);
        });
    }
    
    // Formatar preço para Real brasileiro
    function formatPrice(price) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(price);
    }
    
    // Checkout
    checkoutBtn.addEventListener('click', function() {
        alert('Função de finalizar compra será implementada em breve!');
        // Aqui você pode implementar a lógica para finalizar a compra
    });
    
    // Vincular aos botões de "Adicionar" nos itens do menu
    document.querySelectorAll('.menu-item .btn-secondary').forEach(button => {
        button.addEventListener('click', function() {
            const menuItem = this.closest('.menu-item');
            const itemId = menuItem.getAttribute('data-id') || Date.now().toString();
            const itemName = menuItem.querySelector('.menu-item-title h3').textContent;
            const itemPrice = parseFloat(menuItem.querySelector('.menu-item-price').textContent.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
            const itemImage = menuItem.querySelector('.menu-item-img img').src;
            
            // Objeto com informações do item
            const item = {
                id: itemId,
                name: itemName,
                price: itemPrice,
                image: itemImage
            };
            
            // Adicionar ao carrinho
            window.addToCart(item);
        });
    });
});
