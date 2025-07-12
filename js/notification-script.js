// Notificação para itens adicionados ao carrinho
function showCartNotification(item) {
    const notificationContainer = document.getElementById('notificationContainer');
    
    // Criar elemento de notificação
    const notification = document.createElement('div');
    notification.className = 'notification notification-cart';
    
    // Conteúdo da notificação
    notification.innerHTML = `
        <div class="notification-icon">
            <i class="fas fa-shopping-cart"></i>
        </div>
        <div class="notification-content">
            <h3 class="notification-title">Item adicionado ao carrinho</h3>
            <p class="notification-message">O item foi adicionado com sucesso!</p>
            <div class="notification-item-details">
                <div class="notification-item-thumb">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="notification-item-info">
                    <p class="notification-item-name">${item.name}</p>
                    <p class="notification-item-price">${item.price}</p>
                </div>
            </div>
        </div>
        <button class="notification-close" aria-label="Fechar notificação">
            <i class="fas fa-times"></i>
        </button>
        <div class="notification-progress"></div>
    `;
    
    // Adicionar ao container
    notificationContainer.appendChild(notification);
    
    // Animar entrada
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Configurar botão fechar
    const closeButton = notification.querySelector('.notification-close');
    closeButton.addEventListener('click', () => {
        closeNotification(notification);
    });
    
    // Auto-fechar após 4 segundos
    setTimeout(() => {
        closeNotification(notification);
    }, 4000);
}

// Função para fechar notificação
function closeNotification(notification) {
    notification.classList.remove('show');
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

// Adicionar evento de clique aos botões de adicionar ao carrinho
document.addEventListener('DOMContentLoaded', () => {
    const addToCartButtons = document.querySelectorAll('.menu-item .btn-secondary');
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const menuItem = this.closest('.menu-item');
            const itemName = menuItem.querySelector('.menu-item-title h3').textContent;
            const itemPrice = menuItem.querySelector('.menu-item-price').textContent;
            const itemImage = menuItem.querySelector('.menu-item-img img').src;
            
            // Objeto com informações do item
            const item = {
                name: itemName,
                price: itemPrice,
                image: itemImage
            };
            
            // Mostrar notificação
            showCartNotification(item);
            
            // Adicionar classe para efeito visual
            button.classList.add('added');
            button.innerHTML = '<i class="fas fa-check"></i> Adicionado';
            
            // Reverter após 2 segundos
            setTimeout(() => {
                button.classList.remove('added');
                button.innerHTML = '<i class="fas fa-shopping-cart"></i> Adicionar';
            }, 2000);
        });
    });
});
