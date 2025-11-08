document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menuToggle');
    const mobileNav = document.getElementById('mobileNav');
    const menuIcon = document.querySelector('.menu-icon');
    const closeIcon = document.querySelector('.close-icon');

    menuToggle.addEventListener('click', function() {
        const isMenuOpen = mobileNav.classList.contains('show');
        
        // Toggle menu visibility
        mobileNav.classList.toggle('show');
        menuIcon.classList.toggle('hidden');
        closeIcon.classList.toggle('hidden');
        
        // Toggle body scroll
        document.body.style.overflow = isMenuOpen ? 'auto' : 'hidden';
    });

    // Close menu when clicking a link
    document.querySelectorAll('.mobile-nav .nav-link').forEach(link => {
        link.addEventListener('click', function() {
            mobileNav.classList.remove('show');
            menuIcon.classList.remove('hidden');
            closeIcon.classList.add('hidden');
            document.body.style.overflow = 'auto';
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!menuToggle.contains(event.target) && 
            !mobileNav.contains(event.target) && 
            mobileNav.classList.contains('show')) {
            mobileNav.classList.remove('show');
            menuIcon.classList.remove('hidden');
            closeIcon.classList.add('hidden');
            document.body.style.overflow = 'auto';
        }
    });
});