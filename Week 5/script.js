// script.js - Main application logic

// Application state
let currentFilter = 'all';
let currentSort = 'default';
let searchQuery = '';
let cart = [];
let wishlist = [];

// DOM elements
let productsGrid, filterButtons, searchInput, sortSelect;
let cartSidebar, cartOverlay, cartCount, cartItems, cartTotal, cartSubtotal;
let modal, toast, backToTop, noResults, loadingSpinner;
let hamburgerMenu, mobileNav;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeElements();
    loadStoredData();
    setupEventListeners();
    renderProducts();
    updateCartUI();
    
    // Add initial animation delay for product cards
    setTimeout(animateProductCards, 300);
});

// Initialize DOM elements
function initializeElements() {
    productsGrid = document.getElementById('productsGrid');
    filterButtons = document.querySelectorAll('.filter-btn');
    searchInput = document.getElementById('searchInput');
    sortSelect = document.getElementById('sortSelect');
    cartSidebar = document.getElementById('cartSidebar');
    cartOverlay = document.getElementById('cartOverlay');
    cartCount = document.getElementById('cartCount');
    cartItems = document.getElementById('cartItems');
    cartTotal = document.getElementById('cartTotal');
    cartSubtotal = document.getElementById('cartSubtotal');
    modal = document.getElementById('productModal');
    toast = document.getElementById('toast');
    backToTop = document.getElementById('backToTop');
    noResults = document.getElementById('noResults');
    loadingSpinner = document.getElementById('loadingSpinner');
    hamburgerMenu = document.getElementById('hamburgerMenu');
    mobileNav = document.getElementById('mobileNav');
}

// Load data from localStorage
function loadStoredData() {
    try {
        const storedCart = JSON.parse(localStorage.getItem('shopSmart_cart')) || [];
        const storedWishlist = JSON.parse(localStorage.getItem('shopSmart_wishlist')) || [];
        cart = storedCart;
        wishlist = storedWishlist;
    } catch (error) {
        console.error('Error loading stored data:', error);
        cart = [];
        wishlist = [];
    }
}

// Save data to localStorage
function saveData() {
    try {
        localStorage.setItem('shopSmart_cart', JSON.stringify(cart));
        localStorage.setItem('shopSmart_wishlist', JSON.stringify(wishlist));
    } catch (error) {
        console.error('Error saving data:', error);
    }
}

// Setup event listeners
function setupEventListeners() {
    // Filter buttons
    filterButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            currentFilter = e.target.dataset.filter;
            updateFilterButtons();
            renderProducts();
        });
    });

    // Search functionality
    const debouncedSearch = debounce(() => {
        searchQuery = searchInput.value.toLowerCase().trim();
        renderProducts();
    }, 300);

    searchInput.addEventListener('input', debouncedSearch);
    
    document.getElementById('searchBtn').addEventListener('click', () => {
        searchQuery = searchInput.value.toLowerCase().trim();
        renderProducts();
    });

    // Sort functionality
    sortSelect.addEventListener('change', (e) => {
        currentSort = e.target.value;
        renderProducts();
    });

    // Modal functionality
    document.getElementById('closeModal').addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // Cart functionality
    document.getElementById('cartIcon').addEventListener('click', openCart);
    document.getElementById('closeCart').addEventListener('click', closeCart);
    document.getElementById('continueShoppingBtn').addEventListener('click', closeCart);
    cartOverlay.addEventListener('click', closeCart);

    // Checkout functionality
    document.getElementById('checkoutBtn').addEventListener('click', handleCheckout);

    // Mobile navigation
    hamburgerMenu.addEventListener('click', toggleMobileNav);
    
    // Close mobile nav when clicking on links
    document.querySelectorAll('.mobile-nav-link').forEach(link => {
        link.addEventListener('click', closeMobileNav);
    });

    // Navigation links - FIXED: About and Contact now scroll to footer
    document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = link.getAttribute('href').substring(1); // Remove # from href
            
            if (target === 'about' || target === 'contact') {
                // Scroll to footer for About and Contact links
                const footer = document.querySelector('.footer');
                if (footer) {
                    footer.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            } else {
                // Normal behavior for Home and Products
                const targetElement = document.getElementById(target);
                if (targetElement) {
                    targetElement.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
            
            closeMobileNav();
        });
    });

    // Back to top button
    window.addEventListener('scroll', handleScroll);
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
            closeCart();
            closeMobileNav();
        }
    });
}

