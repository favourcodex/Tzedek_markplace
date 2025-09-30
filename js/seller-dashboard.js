// Tzedek Marketplace Seller Dashboard JavaScript
class SellerDashboard {
    constructor() {
        this.apiBase = '/api';
        this.token = localStorage.getItem('authToken');
        this.user = JSON.parse(localStorage.getItem('user'));
        this.currentView = 'overview';
        this.shop = null;
        this.init();
    }

    init() {
        this.checkSellerAccess();
        this.setupEventListeners();
        this.loadShopData();
        this.loadDashboardData();
    }

    checkSellerAccess() {
        if (!this.token || !this.user || (this.user.role !== 'seller' && this.user.role !== 'admin')) {
            window.location.href = '/login';
            return;
        }
    }

    setupEventListeners() {
        // Navigation
        const navLinks = document.querySelectorAll('.seller-nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const view = e.target.dataset.view;
                this.switchView(view);
            });
        });

        // Product form
        const productForm = document.getElementById('product-form');
        if (productForm) {
            productForm.addEventListener('submit', (e) => this.handleProductSubmit(e));
        }

        // Shop form
        const shopForm = document.getElementById('shop-form');
        if (shopForm) {
            shopForm.addEventListener('submit', (e) => this.handleShopSubmit(e));
        }

        // Search functionality
        const searchInput = document.getElementById('seller-search');
        if (searchInput) {
            searchInput.addEventListener('input', this.debounce(this.handleSearch.bind(this), 300));
        }

        // Action buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('action-btn')) {
                e.preventDefault();
                this.handleAction(e.target.dataset.action, e.target.dataset.id);
            }
        });

        // Image upload preview
        const imageInputs = document.querySelectorAll('.image-input');
        imageInputs.forEach(input => {
            input.addEventListener('change', (e) => this.handleImagePreview(e));
        });
    }

    switchView(view) {
        this.currentView = view;
        
        // Update active nav link
        document.querySelectorAll('.seller-nav-link').forEach(link => {
            link.classList.remove('active');
        });
        document.querySelector(`[data-view="${view}"]`).classList.add('active');

        // Hide all content sections
        document.querySelectorAll('.seller-content-section').forEach(section => {
            section.style.display = 'none';
        });

        // Show selected content section
        const targetSection = document.getElementById(`${view}-section`);
        if (targetSection) {
            targetSection.style.display = 'block';
        }

        // Load data for the selected view
        this.loadViewData(view);
    }

    async loadShopData() {
        try {
            const response = await fetch(`${this.apiBase}/shops/my-shop`, {
                headers: {
                    'x-auth-token': this.token
                }
            });

            if (response.ok) {
                this.shop = await response.json();
                this.updateShopInfo();
            } else if (response.status === 404) {
                // Shop doesn't exist, show create shop form
                this.showCreateShopForm();
            }
        } catch (error) {
            console.error('Error loading shop data:', error);
        }
    }

    updateShopInfo() {
        if (!this.shop) return;

        // Update shop header
        const shopHeader = document.querySelector('.shop-header');
        if (shopHeader) {
            shopHeader.innerHTML = `
                <div class="shop-logo">
                    <img src="${this.shop.logo || '/img/default-shop.png'}" alt="${this.shop.name}">
                </div>
                <div class="shop-details">
                    <h1>${this.shop.name}</h1>
                    <p>${this.shop.description}</p>
                    <div class="shop-stats">
                        <span class="stat-item">
                            <strong>${this.shop.stats.totalProducts}</strong> Products
                        </span>
                        <span class="stat-item">
                            <strong>${this.shop.stats.totalOrders}</strong> Orders
                        </span>
                        <span class="stat-item">
                            <strong>₦${this.shop.stats.totalSales.toLocaleString()}</strong> Sales
                        </span>
                    </div>
                </div>
            `;
        }

        // Update shop form if editing
        this.populateShopForm();
    }

    showCreateShopForm() {
        const shopSection = document.getElementById('shop-section');
        if (shopSection) {
            shopSection.innerHTML = `
                <div class="create-shop-form">
                    <h2>Create Your Shop</h2>
                    <p>Get started by creating your shop on Tzedek Marketplace</p>
                    <form id="shop-form">
                        <div class="form-group">
                            <label for="shop-name">Shop Name *</label>
                            <input type="text" id="shop-name" name="name" required>
                        </div>
                        <div class="form-group">
                            <label for="shop-description">Description *</label>
                            <textarea id="shop-description" name="description" required></textarea>
                        </div>
                        <div class="form-group">
                            <label for="shop-category">Category *</label>
                            <select id="shop-category" name="category" required>
                                <option value="">Select Category</option>
                                <option value="fashion">Fashion</option>
                                <option value="electronics">Electronics</option>
                                <option value="home">Home & Garden</option>
                                <option value="beauty">Beauty & Health</option>
                                <option value="sports">Sports & Outdoors</option>
                                <option value="books">Books & Media</option>
                                <option value="toys">Toys & Games</option>
                                <option value="automotive">Automotive</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="shop-logo">Shop Logo</label>
                            <input type="file" id="shop-logo" name="logo" accept="image/*">
                            <div class="image-preview" id="logo-preview"></div>
                        </div>
                        <div class="form-group">
                            <label for="shop-cover">Cover Image</label>
                            <input type="file" id="shop-cover" name="coverImage" accept="image/*">
                            <div class="image-preview" id="cover-preview"></div>
                        </div>
                        <button type="submit" class="btn-primary">Create Shop</button>
                    </form>
                </div>
            `;

            // Re-attach event listeners
            this.setupEventListeners();
        }
    }

    populateShopForm() {
        if (!this.shop) return;

        const form = document.getElementById('shop-form');
        if (!form) return;

        // Populate form fields
        form.querySelector('[name="name"]').value = this.shop.name;
        form.querySelector('[name="description"]').value = this.shop.description;
        form.querySelector('[name="category"]').value = this.shop.category;

        // Update form title
        const title = form.querySelector('h2');
        if (title) {
            title.textContent = 'Edit Shop';
        }

        // Update submit button
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.textContent = 'Update Shop';
        }
    }

    async handleShopSubmit(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        
        try {
            const url = this.shop ? 
                `${this.apiBase}/shops/${this.shop._id}` : 
                `${this.apiBase}/shops`;
            
            const method = this.shop ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method: method,
                headers: {
                    'x-auth-token': this.token
                },
                body: formData
            });

            const data = await response.json();
            
            if (response.ok) {
                this.showNotification(
                    this.shop ? 'Shop updated successfully!' : 'Shop created successfully!', 
                    'success'
                );
                
                if (!this.shop) {
                    this.shop = data.shop;
                    this.updateShopInfo();
                    this.switchView('overview');
                }
            } else {
                this.showNotification(data.message || 'Operation failed', 'error');
            }
        } catch (error) {
            this.showNotification('Network error. Please try again.', 'error');
        }
    }

    async loadDashboardData() {
        if (!this.shop) return;

        try {
            const response = await fetch(`${this.apiBase}/shops/${this.shop._id}/stats`, {
                headers: {
                    'x-auth-token': this.token
                }
            });

            if (response.ok) {
                const data = await response.json();
                this.updateDashboardStats(data);
            }
        } catch (error) {
            console.error('Error loading dashboard data:', error);
        }
    }

    updateDashboardStats(stats) {
        // Update overview cards
        const elements = {
            'total-sales': `₦${stats.totalSales.toLocaleString()}`,
            'total-orders': stats.totalOrders,
            'total-products': stats.totalProducts,
            'conversion-rate': `${stats.conversionRate}%`
        };

        Object.entries(elements).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = value;
            }
        });
    }

    async loadViewData(view) {
        if (!this.shop) return;

        switch (view) {
            case 'products':
                await this.loadProducts();
                break;
            case 'orders':
                await this.loadOrders();
                break;
            case 'analytics':
                await this.loadAnalytics();
                break;
        }
    }

    async loadProducts(page = 1, search = '') {
        try {
            let url = `${this.apiBase}/shops/${this.shop._id}/products?page=${page}&limit=20`;
            if (search) {
                url += `&search=${encodeURIComponent(search)}`;
            }

            const response = await fetch(url, {
                headers: {
                    'x-auth-token': this.token
                }
            });

            if (response.ok) {
                const data = await response.json();
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
            container.innerHTML = `
                <div class="empty-state">
                    <p>No products yet. Create your first product to get started!</p>
                    <button class="btn-primary" onclick="this.switchView('add-product')">Add Product</button>
                </div>
            `;
            return;
        }

        const productsHTML = products.map(product => `
            <div class="data-row product-row" data-product-id="${product._id}">
                <div class="product-image">
                    <img src="${product.images[0]?.url || '/img/placeholder.jpg'}" alt="${product.name}">
                </div>
                <div class="product-info">
                    <h4>${product.name}</h4>
                    <p>${product.description}</p>
                    <span class="product-category">${product.category}</span>
                </div>
                <div class="product-price">
                    <span class="current-price">₦${product.price.toLocaleString()}</span>
                    ${product.comparePrice ? `<span class="compare-price">₦${product.comparePrice.toLocaleString()}</span>` : ''}
                </div>
                <div class="product-status">
                    <span class="status-badge ${product.status}">${product.status}</span>
                    <span class="featured-badge ${product.isFeatured ? 'featured' : ''}">
                        ${product.isFeatured ? 'Featured' : ''}
                    </span>
                </div>
                <div class="product-actions">
                    <button class="action-btn btn-sm" data-action="edit-product" data-id="${product._id}">
                        Edit
                    </button>
                    <button class="action-btn btn-sm" data-action="toggle-status" data-id="${product._id}">
                        ${product.status === 'active' ? 'Deactivate' : 'Activate'}
                    </button>
                    <button class="action-btn btn-sm btn-danger" data-action="delete-product" data-id="${product._id}">
                        Delete
                    </button>
                </div>
            </div>
        `).join('');

        container.innerHTML = productsHTML;
    }

    async loadOrders(page = 1, search = '') {
        try {
            let url = `${this.apiBase}/shops/${this.shop._id}/orders?page=${page}&limit=20`;
            if (search) {
                url += `&search=${encodeURIComponent(search)}`;
            }

            const response = await fetch(url, {
                headers: {
                    'x-auth-token': this.token
                }
            });

            if (response.ok) {
                const data = await response.json();
                this.renderOrders(data.orders, data.pagination);
            }
        } catch (error) {
            console.error('Error loading orders:', error);
        }
    }

    renderOrders(orders, pagination) {
        const container = document.getElementById('orders-container');
        if (!container) return;

        if (orders.length === 0) {
            container.innerHTML = '<p class="no-data">No orders yet</p>';
            return;
        }

        const ordersHTML = orders.map(order => `
            <div class="data-row order-row" data-order-id="${order._id}">
                <div class="order-number">
                    <h4>#${order.orderNumber}</h4>
                    <p>${new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div class="order-customer">
                    <h4>${order.customer.firstName} ${order.customer.lastName}</h4>
                    <p>${order.customer.email}</p>
                </div>
                <div class="order-items">
                    <span class="item-count">${order.items.length} items</span>
                    <span class="order-total">₦${order.total.toLocaleString()}</span>
                </div>
                <div class="order-status">
                    <span class="status-badge ${order.status}">${order.status}</span>
                    <span class="payment-status ${order.payment.status}">${order.payment.status}</span>
                </div>
                <div class="order-actions">
                    <button class="action-btn btn-sm" data-action="view-order" data-id="${order._id}">
                        View
                    </button>
                    <button class="action-btn btn-sm" data-action="update-status" data-id="${order._id}">
                        Update Status
                    </button>
                </div>
            </div>
        `).join('');

        container.innerHTML = ordersHTML;
    }

    async loadAnalytics() {
        try {
            const response = await fetch(`${this.apiBase}/shops/${this.shop._id}/analytics`, {
                headers: {
                    'x-auth-token': this.token
                }
            });

            if (response.ok) {
                const data = await response.json();
                this.renderAnalytics(data);
            }
        } catch (error) {
            console.error('Error loading analytics:', error);
        }
    }

    renderAnalytics(analytics) {
        const container = document.getElementById('analytics-container');
        if (!container) return;

        const analyticsHTML = `
            <div class="analytics-grid">
                <div class="analytics-card">
                    <h3>Sales Overview</h3>
                    <div class="chart-container">
                        <canvas id="sales-chart"></canvas>
                    </div>
                </div>
                
                <div class="analytics-card">
                    <h3>Top Products</h3>
                    <div class="top-products-list">
                        ${analytics.topProducts.map(product => `
                            <div class="top-product-item">
                                <span class="product-name">${product.name}</span>
                                <span class="product-sales">${product.sales} sales</span>
                                <span class="product-revenue">₦${product.revenue.toLocaleString()}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="analytics-card">
                    <h3>Customer Insights</h3>
                    <div class="customer-stats">
                        <div class="stat-item">
                            <span class="label">Total Customers</span>
                            <span class="value">${analytics.totalCustomers}</span>
                        </div>
                        <div class="stat-item">
                            <span class="label">Repeat Customers</span>
                            <span class="value">${analytics.repeatCustomers}</span>
                        </div>
                        <div class="stat-item">
                            <span class="label">Average Order Value</span>
                            <span class="value">₦${analytics.averageOrderValue.toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;

        container.innerHTML = analyticsHTML;
    }

    async handleProductSubmit(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        
        try {
            const url = e.target.dataset.productId ? 
                `${this.apiBase}/products/${e.target.dataset.productId}` : 
                `${this.apiBase}/products`;
            
            const method = e.target.dataset.productId ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method: method,
                headers: {
                    'x-auth-token': this.token
                },
                body: formData
            });

            const data = await response.json();
            
            if (response.ok) {
                this.showNotification(
                    e.target.dataset.productId ? 'Product updated successfully!' : 'Product created successfully!', 
                    'success'
                );
                
                this.switchView('products');
            } else {
                this.showNotification(data.message || 'Operation failed', 'error');
            }
        } catch (error) {
            this.showNotification('Network error. Please try again.', 'error');
        }
    }

    async handleAction(action, id) {
        switch (action) {
            case 'edit-product':
                await this.editProduct(id);
                break;
            case 'toggle-status':
                await this.toggleProductStatus(id);
                break;
            case 'delete-product':
                await this.deleteProduct(id);
                break;
            case 'view-order':
                await this.viewOrder(id);
                break;
            case 'update-status':
                await this.updateOrderStatus(id);
                break;
        }
    }

    async editProduct(productId) {
        try {
            const response = await fetch(`${this.apiBase}/products/${productId}`, {
                headers: {
                    'x-auth-token': this.token
                }
            });

            if (response.ok) {
                const product = await response.json();
                this.showEditProductForm(product);
            }
        } catch (error) {
            this.showNotification('Error loading product', 'error');
        }
    }

    showEditProductForm(product) {
        const productsSection = document.getElementById('products-section');
        if (!productsSection) return;

        productsSection.innerHTML = `
            <div class="edit-product-form">
                <h2>Edit Product</h2>
                <form id="product-form" data-product-id="${product._id}">
                    <div class="form-group">
                        <label for="product-name">Product Name *</label>
                        <input type="text" id="product-name" name="name" value="${product.name}" required>
                    </div>
                    <div class="form-group">
                        <label for="product-description">Description *</label>
                        <textarea id="product-description" name="description" required>${product.description}</textarea>
                    </div>
                    <div class="form-group">
                        <label for="product-category">Category *</label>
                        <select id="product-category" name="category" required>
                            <option value="fashion" ${product.category === 'fashion' ? 'selected' : ''}>Fashion</option>
                            <option value="electronics" ${product.category === 'electronics' ? 'selected' : ''}>Electronics</option>
                            <option value="home" ${product.category === 'home' ? 'selected' : ''}>Home & Garden</option>
                            <option value="beauty" ${product.category === 'beauty' ? 'selected' : ''}>Beauty & Health</option>
                            <option value="sports" ${product.category === 'sports' ? 'selected' : ''}>Sports & Outdoors</option>
                            <option value="books" ${product.category === 'books' ? 'selected' : ''}>Books & Media</option>
                            <option value="toys" ${product.category === 'toys' ? 'selected' : ''}>Toys & Games</option>
                            <option value="automotive" ${product.category === 'automotive' ? 'selected' : ''}>Automotive</option>
                            <option value="other" ${product.category === 'other' ? 'selected' : ''}>Other</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="product-price">Price (₦) *</label>
                        <input type="number" id="product-price" name="price" value="${product.price}" min="0" step="0.01" required>
                    </div>
                    <div class="form-group">
                        <label for="product-compare-price">Compare Price (₦)</label>
                        <input type="number" id="product-compare-price" name="comparePrice" value="${product.comparePrice || ''}" min="0" step="0.01">
                    </div>
                    <div class="form-group">
                        <label for="product-images">Product Images</label>
                        <input type="file" id="product-images" name="images" accept="image/*" multiple>
                        <div class="image-preview" id="images-preview">
                            ${product.images.map(img => `<img src="${img.url}" alt="Product image">`).join('')}
                        </div>
                    </div>
                    <div class="form-actions">
                        <button type="submit" class="btn-primary">Update Product</button>
                        <button type="button" class="btn-outline" onclick="this.switchView('products')">Cancel</button>
                    </div>
                </form>
            </div>
        `;

        // Re-attach event listeners
        this.setupEventListeners();
    }

    async toggleProductStatus(productId) {
        try {
            const response = await fetch(`${this.apiBase}/products/${productId}/toggle-status`, {
                method: 'PUT',
                headers: {
                    'x-auth-token': this.token
                }
            });

            if (response.ok) {
                this.showNotification('Product status updated successfully', 'success');
                this.loadProducts();
            } else {
                this.showNotification('Failed to update product status', 'error');
            }
        } catch (error) {
            this.showNotification('Error updating product status', 'error');
        }
    }

    async deleteProduct(productId) {
        if (!confirm('Are you sure you want to delete this product?')) return;

        try {
            const response = await fetch(`${this.apiBase}/products/${productId}`, {
                method: 'DELETE',
                headers: {
                    'x-auth-token': this.token
                }
            });

            if (response.ok) {
                this.showNotification('Product deleted successfully', 'success');
                this.loadProducts();
            } else {
                this.showNotification('Failed to delete product', 'error');
            }
        } catch (error) {
            this.showNotification('Error deleting product', 'error');
        }
    }

    async viewOrder(orderId) {
        // TODO: Implement order detail modal
        this.showNotification('Order detail view coming soon!', 'info');
    }

    async updateOrderStatus(orderId) {
        const newStatus = prompt('Enter new status (pending, processing, shipped, delivered, cancelled):');
        if (!newStatus) return;

        try {
            const response = await fetch(`${this.apiBase}/orders/${orderId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': this.token
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (response.ok) {
                this.showNotification('Order status updated successfully', 'success');
                this.loadOrders();
            } else {
                this.showNotification('Failed to update order status', 'error');
            }
        } catch (error) {
            this.showNotification('Error updating order status', 'error');
        }
    }

    handleImagePreview(e) {
        const file = e.target.files[0];
        const previewId = e.target.id.replace('input', 'preview');
        const preview = document.getElementById(previewId);
        
        if (!preview) return;

        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                preview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
            };
            reader.readAsDataURL(file);
        }
    }

    handleSearch(e) {
        const query = e.target.value.trim();
        if (query.length < 2) return;

        this.loadViewData(this.currentView, 1, query);
    }

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
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 5000);

        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        });
    }
}

// Initialize the seller dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.sellerDashboard = new SellerDashboard();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SellerDashboard;
}
