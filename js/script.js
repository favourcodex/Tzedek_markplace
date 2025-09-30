document.addEventListener('DOMContentLoaded', function() {
  // Accordion functionality
document.addEventListener('DOMContentLoaded', function() {
  const accordionHeaders = document.querySelectorAll('.accordion-header');
  
  accordionHeaders.forEach(header => {
    header.addEventListener('click', function() {
      const content = this.nextElementSibling;
      const icon = this.querySelector('i');
      
      // Close all other accordion items
      document.querySelectorAll('.accordion-content').forEach(item => {
        if (item !== content) {
          item.style.display = 'none';
        }
      });
      document.querySelectorAll('.accordion-header').forEach(h => {
        if (h !== this) h.classList.remove('active');
      });
      document.querySelectorAll('.accordion-header i').forEach(i => {
        if (i !== icon) i.className = 'fas fa-chevron-down transition-transform duration-300';
      });
      
      // Toggle current accordion item
      if (content.style.display === 'block') {
        content.style.display = 'none';
        icon.className = 'fas fa-chevron-down transition-transform duration-300';
        this.classList.remove('active');
      } else {
        content.style.display = 'block';
        icon.className = 'fas fa-chevron-down transition-transform duration-300';
        this.classList.add('active');
      }
    });
  });
});
  accordionHeaders.forEach(header => {
    header.addEventListener('click', function() {
      const content = this.nextElementSibling;
      const icon = this.querySelector('i');
      
      // Close all other accordion items
      document.querySelectorAll('.accordion-content').forEach(item => {
        if (item !== content) {
          item.style.display = 'none';
        }
      });
      
      document.querySelectorAll('.accordion-header i').forEach(i => {
        if (i !== icon) {
          i.className = 'fas fa-chevron-down';
        }
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

  // Contact form submission
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');
  
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Get form data
      const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value
      };
      
      // Log form data (in a real app, you'd send this to a server)
      console.log('Form submitted:', formData);
      
      // Show success message
      formSuccess.classList.remove('hidden');
      
      // Reset form
      contactForm.reset();
      
      // Hide success message after 5 seconds
      setTimeout(function() {
        formSuccess.classList.add('hidden');
      }, 5000);
    });
  }

  // Set current year in footer
  const currentYearElement = document.getElementById('currentYear');
  if (currentYearElement) {
    currentYearElement.textContent = new Date().getFullYear();
  }

  // Scroll to top button
  const scrollToTopButton = document.getElementById('scrollToTop');
  
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


  let lastScrollY = window.scrollY;

window.addEventListener('scroll', function() {
  const elements = document.querySelectorAll('.animate-fade-in');
  const scrollingDown = window.scrollY > lastScrollY;
  lastScrollY = window.scrollY;

  if (scrollingDown) {
    elements.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (
        rect.top < window.innerHeight - 50 && // 50px before bottom
        !el.classList.contains('visible')
      ) {
        el.classList.add('visible');
      }
    });
  }
});
  // Initial check
  checkScroll();
  
  // Check on scroll
  window.addEventListener('scroll', checkScroll);
});


 // Preloader functionality
document.addEventListener('DOMContentLoaded', function() {
    // Simulate loading progress
    let progress = 0;
    const progressBar = document.getElementById('progress-bar');
    const preloader = document.getElementById('preloader');
    
    const progressInterval = setInterval(() => {
        progress += Math.random() * 10;
        if (progress > 100) progress = 100;
        progressBar.style.width = progress + '%';
        
        if (progress >= 100) {
            clearInterval(progressInterval);
            setTimeout(() => {
                preloader.style.opacity = '0';
                setTimeout(() => {
                    preloader.style.display = 'none';
                }, 500);
            }, 300);
        }
    }, 100);
});

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
        setTimeout(() => {
            loader.remove();
        }, 300);
    }
}