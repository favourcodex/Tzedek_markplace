// Tzedek Marketplace Admin Dashboard JavaScript
class AdminDashboard {
    constructor() {
        this.apiBase = '/api/admin';
        this.token = localStorage.getItem('authToken');
        this.user = JSON.parse(localStorage.getItem('user'));
        this.currentView = 'overview';
        this.init();
    }

    init() {
        this.checkAdminAccess();
        this.setupEventListeners();
        this.loadDashboardData();
    }

    checkAdminAccess() {
        if (!this.token || !this.user || this.user.role !== 'admin') {
            window.location.href = '/register.html';
            return;
        }
    }

    setupEventListeners() {
        // Navigation
        const navLinks = document.querySelectorAll('.admin-nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const view = e.target.dataset.view;
                this.switchView(view);
            });
        });

        // Search functionality
        const searchInput = document.getElementById('admin-search');
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
    }

    switchView(view) {
        this.currentView = view;
        
        // Update active nav link
        document.querySelectorAll('.admin-nav-link').forEach(link => {
            link.classList.remove('active');
        });
        document.querySelector(`[data-view="${view}"]`).classList.add('active');

        // Hide all content sections
        document.querySelectorAll('.admin-content-section').forEach(section => {
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

    async loadDashboardData() {
        try {
            const response = await fetch(`${this.apiBase}/stats`, {
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
            'total-users': stats.totalUsers,
            'total-shops': stats.totalShops,
            'total-products': stats.totalProducts,
            'total-orders': stats.totalOrders,
            'total-revenue': `₦${stats.totalRevenue.toLocaleString()}`,
            'total-sales': stats.totalSales
        };

        Object.entries(elements).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = value;
            }
        });
    }

    async loadViewData(view) {
        switch (view) {
            case 'users':
                await this.loadUsers();
                break;
            case 'shops':
                await this.loadShops();
                break;
            case 'products':
                await this.loadProducts();
                break;
            case 'orders':
                await this.loadOrders();
                break;
        }
    }

    async loadUsers(page = 1, search = '') {
        try {
            let url = `${this.apiBase}/users?page=${page}&limit=20`;
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
                this.renderUsers(data.users, data.pagination);
            }
        } catch (error) {
            console.error('Error loading users:', error);
        }
    }

    renderUsers(users, pagination) {
        const container = document.getElementById('users-container');
        if (!container) return;

        if (users.length === 0) {
            container.innerHTML = '<p class="no-data">No users found</p>';
            return;
        }

        const usersHTML = users.map(user => `
            <div class="data-row user-row" data-user-id="${user._id}">
                <div class="user-avatar">
                    <img src="${user.avatar || '/img/default-avatar.png'}" alt="${user.firstName}">
                </div>
                <div class="user-info">
                    <h4>${user.firstName} ${user.lastName}</h4>
                    <p>${user.email}</p>
                    <span class="user-role ${user.role}">${user.role}</span>
                </div>
                <div class="user-status">
                    <span class="status-badge ${user.isActive ? 'active' : 'inactive'}">
                        ${user.isActive ? 'Active' : 'Inactive'}
                    </span>
                </div>
                <div class="user-actions">
                    <button class="action-btn btn-sm" data-action="toggle-status" data-id="${user._id}">
                        ${user.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                    <button class="action-btn btn-sm" data-action="change-role" data-id="${user._id}">
                        Change Role
                    </button>
                    <button class="action-btn btn-sm btn-danger" data-action="delete-user" data-id="${user._id}">
                        Delete
                    </button>
                </div>
            </div>
        `).join('');

        container.innerHTML = usersHTML;
    }

    async loadShops(page = 1, search = '') {
        try {
            let url = `${this.apiBase}/shops?page=${page}&limit=20`;
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
                this.renderShops(data.shops, data.pagination);
            }
        } catch (error) {
            console.error('Error loading shops:', error);
        }
    }

    renderShops(shops, pagination) {
        const container = document.getElementById('shops-container');
        if (!container) return;

        if (shops.length === 0) {
            container.innerHTML = '<p class="no-data">No shops found</p>';
            return;
        }

        const shopsHTML = shops.map(shop => `
            <div class="data-row shop-row" data-shop-id="${shop._id}">
                <div class="shop-logo">
                    <img src="${shop.logo || '/img/default-shop.png'}" alt="${shop.name}">
                </div>
                <div class="shop-info">
                    <h4>${shop.name}</h4>
                    <p>${shop.description}</p>
                    <span class="shop-category">${shop.category}</span>
                </div>
                <div class="shop-status">
                    <span class="status-badge ${shop.status}">${shop.status}</span>
                    <span class="verification-badge ${shop.verification.isVerified ? 'verified' : 'unverified'}">
                        ${shop.verification.isVerified ? 'Verified' : 'Unverified'}
                    </span>
                </div>
                <div class="shop-actions">
                    <button class="action-btn btn-sm" data-action="verify-shop" data-id="${shop._id}">
                        ${shop.verification.isVerified ? 'Unverify' : 'Verify'}
                    </button>
                    <button class="action-btn btn-sm" data-action="toggle-shop-status" data-id="${shop._id}">
                        ${shop.status === 'active' ? 'Suspend' : 'Activate'}
                    </button>
                    <button class="action-btn btn-sm btn-danger" data-action="delete-shop" data-id="${shop._id}">
                        Delete
                    </button>
                </div>
            </div>
        `).join('');

        container.innerHTML = shopsHTML;
    }

    async loadProducts(page = 1, search = '') {
        try {
            let url = `${this.apiBase}/products?page=${page}&limit=20`;
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
            container.innerHTML = '<p class="no-data">No products found</p>';
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
                </div>
                <div class="product-status">
                    <span class="status-badge ${product.status}">${product.status}</span>
                </div>
                <div class="product-actions">
                    <button class="action-btn btn-sm" data-action="approve-product" data-id="${product._id}">
                        ${product.status === 'pending' ? 'Approve' : 'Unapprove'}
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
            let url = `${this.apiBase}/orders?page=${page}&limit=20`;
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
            container.innerHTML = '<p class="no-data">No orders found</p>';
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
                </div>
                <div class="order-actions">
                    <button class="action-btn btn-sm" data-action="update-status" data-id="${order._id}">
                        Update Status
                    </button>
                </div>
            </div>
        `).join('');

        container.innerHTML = ordersHTML;
    }

    async handleAction(action, id) {
        switch (action) {
            case 'toggle-status':
                await this.toggleUserStatus(id);
                break;
            case 'change-role':
                await this.changeUserRole(id);
                break;
            case 'delete-user':
                await this.deleteUser(id);
                break;
            case 'verify-shop':
                await this.verifyShop(id);
                break;
            case 'toggle-shop-status':
                await this.toggleShopStatus(id);
                break;
            case 'delete-shop':
                await this.deleteShop(id);
                break;
            case 'approve-product':
                await this.approveProduct(id);
                break;
            case 'delete-product':
                await this.deleteProduct(id);
                break;
            case 'update-status':
                await this.updateOrderStatus(id);
                break;
        }
    }

    async toggleUserStatus(userId) {
        try {
            const response = await fetch(`${this.apiBase}/users/${userId}/toggle-status`, {
                method: 'PUT',
                headers: {
                    'x-auth-token': this.token
                }
            });

            if (response.ok) {
                this.showNotification('User status updated successfully', 'success');
                this.loadUsers();
            } else {
                this.showNotification('Failed to update user status', 'error');
            }
        } catch (error) {
            this.showNotification('Error updating user status', 'error');
        }
    }

    async changeUserRole(userId) {
        const newRole = prompt('Enter new role (user, seller, admin):');
        if (!newRole) return;

        try {
            const response = await fetch(`${this.apiBase}/users/${userId}/role`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': this.token
                },
                body: JSON.stringify({ role: newRole })
            });

            if (response.ok) {
                this.showNotification('User role updated successfully', 'success');
                this.loadUsers();
            } else {
                this.showNotification('Failed to update user role', 'error');
            }
        } catch (error) {
            this.showNotification('Error updating user role', 'error');
        }
    }

    async deleteUser(userId) {
        if (!confirm('Are you sure you want to delete this user?')) return;

        try {
            const response = await fetch(`${this.apiBase}/users/${userId}`, {
                method: 'DELETE',
                headers: {
                    'x-auth-token': this.token
                }
            });

            if (response.ok) {
                this.showNotification('User deleted successfully', 'success');
                this.loadUsers();
            } else {
                this.showNotification('Failed to delete user', 'error');
            }
        } catch (error) {
            this.showNotification('Error deleting user', 'error');
        }
    }

    async verifyShop(shopId) {
        try {
            const response = await fetch(`${this.apiBase}/shops/${shopId}/verify`, {
                method: 'PUT',
                headers: {
                    'x-auth-token': this.token
                }
            });

            if (response.ok) {
                this.showNotification('Shop verification status updated', 'success');
                this.loadShops();
            } else {
                this.showNotification('Failed to update shop verification', 'error');
            }
        } catch (error) {
            this.showNotification('Error updating shop verification', 'error');
        }
    }

    async toggleShopStatus(shopId) {
        try {
            const response = await fetch(`${this.apiBase}/shops/${shopId}/toggle-status`, {
                method: 'PUT',
                headers: {
                    'x-auth-token': this.token
                }
            });

            if (response.ok) {
                this.showNotification('Shop status updated successfully', 'success');
                this.loadShops();
            } else {
                this.showNotification('Failed to update shop status', 'error');
            }
        } catch (error) {
            this.showNotification('Error updating shop status', 'error');
        }
    }

    async deleteShop(shopId) {
        if (!confirm('Are you sure you want to delete this shop?')) return;

        try {
            const response = await fetch(`${this.apiBase}/shops/${shopId}`, {
                method: 'DELETE',
                headers: {
                    'x-auth-token': this.token
                }
            });

            if (response.ok) {
                this.showNotification('Shop deleted successfully', 'success');
                this.loadShops();
            } else {
                this.showNotification('Failed to delete shop', 'error');
            }
        } catch (error) {
            this.showNotification('Error deleting shop', 'error');
        }
    }

    async approveProduct(productId) {
        try {
            const response = await fetch(`${this.apiBase}/products/${productId}/approve`, {
                method: 'PUT',
                headers: {
                    'x-auth-token': this.token
                }
            });

            if (response.ok) {
                this.showNotification('Product approval status updated', 'success');
                this.loadProducts();
            } else {
                this.showNotification('Failed to update product approval', 'error');
            }
        } catch (error) {
            this.showNotification('Error updating product approval', 'error');
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

// Initialize the admin dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.adminDashboard = new AdminDashboard();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AdminDashboard;
}
