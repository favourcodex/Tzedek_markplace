// Product data - This would typically come from an API in a real application
const allProducts = [
  {
      id: 1,
      name: "Premium Smartphone X1",
      category: "electronics",
      brand: "apple",
      price: 75000,
      image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=400&q=80",
      rating: 4.8,
      description: "Latest smartphone with advanced camera system"
  },
  {
      id: 2,
      name: "Ultra Slim Laptop Pro",
      category: "laptops",
      brand: "samsung",
      price: 210000,
      image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=400&q=80",
      rating: 4.6,
      description: "Lightweight laptop with powerful processor"
  },
  {
      id: 3,
      name: "Wireless Noise-Cancelling Headphones",
      category: "accessories",
      brand: "sony",
      price: 32500,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80",
      rating: 4.9,
      description: "High-quality audio with noise cancellation"
  },
  {
      id: 4,
      name: "Smart Fitness Tracker",
      category: "gadgets",
      brand: "google",
      price: 18900,
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80",
      rating: 4.5,
      description: "Track your fitness goals with precision"
  },
  {
      id: 5,
      name: "Gaming Mouse",
      category: "accessories",
      brand: "xiaomi",
      price: 12500,
      image: "https://images.unsplash.com/photo-1552036984-538597288883?auto=format&fit=crop&w=400&q=80",
      rating: 4.7,
      description: "Ergonomic design for long gaming sessions"
  },
  {
      id: 6,
      name: "Bluetooth Speaker",
      category: "accessories",
      brand: "apple",
      price: 25000,
      image: "https://images.unsplash.com/photo-1557777792-d63152054683?auto=format&fit=crop&w=400&q=80",
      rating: 4.4,
      description: "Portable speaker with excellent sound quality"
  },
  {
      id: 7,
      name: "Smart Watch Series 5",
      category: "gadgets",
      brand: "apple",
      price: 95000,
      image: "https://images.unsplash.com/photo-1599757525464-952840323178?auto=format&fit=crop&w=400&q=80",
      rating: 4.8,
      description: "Advanced health monitoring features"
  },
  {
      id: 8,
      name: "Professional Camera",
      category: "electronics",
      brand: "samsung",
      price: 180000,
      image: "https://images.unsplash.com/photo-1580427854964-952840323178?auto=format&fit=crop&w=400&q=80",
      rating: 4.9,
      description: "High-resolution camera for professionals"
  }
];

// DOM elements
const searchInput = document.getElementById('searchInput');
const priceRange = document.getElementById('priceRange');
const maxPrice = document.getElementById('maxPrice');
const resetFiltersBtn = document.getElementById('resetFilters');
const productsListing = document.getElementById('productsListing');

// Update price range display
function updatePriceDisplay() {
  const priceValue = priceRange.value;
  maxPrice.textContent = `₦${priceValue.toLocaleString()}`;
}

// Filter products based on selected criteria
function filterProducts() {
  let filteredProducts = [...allProducts];
  
  // Search filter
  const searchTerm = searchInput.value.toLowerCase();
  if (searchTerm) {
      filteredProducts = filteredProducts.filter(product => 
          product.name.toLowerCase().includes(searchTerm) ||
          product.description.toLowerCase().includes(searchTerm)
      );
  }
  
  // Category filter
  const selectedCategories = Array.from(document.querySelectorAll('input[name="category"]:checked')).map(cb => cb.value);
  if (selectedCategories.length > 0) {
      filteredProducts = filteredProducts.filter(product => 
          selectedCategories.includes(product.category)
      );
  }
  
  // Brand filter
  const selectedBrands = Array.from(document.querySelectorAll('input[name="brand"]:checked')).map(cb => cb.value);
  if (selectedBrands.length > 0) {
      filteredProducts = filteredProducts.filter(product => 
          selectedBrands.includes(product.brand)
      );
  }
  
  // Rating filter
  const selectedRating = document.querySelector('input[name="rating"]:checked');
  if (selectedRating) {
      const minRating = parseFloat(selectedRating.value);
      filteredProducts = filteredProducts.filter(product => 
          product.rating >= minRating
      );
  }
  
  // Price filter
  const maxPriceValue = parseInt(priceRange.value);
  filteredProducts = filteredProducts.filter(product => 
      product.price <= maxPriceValue
  );
  
  // Display filtered products
  displayProducts(filteredProducts);
}

