// Mobile menu toggle functionality
const menuToggle = document.getElementById('menuToggle');
const mobileNav = document.getElementById('mobileNav');
const menuIcon = document.querySelector('.menu-icon');
const closeIcon = document.querySelector('.close-icon');

// Function to close mobile menu
const closeMobileMenu = () => {
    mobileNav.classList.add('hidden');
    mobileNav.classList.remove('show');
    menuIcon.classList.remove('hidden');
    closeIcon.classList.add('hidden');
};

// Toggle menu on button click
menuToggle.addEventListener('click', (e) => {
    e.stopPropagation(); // Prevent event from bubbling to document
    // Toggle mobile nav visibility
    mobileNav.classList.toggle('hidden');
    mobileNav.classList.toggle('show');
    
    // Toggle icons
    menuIcon.classList.toggle('hidden');
    closeIcon.classList.toggle('hidden');
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    const navbar = document.querySelector('.navbar');
    if (!navbar.contains(e.target) && mobileNav.classList.contains('show')) {
        closeMobileMenu();
    }
});

// Close mobile menu when clicking a nav link
document.querySelectorAll('.mobile-nav .nav-link').forEach(link => {
    link.addEventListener('click', () => {
        closeMobileMenu();
    });
});

// Close mobile menu when window is resized to desktop size
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        closeMobileMenu();
    }
});