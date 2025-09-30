// Tzedek Marketplace E-commerce Frontend JavaScript
class TzedekEcommerce {
    constructor() {
        this.apiBase = '/api';
        this.token = localStorage.getItem('authToken');
        this.user = JSON.parse(localStorage.getItem('user'));
        this.cart = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.checkAuthStatus();
        this.loadCart();
        this.updateCartIcon();
    }

    setupEventListeners() {
        // Auth forms
        const signupForm = document.getElementById('signup-form');
        const signinForm = document.getElementById('signin-form');
        
        if (signupForm) {
            signupForm.addEventListener('submit', (e) => this.handleSignup(e));
        }
        
        if (signinForm) {
            signinForm.addEventListener('submit', (e) => this.handleSignin(e));
        }

        // Product interactions
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('add-to-cart-btn')) {
                e.preventDefault();
                this.addToCart(e.target.dataset.productId);
            }
            
            if (e.target.classList.contains('buy-now-btn')) {
                e.preventDefault();
                this.buyNow(e.target.dataset.productId);
            }
            
            if (e.target.classList.contains('wishlist-btn')) {
                e.preventDefault();
                this.toggleWishlist(e.target.dataset.productId);
            }
        });

        // Search functionality
        const searchInput = document.getElementById('marketplaceSearch');
        if (searchInput) {
            searchInput.addEventListener('input', this.debounce(this.handleSearch.bind(this), 300));
        }

        // Cart interactions
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('cart-item-remove')) {
                e.preventDefault();
                this.removeFromCart(e.target.dataset.itemId);
            }
            
            if (e.target.classList.contains('cart-item-update')) {
                e.preventDefault();
                this.updateCartItem(e.target.dataset.itemId, e.target.dataset.quantity);
            }
        });

        // Checkout form
        const checkoutForm = document.getElementById('checkout-form');
        if (checkoutForm) {
            checkoutForm.addEventListener('submit', (e) => this.handleCheckout(e));
        }
    }

    // Authentication Methods
    async handleSignup(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        
        try {
            const response = await fetch(`${this.apiBase}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    firstName: formData.get('firstName'),
                    lastName: formData.get('lastName'),
                    email: formData.get('email'),
                    password: formData.get('password'),
                    confirmPassword: formData.get('confirmPassword')
                })
            });

            const data = await response.json();
            
            if (response.ok) {
                this.setAuthToken(data.token, data.user);
                this.showNotification('Account created successfully!', 'success');
                window.location.href = '/dashboard';
            } else {
                this.showNotification(data.message || 'Registration failed', 'error');
            }
        } catch (error) {
            this.showNotification('Network error. Please try again.', 'error');
        }
    }

    async handleSignin(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        
        try {
            const response = await fetch(`${this.apiBase}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.get('email'),
                    password: formData.get('password')
                })
            });

            const data = await response.json();
            
            if (response.ok) {
                this.setAuthToken(data.token, data.user);
                this.showNotification('Login successful!', 'success');
                window.location.href = '/dashboard';
            } else {
                this.showNotification(data.message || 'Login failed', 'error');
            }
        } catch (error) {
            this.showNotification('Network error. Please try again.', 'error');
        }
    }

    setAuthToken(token, user) {
        this.token = token;
        this.user = user;
        localStorage.setItem('authToken', token);
        localStorage.setItem('user', JSON.stringify(user));
        this.updateAuthUI();
    }

    logout() {
        this.token = null;
        this.user = null;
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        this.updateAuthUI();
        window.location.href = '/';
    }

    checkAuthStatus() {
        if (this.token && this.user) {
            this.updateAuthUI();
        } else {
            this.updateAuthUI();
        }
    }

    updateAuthUI() {
        const authSection = document.querySelector('.navbar-auth');
        if (!authSection) return;

        if (this.user) {
            authSection.innerHTML = `
                <div class="user-menu">
                    <span class="user-name">${this.user.firstName}</span>
                    <div class="user-dropdown">
                        <a href="/dashboard" class="dropdown-item">Dashboard</a>
                        <a href="/profile" class="dropdown-item">Profile</a>
                        <a href="/orders" class="dropdown-item">Orders</a>
                        <button class="dropdown-item logout-btn">Logout</button>
                    </div>
                </div>
            `;
            
            // Add logout event listener
            const logoutBtn = authSection.querySelector('.logout-btn');
            if (logoutBtn) {
                logoutBtn.addEventListener('click', () => this.logout());
            }
        } else {
            authSection.innerHTML = `
                <a href="/register" class="nav-link">Sign Up</a>
                <a href="/register" class="btn-primary">Become a Seller</a>
            `;
        }
    }

    // Product Methods
    async addToCart(productId, quantity = 1) {
        if (!this.token) {
            this.showNotification('Please login to add items to cart', 'warning');
            return;
        }

        try {
            const response = await fetch(`${this.apiBase}/cart/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': this.token
                },
                body: JSON.stringify({
                    productId,
                    quantity: parseInt(quantity)
                })
            });

            const data = await response.json();
            
            if (response.ok) {
                this.cart = data.cart;
                this.updateCartIcon();
                this.showNotification('Item added to cart!', 'success');
            } else {
                this.showNotification(data.message || 'Failed to add item', 'error');
            }
        } catch (error) {
            this.showNotification('Network error. Please try again.', 'error');
        }
    }

    async buyNow(productId) {
        if (!this.token) {
            this.showNotification('Please login to purchase items', 'warning');
            return;
        }

        // Add to cart and redirect to checkout
        await this.addToCart(productId, 1);
        if (this.cart) {
            window.location.href = '/checkout';
        }
    }

    async toggleWishlist(productId) {
        if (!this.token) {
            this.showNotification('Please login to use wishlist', 'warning');
            return;
        }

        // TODO: Implement wishlist functionality
        this.showNotification('Wishlist feature coming soon!', 'info');
    }

    // Cart Methods
    async loadCart() {
        if (!this.token) return;

        try {
            const response = await fetch(`${this.apiBase}/cart`, {
                headers: {
                    'x-auth-token': this.token
                }
            });

            if (response.ok) {
                this.cart = await response.json();
                this.updateCartIcon();
                this.renderCart();
            }
        } catch (error) {
            console.error('Error loading cart:', error);
        }
    }

    async removeFromCart(itemId) {
        try {
            const response = await fetch(`${this.apiBase}/cart/remove/${itemId}`, {
                method: 'DELETE',
                headers: {
                    'x-auth-token': this.token
                }
            });

            if (response.ok) {
                const data = await response.json();
                this.cart = data.cart;
                this.updateCartIcon();
                this.renderCart();
                this.showNotification('Item removed from cart', 'success');
            }
        } catch (error) {
            this.showNotification('Error removing item', 'error');
        }
    }

    async updateCartItem(itemId, quantity) {
        try {
            const response = await fetch(`${this.apiBase}/cart/update/${itemId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': this.token
                },
                body: JSON.stringify({ quantity: parseInt(quantity) })
            });

            if (response.ok) {
                const data = await response.json();
                this.cart = data.cart;
                this.updateCartIcon();
                this.renderCart();
            }
        } catch (error) {
            this.showNotification('Error updating cart', 'error');
        }
    }

    updateCartIcon() {
        const cartIcon = document.querySelector('.cart-icon');
        if (!cartIcon) return;

        const itemCount = this.cart ? this.cart.items.length : 0;
        const cartBadge = cartIcon.querySelector('.cart-badge') || 
                          document.createElement('span');
        
        if (itemCount > 0) {
            cartBadge.className = 'cart-badge';
            cartBadge.textContent = itemCount;
            if (!cartIcon.contains(cartBadge)) {
                cartIcon.appendChild(cartBadge);
            }
        } else {
            cartBadge.remove();
        }
    }

    renderCart() {
        const cartContainer = document.getElementById('cart-container');
        if (!cartContainer || !this.cart) return;

        if (this.cart.items.length === 0) {
            cartContainer.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
            return;
        }

        const cartHTML = `
            <div class="cart-items">
                ${this.cart.items.map(item => `
                    <div class="cart-item" data-item-id="${item._id}">
                        <img src="${item.product.images[0]?.url || '/img/placeholder.jpg'}" alt="${item.product.name}">
                        <div class="cart-item-details">
                            <h4>${item.product.name}</h4>
                            <p class="cart-item-price">₦${item.price.toLocaleString()}</p>
                            <div class="cart-item-quantity">
                                <button class="quantity-btn minus" data-action="decrease">-</button>
                                <span class="quantity-value">${item.quantity}</span>
                                <button class="quantity-btn plus" data-action="increase">+</button>
                            </div>
                        </div>
                        <button class="cart-item-remove" data-item-id="${item._id}">×</button>
                    </div>
                `).join('')}
            </div>
            <div class="cart-totals">
                <div class="cart-total-item">
                    <span>Subtotal:</span>
                    <span>₦${this.cart.totals.subtotal.toLocaleString()}</span>
                </div>
                <div class="cart-total-item">
                    <span>Shipping:</span>
                    <span>₦${this.cart.totals.shipping.toLocaleString()}</span>
                </div>
                <div class="cart-total-item">
                    <span>Total:</span>
                    <span class="cart-total">₦${this.cart.totals.total.toLocaleString()}</span>
                </div>
            </div>
            <div class="cart-actions">
                <button class="btn-outline" onclick="window.location.href='/cart'">View Cart</button>
                <button class="btn-primary" onclick="window.location.href='/checkout'">Checkout</button>
            </div>
        `;

        cartContainer.innerHTML = cartHTML;
    }

    // Search Methods
    async handleSearch(e) {
        const query = e.target.value.trim();
        if (query.length < 2) return;

        try {
            const response = await fetch(`${this.apiBase}/products?search=${encodeURIComponent(query)}&limit=8`);
            const data = await response.json();
            
            if (response.ok) {
                this.renderSearchResults(data.products);
            }
        } catch (error) {
            console.error('Search error:', error);
        }
    }

    renderSearchResults(products) {
        const searchResults = document.getElementById('search-results');
        if (!searchResults) return;

        if (products.length === 0) {
            searchResults.innerHTML = '<p class="no-results">No products found</p>';
            return;
        }

        const resultsHTML = products.map(product => `
            <div class="search-result-item" onclick="window.location.href='/product/${product._id}'">
                <img src="${product.images[0]?.url || '/img/placeholder.jpg'}" alt="${product.name}">
                <div class="search-result-details">
                    <h4>${product.name}</h4>
                    <p class="search-result-price">₦${product.price.toLocaleString()}</p>
                </div>
            </div>
        `).join('');

        searchResults.innerHTML = resultsHTML;
        searchResults.style.display = 'block';
    }

    // Checkout Methods
    async handleCheckout(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        
        if (!this.token) {
            this.showNotification('Please login to checkout', 'warning');
            return;
        }

        try {
            const checkoutData = {
                paymentMethod: formData.get('paymentMethod'),
                shippingAddress: {
                    firstName: formData.get('shippingFirstName'),
                    lastName: formData.get('shippingLastName'),
                    street: formData.get('shippingStreet'),
                    city: formData.get('shippingCity'),
                    state: formData.get('shippingState'),
                    country: formData.get('shippingCountry'),
                    zipCode: formData.get('shippingZipCode'),
                    phone: formData.get('shippingPhone')
                },
                billingAddress: {
                    firstName: formData.get('billingFirstName'),
                    lastName: formData.get('billingLastName'),
                    street: formData.get('billingStreet'),
                    city: formData.get('billingCity'),
                    state: formData.get('billingState'),
                    country: formData.get('billingCountry'),
                    zipCode: formData.get('billingZipCode'),
                    phone: formData.get('billingPhone')
                },
                shippingMethod: formData.get('shippingMethod'),
                notes: formData.get('notes')
            };

            const response = await fetch(`${this.apiBase}/orders/checkout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': this.token
                },
                body: JSON.stringify(checkoutData)
            });

            const data = await response.json();
            
            if (response.ok) {
                this.showNotification('Order placed successfully!', 'success');
                this.cart = null;
                this.updateCartIcon();
                
                // Redirect to payment or order confirmation
                if (checkoutData.paymentMethod === 'stripe') {
                    this.processStripePayment(data.orders[0]);
                } else {
                    window.location.href = `/order-confirmation/${data.orders[0].id}`;
                }
            } else {
                this.showNotification(data.message || 'Checkout failed', 'error');
            }
        } catch (error) {
            this.showNotification('Network error. Please try again.', 'error');
        }
    }

    async processStripePayment(order) {
        try {
            // Create payment intent
            const response = await fetch(`${this.apiBase}/payments/create-payment-intent`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': this.token
                },
                body: JSON.stringify({
                    amount: order.total,
                    currency: 'NGN',
                    orderId: order.id
                })
            });

            const data = await response.json();
            
            if (response.ok) {
                // Initialize Stripe payment
                this.initializeStripePayment(data.clientSecret, order);
            } else {
                this.showNotification('Payment initialization failed', 'error');
            }
        } catch (error) {
            this.showNotification('Payment error', 'error');
        }
    }

    initializeStripePayment(clientSecret, order) {
        // This would integrate with Stripe.js
        // For now, we'll show a placeholder
        this.showNotification('Redirecting to payment gateway...', 'info');
        setTimeout(() => {
            window.location.href = `/payment/${order.id}`;
        }, 2000);
    }

    // Utility Methods
    debounce(func, wait) {
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

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        `;

        // Add to page
        document.body.appendChild(notification);

        // Show notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        // Auto hide after 5 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 5000);

        // Close button functionality
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        });
    }

    // Product Display Methods
    async loadProducts(category = null, page = 1) {
        try {
            let url = `${this.apiBase}/products?page=${page}&limit=12`;
            if (category) {
                url += `&category=${category}`;
            }

            const response = await fetch(url);
            const data = await response.json();
            
            if (response.ok) {
                this.renderProducts(data.products, data.pagination);
            }
        } catch (error) {
            console.error('Error loading products:', error);
        }
    }

    renderProducts(products, pagination) {
        const container = document.getElementById('products-container');
        if (!container) return;

        if (products.length === 0) {
            container.innerHTML = '<p class="no-products">No products found</p>';
            return;
        }

        const productsHTML = products.map(product => `
            <div class="product-card" data-product-id="${product._id}">
                <div class="product-image">
                    <img src="${product.images[0]?.url || '/img/placeholder.jpg'}" alt="${product.name}">
                    ${product.isOnSale ? '<span class="sale-badge">Sale</span>' : ''}
                    ${product.isFeatured ? '<span class="featured-badge">Featured</span>' : ''}
                </div>
                <div class="product-info">
                    <div class="product-category">${product.category}</div>
                    <h3 class="product-title">${product.name}</h3>
                    <p class="product-description">${product.description}</p>
                    <div class="product-price">
                        ${product.comparePrice && product.comparePrice > product.price ? 
                            `<span class="original-price">₦${product.comparePrice.toLocaleString()}</span>` : ''}
                        <span class="current-price">₦${product.price.toLocaleString()}</span>
                    </div>
                    <div class="product-actions">
                        <button class="add-to-cart-btn" data-product-id="${product._id}">
                            Add to Cart
                        </button>
                        <button class="buy-now-btn" data-product-id="${product._id}">
                            Buy Now
                        </button>
                        <button class="wishlist-btn" data-product-id="${product._id}">
                            <i class="fas fa-heart"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

        container.innerHTML = productsHTML;

        // Render pagination if available
        if (pagination) {
            this.renderPagination(pagination);
        }
    }

    renderPagination(pagination) {
        const paginationContainer = document.getElementById('pagination-container');
        if (!paginationContainer) return;

        let paginationHTML = '<div class="pagination">';
        
        if (pagination.hasPrevPage) {
            paginationHTML += `<button class="page-btn" data-page="${pagination.currentPage - 1}">Previous</button>`;
        }
        
        for (let i = 1; i <= pagination.totalPages; i++) {
            if (i === pagination.currentPage) {
                paginationHTML += `<span class="page-btn current">${i}</span>`;
            } else {
                paginationHTML += `<button class="page-btn" data-page="${i}">${i}</button>`;
            }
        }
        
        if (pagination.hasNextPage) {
            paginationHTML += `<button class="page-btn" data-page="${pagination.currentPage + 1}">Next</button>`;
        }
        
        paginationHTML += '</div>';
        
        paginationContainer.innerHTML = paginationHTML;

        // Add event listeners to pagination buttons
        const pageBtns = paginationContainer.querySelectorAll('.page-btn[data-page]');
        pageBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const page = parseInt(btn.dataset.page);
                this.loadProducts(null, page);
            });
        });
    }
}

// Initialize the e-commerce functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.tzedekEcommerce = new TzedekEcommerce();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TzedekEcommerce;
}