// Render products based on current filters
function renderProducts() {
    if (!productsGrid) return;

    // Show loading spinner
    loadingSpinner.style.display = 'block';
    productsGrid.innerHTML = '';
    noResults.style.display = 'none';

    // Simulate loading delay for better UX
    setTimeout(() => {
        let filteredProducts = getProductsByCategory(currentFilter);

        // Apply search filter
        if (searchQuery) {
            filteredProducts = searchProducts(searchQuery);
        }

        // Apply sorting
        filteredProducts = sortProducts(filteredProducts, currentSort);

        // Hide loading spinner
        loadingSpinner.style.display = 'none';

        // Show/hide no results message
        if (filteredProducts.length === 0) {
            noResults.style.display = 'block';
            return;
        }

        // Render products
        filteredProducts.forEach((product, index) => {
            const productCard = createProductCard(product);
            productCard.style.animationDelay = `${index * 0.1}s`;
            productsGrid.appendChild(productCard);
        });

        // Re-animate cards
        animateProductCards();
    }, 500);
}

// Create product card element
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    
    const isInWishlist = wishlist.find(item => item.id === product.id);
    const heartIcon = isInWishlist ? 'fas fa-heart' : 'far fa-heart';
    const heartColor = isInWishlist ? 'style="color: #e74c3c;"' : '';

    card.innerHTML = `
        <div class="product-image">
            <img src="${product.image}" alt="${product.title}" loading="lazy">
            <div class="product-badges">
                ${product.isNew ? '<span class="badge new-badge">New</span>' : ''}
                ${product.onSale ? '<span class="badge sale-badge">Sale</span>' : ''}
            </div>
            <div class="product-overlay">
                <button class="view-btn" onclick="openProductModal(${product.id})">
                    <i class="fas fa-eye"></i> Quick View
                </button>
            </div>
        </div>
        <div class="product-info">
            <h3 class="product-title">${product.title}</h3>
            <div class="product-rating">
                <div class="stars">${generateStars(product.rating)}</div>
                <span class="rating-count">(${product.reviews})</span>
            </div>
            <p class="product-price">${formatPrice(product.price)}</p>
            <p class="product-description">${product.description}</p>
            <div class="product-actions">
                <button class="btn btn-primary" onclick="addToCart(${product.id}, 1)">
                    <i class="fas fa-shopping-cart"></i> Add to Cart
                </button>
                <button class="btn btn-secondary" onclick="toggleWishlist(${product.id})" ${heartColor}>
                    <i class="${heartIcon}"></i>
                </button>
            </div>
        </div>
    `;

    return card;
}

// Update filter buttons active state
function updateFilterButtons() {
    filterButtons.forEach(button => {
        button.classList.remove('active');
        if (button.dataset.filter === currentFilter) {
            button.classList.add('active');
        }
    });
}

