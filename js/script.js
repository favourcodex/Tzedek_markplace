document.addEventListener('DOMContentLoaded', function() {
  // ===============================
  // Accordion functionality
  // ===============================
  const accordionHeaders = document.querySelectorAll('.accordion-header');
  
  accordionHeaders.forEach(header => {
    header.addEventListener('click', function() {
      const content = this.nextElementSibling;
      const icon = this.querySelector('i');
      
      // Close all other accordion items
      document.querySelectorAll('.accordion-content').forEach(item => {
        if (item !== content) item.style.display = 'none';
      });
      document.querySelectorAll('.accordion-header i').forEach(i => {
        if (i !== icon) i.className = 'fas fa-chevron-down';
      });

      // Toggle current accordion item
      if (content.style.display === 'block') {
        content.style.display = 'none';
        icon.className = 'fas fa-chevron-down';
      } else {
        content.style.display = 'block';
        icon.className = 'fas fa-chevron-up';
      }
    });
  });

  // ===============================
  // Contact form submission
  // ===============================
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');
  
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value
      };
      
      console.log('Form submitted:', formData);
      formSuccess.classList.remove('hidden');
      contactForm.reset();
      
      setTimeout(() => {
        formSuccess.classList.add('hidden');
      }, 5000);
    });
  }

  // ===============================
  // Set current year in footer
  // ===============================
  const currentYearElement = document.getElementById('currentYear');
  if (currentYearElement) {
    currentYearElement.textContent = new Date().getFullYear();
  }

  // ===============================
  // Scroll to top button
  // ===============================
  const scrollToTopButton = document.getElementById('scrollToTop');
  if (scrollToTopButton) {
    window.addEventListener('scroll', function() {
      if (window.pageYOffset > 300) {
        scrollToTopButton.classList.add('show');
      } else {
        scrollToTopButton.classList.remove('show');
      }
    });
    
    scrollToTopButton.addEventListener('click', function() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // ===============================
  // Scroll-based animations
  // ===============================
  let lastScrollY = window.scrollY;
  const animateOnScroll = () => {
    const elements = document.querySelectorAll('.animate-fade-in');
    const scrollingDown = window.scrollY > lastScrollY;
    lastScrollY = window.scrollY;

    if (scrollingDown) {
      elements.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight - 50 && !el.classList.contains('visible')) {
          el.classList.add('visible');
        }
      });
    }
  };
  
  window.addEventListener('scroll', animateOnScroll);
  animateOnScroll(); // Initial check
});

// ===============================
// Preloader functionality
// ===============================
document.addEventListener('DOMContentLoaded', function() {
  let progress = 0;
  const progressBar = document.getElementById('progress-bar');
  const preloader = document.getElementById('preloader');
  
  const progressInterval = setInterval(() => {
    progress += Math.random() * 10;
    if (progress > 100) progress = 100;
    if (progressBar) progressBar.style.width = progress + '%';
    
    if (progress >= 100) {
      clearInterval(progressInterval);
      setTimeout(() => {
        if (preloader) {
          preloader.style.opacity = '0';
          setTimeout(() => preloader.style.display = 'none', 500);
        }
      }, 300);
    }
  }, 100);
});

// ===============================
// Processing Loader
// ===============================
function showProcessingLoader(message) {
  const preloader = document.createElement('div');
  preloader.id = 'processing-loader';
  preloader.className = 'fixed inset-0 bg-white bg-opacity-80 flex flex-col items-center justify-center z-50';
  preloader.innerHTML = `
    <div class="text-center">
      <div class="w-16 h-16 border-4 border-[#4CAF50] border-t-transparent rounded-full animate-spin mb-4"></div>
      <p class="text-[#4CAF50] font-medium">${message}</p>
    </div>
  `;
  document.body.appendChild(preloader);
}

function hideProcessingLoader() {
  const loader = document.getElementById('processing-loader');
  if (loader) {
    loader.style.opacity = '0';
    setTimeout(() => loader.remove(), 300);
  }
}
