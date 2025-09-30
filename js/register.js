document.addEventListener('DOMContentLoaded', function() {
    const signupToggle = document.getElementById('signup-toggle');
    const signinToggle = document.getElementById('signin-toggle');
    const signupForm = document.getElementById('signup-form');
    const signinForm = document.getElementById('signin-form');
    const welcomeText = document.getElementById('welcome-text');
    
    signupToggle.addEventListener('click', function() {
        signupToggle.classList.add('active');
        signupToggle.classList.add('text-[#4CAF50]');
        signupToggle.classList.remove('text-gray-500');
        
        signinToggle.classList.remove('active');
        signinToggle.classList.remove('text-[#4CAF50]');
        signinToggle.classList.add('text-gray-500');
        
        signupForm.classList.remove('hidden-form');
        signupForm.classList.add('visible-form');
        signinForm.classList.remove('visible-form');
        signinForm.classList.add('hidden-form');
        
        welcomeText.textContent = "Welcome to Tzedek";
        welcomeText.classList.remove('text-white');
        welcomeText.classList.add('text-gray-800');
    });
    
    signinToggle.addEventListener('click', function() {
        signinToggle.classList.add('active');
        signinToggle.classList.add('text-[#4CAF50]');
        signinToggle.classList.remove('text-gray-500');
        
        signupToggle.classList.remove('active');
        signupToggle.classList.remove('text-[#4CAF50]');
        signupToggle.classList.add('text-gray-500');
        
        signinForm.classList.remove('hidden-form');
        signinForm.classList.add('visible-form');
        signupForm.classList.remove('visible-form');
        signupForm.classList.add('hidden-form');
        
        welcomeText.textContent = "Welcome Back";
        welcomeText.classList.remove('text-gray-800');
        welcomeText.classList.add('text-black');
    });
});