// Animate product cards
function animateProductCards() {
    const cards = document.querySelectorAll('.product-card');
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// Open product modal
function openProductModal(productId) {
    const product = getProductById(productId);
    if (!product) return;

    // Populate modal content
    document.getElementById('modalImage').src = product.image;
    document.getElementById('modalTitle').textContent = product.title;
    document.getElementById('modalPrice').textContent = formatPrice(product.price);
    document.getElementById('modalDescription').textContent = product.description;
    document.getElementById('modalStars').innerHTML = generateStars(product.rating);
    document.getElementById('modalRatingText').textContent = `${product.rating} (${product.reviews} reviews)`;

    // Show/hide badges
    const newBadge = document.getElementById('newBadge');
    const saleBadge = document.getElementById('saleBadge');
    newBadge.style.display = product.isNew ? 'block' : 'none';
    saleBadge.style.display = product.onSale ? 'block' : 'none';

    // Populate features
    const featuresList = document.getElementById('modalFeaturesList');
    featuresList.innerHTML = '';
    product.features.forEach(feature => {
        const li = document.createElement('li');
        li.textContent = feature;
        featuresList.appendChild(li);
    });

    // Reset quantity
    document.getElementById('quantity').value = 1;

    // Update wishlist button
    updateWishlistButton(product.id);

    // Setup modal event listeners
    setupModalEventListeners(product);

    // Show modal
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Update wishlist button state
function updateWishlistButton(productId) {
    const wishlistBtn = document.getElementById('wishlistBtn');
    const isInWishlist = wishlist.find(item => item.id === productId);
    
    wishlistBtn.innerHTML = isInWishlist 
        ? '<i class="fas fa-heart"></i> Remove from Wishlist'
        : '<i class="far fa-heart"></i> Add to Wishlist';
    wishlistBtn.style.color = isInWishlist ? '#e74c3c' : '';
}

// Setup modal event listeners
function setupModalEventListeners(product) {
    const decreaseBtn = document.getElementById('decreaseQty');
    const increaseBtn = document.getElementById('increaseQty');
    const quantityInput = document.getElementById('quantity');
    const addToCartBtn = document.getElementById('addToCartBtn');
    const wishlistBtn = document.getElementById('wishlistBtn');

    // Remove existing event listeners
    decreaseBtn.replaceWith(decreaseBtn.cloneNode(true));
    increaseBtn.replaceWith(increaseBtn.cloneNode(true));
    addToCartBtn.replaceWith(addToCartBtn.cloneNode(true));
    wishlistBtn.replaceWith(wishlistBtn.cloneNode(true));

    // Get new references
    const newDecreaseBtn = document.getElementById('decreaseQty');
    const newIncreaseBtn = document.getElementById('increaseQty');
    const newAddToCartBtn = document.getElementById('addToCartBtn');
    const newWishlistBtn = document.getElementById('wishlistBtn');

    // Quantity controls
    newDecreaseBtn.onclick = () => {
        const currentQty = parseInt(quantityInput.value);
        if (currentQty > 1) {
            quantityInput.value = currentQty - 1;
        }
    };

    newIncreaseBtn.onclick = () => {
        const currentQty = parseInt(quantityInput.value);
        if (currentQty < 10) {
            quantityInput.value = currentQty + 1;
        }
    };

    // Add to cart
    newAddToCartBtn.onclick = () => {
        const quantity = parseInt(quantityInput.value);
        addToCart(product.id, quantity);
        closeModal();
    };

    // Wishlist toggle
    newWishlistBtn.onclick = () => {
        toggleWishlist(product.id);
        updateWishlistButton(product.id);
        
        // Update wishlist buttons in product cards
        updateProductCardWishlistButtons(product.id);
    };
}

// Update wishlist buttons in product cards
function updateProductCardWishlistButtons(productId) {
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        const wishlistBtn = card.querySelector('.btn-secondary');
        if (wishlistBtn) {
            const isInWishlist = wishlist.find(item => item.id === productId);
            const icon = wishlistBtn.querySelector('i');
            if (icon) {
                icon.className = isInWishlist ? 'fas fa-heart' : 'far fa-heart';
                wishlistBtn.style.color = isInWishlist ? '#e74c3c' : '';
            }
        }
    });
}

// Close modal
function closeModal() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Add product to cart
function addToCart(productId, quantity = 1) {
    const product = getProductById(productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        // Check stock availability
        if (existingItem.quantity + quantity > product.stock) {
            showToast(`Only ${product.stock} items available in stock!`, 'warning');
            return;
        }
        existingItem.quantity += quantity;
    } else {
        // Check stock availability
        if (quantity > product.stock) {
            showToast(`Only ${product.stock} items available in stock!`, 'warning');
            return;
        }
        cart.push({
            ...product,
            quantity: quantity
        });
    }

    updateCartUI();
    showToast(`${product.title} added to cart!`);
    saveData();
}

// Remove item from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
    saveData();
}

// Update item quantity in cart
function updateCartQuantity(productId, newQuantity) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        const product = getProductById(productId);
        if (newQuantity > product.stock) {
            showToast(`Only ${product.stock} items available in stock!`, 'warning');
            newQuantity = product.stock;
        }
        
        if (newQuantity <= 0) {
            removeFromCart(productId);
        } else {
            item.quantity = newQuantity;
            updateCartUI();
            saveData();
        }
    }
}

// Toggle wishlist
function toggleWishlist(productId) {
    const product = getProductById(productId);
    if (!product) return;

    const existingIndex = wishlist.findIndex(item => item.id === productId);
    
    if (existingIndex > -1) {
        wishlist.splice(existingIndex, 1);
        showToast(`${product.title} removed from wishlist!`);
    } else {
        wishlist.push(product);
        showToast(`${product.title} added to wishlist!`);
    }

    saveData();
}

