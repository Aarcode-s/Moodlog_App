// login.js
import { login } from './auth.js';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const submitBtn = form.querySelector('button[type="submit"]');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (!email || !password) {
      alert('Please enter both email and password.');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Logging in...';

    try {
      await login(email, password);
      alert('Login successful!');
      window.location.href = 'profile.html';
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        alert('No user found with that email.');
      } else if (error.code === 'auth/wrong-password') {
        alert('Incorrect password.');
      } else if (error.code === 'auth/invalid-email') {
        alert('Invalid email format.');
      } else {
        alert(`Login failed: ${error.message}`);
      }
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Login';
    }
  });
});
