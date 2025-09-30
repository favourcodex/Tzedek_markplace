document.addEventListener('DOMContentLoaded', function () {
    const quantityElement = document.getElementById('quantity');
    const decreaseButton = document.getElementById('decrease-quantity');
    const increaseButton = document.getElementById('increase-quantity');
    let quantity = 1;
    decreaseButton.addEventListener('click', function () {
        if (quantity > 1) {
            quantity--;
            quantityElement.textContent = quantity;
        }
    });
    increaseButton.addEventListener('click', function () {
        quantity++;
        quantityElement.textContent = quantity;
    });
});
document.addEventListener('DOMContentLoaded', function () {
    const toggleButton = document.getElementById('toggle-description');
    const descriptionContent = document.getElementById('product-description');
    let isExpanded = true;
    toggleButton.addEventListener('click', function () {
        if (isExpanded) {
            descriptionContent.style.display = 'none';
            toggleButton.innerHTML = '<i class="ri-arrow-right-s-line ri-lg"></i>';
        } else {
            descriptionContent.style.display = 'block';
            toggleButton.innerHTML = '<i class="ri-arrow-down-s-line ri-lg"></i>';
        }
        isExpanded = !isExpanded;
    });
});
document.addEventListener('DOMContentLoaded', function () {
    const addToCartButton = document.getElementById('add-to-cart');
    addToCartButton.addEventListener('click', function () {
        const quantity = document.getElementById('quantity').textContent;
        const selectedSize = document.querySelector('input[name="size"]:checked').id.replace('size-', '').toUpperCase();
        const selectedColor = document.querySelector('input[name="color"]:checked').id.replace('color-', '');
        // Create and show the notification
        const notification = document.createElement('div');
        notification.className = 'fixed top-16 left-0 right-0 mx-auto w-4/5 bg-green-100 border border-green-200 text-green-800 px-4 py-3 rounded shadow-md z-50 flex items-center justify-between';
        notification.innerHTML = `
                                <div class="flex items-center">
                                <i class="ri-check-line ri-lg mr-2"></i>
                                <span>Added to cart: ${quantity} × Artisan Leather Crossbody Bag (${selectedSize}, ${selectedColor})</span>
                                </div>
                                <button class="text-green-800">
                                <i class="ri-close-line"></i>
                                </button>`;
        document.body.appendChild(notification);
        // Remove the notification after 3 seconds
        setTimeout(() => {
            notification.classList.add('opacity-0', 'transition-opacity', 'duration-500');
            setTimeout(() => {
                notification.remove();
            }, 500);
        }, 3000);
        // Close button functionality
        const closeButton = notification.querySelector('button');
        closeButton.addEventListener('click', function () {
            notification.remove();
        });
    });
});

// Like button functionality for "You May Also Like"
document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.like-btn').forEach(function (btn) {
        btn.addEventListener('click', function () {
            if (btn.classList.contains('ri-heart-line')) {
                btn.classList.remove('ri-heart-line');
                btn.classList.add('ri-heart-fill');
                btn.classList.add('text-[#4CAF50]');
            } else {
                btn.classList.remove('ri-heart-fill');
                btn.classList.add('ri-heart-line');
                btn.classList.remove('text-[#4CAF50]');
            }
        });
    });
});

// Toggle show/hide phone number inside the button
  const showContactBtn = document.getElementById('showContactBtn');
  const contactNumber = document.getElementById('contactNumber');
  const showContactText = document.getElementById('showContactText');
  let contactVisible = false;

  showContactBtn.addEventListener('click', function() {
    contactVisible = !contactVisible;
    if (contactVisible) {
      contactNumber.style.display = 'inline';
      showContactText.textContent = '';
      showContactBtn.style.minWidth = '180px';
    } else {
      contactNumber.style.display = 'none';
      showContactText.textContent = 'Show contact';
      showContactBtn.style.minWidth = '160px';
    }
  });

  // Popup Alert for Request Call Back
  const popupAlert = document.getElementById('popupAlert');
  const closePopupBtn = document.getElementById('closePopupBtn');
  const popupMsg = document.getElementById('popupMsg');
  document.getElementById('requestCallBtn').addEventListener('click', function() {
    let phone = contactNumber.textContent || '+234 801 234 5678';
    popupMsg.innerHTML = `A call back request will be sent to <b style="color:#4caf50">${phone}</b>.`;
    popupAlert.style.display = 'block';
    // Optionally, send SMS via backend here
  });
  closePopupBtn.addEventListener('click', function() {
    popupAlert.style.display = 'none';
  });
  // Optional: auto-close after 4 seconds
  popupAlert.addEventListener('click', function(e) {
    if (e.target === popupAlert) popupAlert.style.display = 'none';
  });

    // Like notification popup
  document.querySelectorAll('.like-btn').forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      document.getElementById('popupTitle').textContent = 'Added to Favourites!';
      document.getElementById('popupMsg').textContent = 'This product has been added to your favourites.';
      document.getElementById('popupAlert').style.display = 'block';
      setTimeout(() => {
        document.getElementById('popupAlert').style.display = 'none';
      }, 3000);
    });
  });

  // Request call back popup (existing)
  document.getElementById('requestCallBtn')?.addEventListener('click', function() {
    document.getElementById('popupTitle').textContent = 'Successfully sent!';
    document.getElementById('popupMsg').textContent = 'A call back request will be sent to this number.';
    document.getElementById('popupAlert').style.display = 'block';
    setTimeout(() => {
      document.getElementById('popupAlert').style.display = 'none';
    }, 3000);
  });

  // Close popup
  document.getElementById('closePopupBtn').addEventListener('click', function() {
    document.getElementById('popupAlert').style.display = 'none';
  });