// Update cart UI
function updateCartUI() {
    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    cartCount.style.display = totalItems > 0 ? 'flex' : 'none';

    // Update cart items
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="text-center" style="padding: 40px; color: #666;">
                <i class="fas fa-shopping-cart" style="font-size: 3rem; margin-bottom: 20px; color: #ddd;"></i>
                <p>Your cart is empty</p>
                <button class="btn btn-primary" onclick="closeCart()" style="margin-top: 20px;">
                    Start Shopping
                </button>
            </div>
        `;
    } else {
        cart.forEach(item => {
            const cartItem = createCartItem(item);
            cartItems.appendChild(cartItem);
        });
    }

    // Update totals
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 0 ? 5.00 : 0;
    const total = subtotal + shipping;

    cartSubtotal.textContent = formatPrice(subtotal);
    document.getElementById('shippingCost').textContent = formatPrice(shipping);
    cartTotal.textContent = formatPrice(total);
}

// Create cart item element
function createCartItem(item) {
    const cartItem = document.createElement('div');
    cartItem.className = 'cart-item';
    
    cartItem.innerHTML = `
        <div class="cart-item-image">
            <img src="${item.image}" alt="${item.title}">
        </div>
        <div class="cart-item-info">
            <div class="cart-item-title">${item.title}</div>
            <div class="cart-item-price">${formatPrice(item.price)}</div>
            <div class="cart-item-quantity">
                <button class="cart-qty-btn" onclick="updateCartQuantity(${item.id}, ${item.quantity - 1})">-</button>
                <input type="number" value="${item.quantity}" min="1" max="10" 
                       class="cart-qty-input" 
                       onchange="updateCartQuantity(${item.id}, parseInt(this.value))">
                <button class="cart-qty-btn" onclick="updateCartQuantity(${item.id}, ${item.quantity + 1})">+</button>
            </div>
        </div>
        <i class="fas fa-times remove-item" onclick="removeFromCart(${item.id})" title="Remove item"></i>
    `;
    
    return cartItem;
}

// Open cart sidebar
function openCart() {
    cartSidebar.classList.add('open');
    cartOverlay.classList.add('show');
    document.body.style.overflow = 'hidden';
}

// Close cart sidebar
function closeCart() {
    cartSidebar.classList.remove('open');
    cartOverlay.classList.remove('show');
    document.body.style.overflow = 'auto';
}

// Toggle mobile navigation
function toggleMobileNav() {
    mobileNav.classList.toggle('active');
    hamburgerMenu.classList.toggle('active');
}

// Close mobile navigation
function closeMobileNav() {
    mobileNav.classList.remove('active');
    hamburgerMenu.classList.remove('active');
}

// Handle checkout
function handleCheckout() {
    if (cart.length === 0) {
        showToast('Your cart is empty!', 'warning');
        return;
    }
    
    // Simulate checkout process
    showToast('Processing your order...', 'success');
    
    setTimeout(() => {
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) + 5.00;
        alert(`Thank you for your purchase!\nTotal: $${total.toFixed(2)}\n\nThis is a demo checkout.`);
        
        // Clear cart after successful checkout
        cart = [];
        updateCartUI();
        closeCart();
        saveData();
    }, 2000);
}

// Show toast notification
function showToast(message, type = 'success') {
    const toastMessage = document.getElementById('toastMessage');
    const toastIcon = toast.querySelector('i');
    
    toastMessage.textContent = message;
    
    // Set icon based on type
    if (type === 'warning') {
        toastIcon.className = 'fas fa-exclamation-triangle';
        toast.style.background = 'linear-gradient(45deg, #f39c12, #e67e22)';
    } else {
        toastIcon.className = 'fas fa-check-circle';
        toast.style.background = 'linear-gradient(45deg, #27ae60, #20c997)';
    }
    
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Handle scroll events
function handleScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Show/hide back to top button
    if (scrollTop > 300) {
        backToTop.classList.add('show');
    } else {
        backToTop.classList.remove('show');
    }
}

// Scroll to products section
function scrollToProducts() {
    document.getElementById('products').scrollIntoView({ 
        behavior: 'smooth' 
    });
}

// Make functions globally available
window.openProductModal = openProductModal;
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateCartQuantity = updateCartQuantity;
window.toggleWishlist = toggleWishlist;
window.scrollToProducts = scrollToProducts;

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function formatPrice(price) {
    return `$${price.toFixed(2)}`;
}

function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    
    let stars = '';
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    if (halfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }
    return stars;
}