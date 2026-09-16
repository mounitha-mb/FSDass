const API_BASE = 'https://fsdass.onrender.com/api';

function showMessage(elementId, message, isError = false) {
  const el = document.getElementById(elementId);
  if (el) {
    el.textContent = message;
    el.style.color = isError ? 'var(--danger)' : 'var(--green-dark)';
  }
}

function getCurrentUser() {
  return JSON.parse(localStorage.getItem('foodshareUser')) || {};
}

function logoutUser() {
  localStorage.removeItem('foodshareUser');
  window.location.href = 'login.html';
}

document.addEventListener('DOMContentLoaded', () => {
  const logoutLink = document.getElementById('logoutLink');
  if (logoutLink) {
    logoutLink.addEventListener('click', (event) => {
      event.preventDefault();
      logoutUser();
    });
  }
});
