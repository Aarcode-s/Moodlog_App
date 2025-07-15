// register.js
import { signUp } from './auth.js';

document.addEventListener('DOMContentLoaded', () => {
  const signupBtn = document.querySelector('.signup');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const confirmPasswordInput = document.getElementById('confirm-password');

  signupBtn.addEventListener('click', async () => {
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    const confirmPassword = confirmPasswordInput.value.trim();

    if (!email || !password || !confirmPassword) {
      alert('Please fill in all fields.');
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords don't match.");
      return;
    }

    signupBtn.disabled = true;
    signupBtn.textContent = 'Signing up...';

    try {
      await signUp(email, password);
      alert('Registration successful!');
      window.location.href = 'index.html';
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        alert('This email is already registered.');
      } else if (error.code === 'auth/invalid-email') {
        alert('Invalid email format.');
      } else if (error.code === 'auth/weak-password') {
        alert('Password should be at least 6 characters.');
      } else {
        alert(`Error: ${error.message}`);
      }
    } finally {
      signupBtn.disabled = false;
      signupBtn.textContent = 'Sign Up';
    }
  });
});