// Event listeners for all filter changes
searchInput.addEventListener('input', filterProducts);
priceRange.addEventListener('input', () => {
  updatePriceDisplay();
  filterProducts();
});

// Add event listeners to all checkboxes and radio buttons
document.querySelectorAll('input[type="checkbox"], input[type="radio"]').forEach(input => {
  input.addEventListener('change', filterProducts);
});

// Reset filters
resetFiltersBtn.addEventListener('click', () => {
  // Reset all filters
  document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
      checkbox.checked = false;
  });
  document.querySelectorAll('input[type="radio"]').forEach(radio => {
      radio.checked = false;
  });
  priceRange.value = 500000;
  updatePriceDisplay();
  searchInput.value = '';
  
  // Show all products
  displayProducts(allProducts);
});

// Function to display products
function displayProducts(products) {
  productsListing.innerHTML = '';
  
  if (products.length === 0) {
      productsListing.innerHTML = '<div class="no-products">No products found matching your criteria.</div>';
      return;
  }
  
  products.forEach(product => {
      const productCard = document.createElement('div');
      productCard.className = 'product-card';
      productCard.style.height = 'auto'; // Ensure consistent height
      
      productCard.innerHTML = `
          <div class="product-image">
              <img src="${product.image}" alt="${product.name}">
          </div>
          <div class="product-info">
              <div class="product-category">${product.category}</div>
              <h3 class="product-title">${product.name}</h3>
              <p class="product-desc">${product.description}</p>
              <div class="product-price">₦${product.price.toLocaleString()}</div>
          </div>
      `;
      productsListing.appendChild(productCard);
  });
}

// Initialize the page
window.addEventListener('DOMContentLoaded', () => {
  // Set initial price display
  updatePriceDisplay();
  
  // Display all products initially
  displayProducts(allProducts);
  
  // Current year in footer
  document.getElementById('currentYear').textContent = new Date().getFullYear();
  
  // Scroll to top button
  const scrollToTopBtn = document.getElementById('scrollToTop');
  window.addEventListener('scroll', () => {
      if (window.pageYOffset > 300) {
          scrollToTopBtn.style.opacity = '1';
          scrollToTopBtn.style.visibility = 'visible';
      } else {
          scrollToTopBtn.style.opacity = '0';
          scrollToTopBtn.style.visibility = 'hidden';
      }
  });
  
  scrollToTopBtn.addEventListener('click', () => {
      window.scrollTo({
          top: 0,
          behavior: 'smooth'
      });
  });
});

// Additional styling for better UX
document.addEventListener('DOMContentLoaded', () => {
  // Add hover effect to filter sections
  document.querySelectorAll('.filter-section').forEach(section => {
      section.addEventListener('mouseenter', () => {
          section.style.borderBottom = '1px solid var(--tzedek-green)';
      });
      section.addEventListener('mouseleave', () => {
          section.style.borderBottom = 'none';
      });
  });
  
  // Add animation to product cards
  document.querySelectorAll('.product-card').forEach(card => {
      card.addEventListener('mouseenter', () => {
          card.style.transform = 'translateY(-5px)';
          card.style.boxShadow = '0 10px 15px rgba(0,0,0,0.1)';
      });
      card.addEventListener('mouseleave', () => {
          card.style.transform = 'translateY(0)';
          card.style.boxShadow = '0 4px 6px rgba(0,0,0,0.05)';
      });
  });
});