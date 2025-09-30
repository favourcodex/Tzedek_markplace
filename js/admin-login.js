// Admin Login Script
(function() {
	const apiBase = '/api';

	function setAuthToken(token, user) {
		localStorage.setItem('authToken', token);
		localStorage.setItem('user', JSON.stringify(user));
	}

	async function handleAdminLogin(event) {
		event.preventDefault();
		const form = event.target;
		const email = form.querySelector('input[name="email"]').value.trim();
		const password = form.querySelector('input[name="password"]').value;

		const submitBtn = form.querySelector('button[type="submit"]');
		submitBtn.disabled = true;
		submitBtn.textContent = 'Signing in...';

		try {
			const response = await fetch(`${apiBase}/auth/login`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email, password })
			});

			const data = await response.json();

			if (!response.ok) {
				showMessage(data.message || 'Login failed', 'error');
				return;
			}

			if (!data.user || data.user.role !== 'admin') {
				showMessage('Access denied. Admin account required.', 'error');
				return;
			}

			setAuthToken(data.token, data.user);
			showMessage('Login successful. Redirecting...', 'success');
			setTimeout(() => { window.location.href = '/html/admin-dashboard.html'; }, 800);
		} catch (err) {
			showMessage('Network error. Please try again.', 'error');
		} finally {
			submitBtn.disabled = false;
			submitBtn.textContent = 'Sign In';
		}
	}

	function showMessage(text, type) {
		const el = document.getElementById('admin-login-message');
		if (!el) return;
		el.textContent = text;
		el.className = `login-message ${type}`;
		el.style.display = 'block';
	}

	document.addEventListener('DOMContentLoaded', function() {
		const form = document.getElementById('admin-login-form');
		if (form) {
			form.addEventListener('submit', handleAdminLogin);
		}
	});
})();
