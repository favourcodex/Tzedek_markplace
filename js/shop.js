// Shop data
const shops = [
    {
        id: 1,
        name: "EcoStyle Fashion",
        description: "Sustainable and ethically produced clothing for the conscious consumer. Our fabrics are sourced from organic farms.",
        category: "fashion",
        rating: 4.8,
        products: 42,
        image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 2,
        name: "Green Home Decor",
        description: "Eco-friendly home furnishings and decor items that bring nature indoors while respecting the environment.",
        category: "home",
        rating: 4.6,
        products: 28,
        image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 3,
        name: "TechEthics",
        description: "Electronics and gadgets with ethical supply chains. We ensure fair labor practices and minimal environmental impact.",
        category: "electronics",
        rating: 4.9,
        products: 35,
        image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 4,
        name: "Pure Beauty Co.",
        description: "Natural and cruelty-free beauty products made with organic ingredients. Good for you and the planet.",
        category: "beauty",
        rating: 4.7,
        products: 52,
        image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 5,
        name: "Farm to Table Foods",
        description: "Locally sourced organic foods that support small-scale farmers and promote sustainable agriculture.",
        category: "food",
        rating: 4.5,
        products: 67,
        image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 6,
        name: "Artisan Crafts Collective",
        description: "Handcrafted items made by skilled artisans using traditional techniques and sustainable materials.",
        category: "home",
        rating: 4.9,
        products: 38,
        image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    }
];

// Function to render shops
function renderShops(filter = 'all', searchTerm = '') {
    const shopGrid = document.getElementById('shopGrid');
    let filteredShops = shops;
    
    // Apply category filter
    if (filter !== 'all') {
        filteredShops = filteredShops.filter(shop => shop.category === filter);
    }
    
    // Apply search term filter
    if (searchTerm) {
        const term = searchTerm.toLowerCase();
        filteredShops = filteredShops.filter(shop => 
            shop.name.toLowerCase().includes(term) || 
            shop.description.toLowerCase().includes(term) ||
            shop.category.toLowerCase().includes(term)
        );
    }
    
    if (filteredShops.length > 0) {
        shopGrid.innerHTML = filteredShops.map(shop => `
            <a href="shop-details.html?id=${shop.id}" class="shop-card">
                <div class="shop-image">
                    <img src="${shop.image}" alt="${shop.name}">
                    <span class="shop-category">${shop.category.charAt(0).toUpperCase() + shop.category.slice(1)}</span>
                </div>
                <div class="shop-info">
                    <h3 class="shop-name">${shop.name}</h3>
                    <p class="shop-description">${shop.description}</p>
                    <div class="shop-meta">
                        <div class="shop-rating">
                            <i class="fas fa-star"></i> ${shop.rating}
                        </div>
                        <div>${shop.products} products</div>
                    </div>
                </div>
            </a>
        `).join('');
    } else {
        shopGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-light);">No shops found matching your search.</p>';
    }
}

// Search functionality
function searchShops() {
    const searchTerm = document.getElementById('shopSearchInput').value;
    const activeFilter = document.querySelector('.filter-button.active').getAttribute('data-category');
    renderShops(activeFilter, searchTerm);
}

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Render all shops initially
    renderShops();
    
    // Set current year in footer
    document.getElementById('currentYear').textContent = new Date().getFullYear();
    
    // Mobile menu toggle
    const menuToggle = document.getElementById('menuToggle');
    const mobileNav = document.getElementById('mobileNav');
    
    menuToggle.addEventListener('click', function() {
        mobileNav.classList.toggle('active');
        
        // Change icon based on state
        const icon = menuToggle.querySelector('i');
        if (mobileNav.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
    
    // Filter buttons
    const filterButtons = document.querySelectorAll('.filter-button');
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            // Get filter category
            const filter = this.getAttribute('data-category');
            // Get search term
            const searchTerm = document.getElementById('shopSearchInput').value;
            // Render filtered shops
            renderShops(filter, searchTerm);
        });
    });
    
    // Search button functionality
    document.getElementById('shopSearchBtn').addEventListener('click', searchShops);
    
    // Search on Enter key press
    document.getElementById('shopSearchInput').addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
            searchShops();
        }
    });
    
    // Real-time search as user types (optional - can be removed if too intensive)
    let searchTimeout;
    document.getElementById('shopSearchInput').addEventListener('input', function() {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(searchShops, 500);
    });
    
    // Scroll to top functionality
    const scrollToTopBtn = document.getElementById('scrollToTop');
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.style.display = 'flex';
        } else {
            scrollToTopBtn.style.display = 'none';
        }
    });
    
    scrollToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
});