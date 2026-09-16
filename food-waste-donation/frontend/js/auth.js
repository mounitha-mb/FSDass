const API_BASE = 'https://fsdass.onrender.com/api';

document.addEventListener('DOMContentLoaded', () => {
  const registerForm = document.getElementById('registerForm');
  const loginForm = document.getElementById('loginForm');

  if (registerForm) {
    registerForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const formData = new FormData(registerForm);
      const payload = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        password: formData.get('password'),
        role: formData.get('role')
      };

      try {
        const response = await fetch(`${API_BASE}/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        const data = await response.json();
        showMessage('registerMessage', data.message || 'Registration successful', !response.ok);

        if (response.ok) {
          setTimeout(() => {
            window.location.href = 'login.html';
          }, 700);
        }
      } catch (error) {
        showMessage('registerMessage', 'Server error. Try again.', true);
      }
    });
  }

  if (loginForm) {
    loginForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const formData = new FormData(loginForm);
      const payload = {
        email: formData.get('email'),
        password: formData.get('password')
      };

      try {
        const response = await fetch(`${API_BASE}/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        const data = await response.json();
        if (!response.ok) {
          showMessage('loginMessage', data.message || 'Login failed', true);
          return;
        }

        localStorage.setItem('foodshareUser', JSON.stringify({
          email: data.user.email,
          role: data.user.role,
          name: data.user.name
        }));

        if (data.user.role === 'Donor') {
          window.location.href = 'donor-dashboard.html';
        } else {
          window.location.href = 'receiver-dashboard.html';
        }
      } catch (error) {
        showMessage('loginMessage', 'Server error. Try again.', true);
      }
    });
  }
});

function showMessage(elementId, message, isError = false) {
  const el = document.getElementById(elementId);
  if (el) {
    el.textContent = message;
    el.style.color = isError ? '#c35050' : '#174f31';
  }
}
