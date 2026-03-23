import { auth, db } from './firebase.js';
import {
  doc,
  setDoc
} from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js';

document.addEventListener('DOMContentLoaded', () => {
  const moodImages = document.querySelectorAll('.moodpart img');
  const gratitudeInputs = document.querySelectorAll('.gratitude input');
  const logForm = document.querySelector('.logbook');
  const logTextarea = document.querySelector('.textarea');

  let selectedMood = null;

  // Set today's date and short month name dynamically
  const monthDiv = document.querySelector('.month');
  const dateDiv = document.querySelector('.date');

  const today = new Date();
  const shortMonthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  monthDiv.textContent = shortMonthNames[today.getMonth()];
  dateDiv.textContent = today.getDate();

  // Handle emoji selection
  moodImages.forEach(img => {
    img.addEventListener('click', () => {
      moodImages.forEach(i => i.classList.remove('selected'));
      img.classList.add('selected');
      selectedMood = img.alt.toLowerCase(); // e.g., "happy", "sad"
    });
  });

  // Save log
  logForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const saveButton = logForm.querySelector('.button');
    saveButton.disabled = true;
    saveButton.textContent = 'Saving...';

    if (!selectedMood) {
      alert('Please select your mood!');
      saveButton.disabled = false;
      saveButton.textContent = 'Save';
      return;
    }

    const gratitude = Array.from(gratitudeInputs)
      .map(input => input.value.trim())
      .filter(val => val !== '');

    const logText = logTextarea.value.trim();

    if (!logText) {
      alert('Please write something in your log.');
      saveButton.disabled = false;
      saveButton.textContent = 'Save';
      return;
    }

    const dateId = today.toISOString().split('T')[0]; // YYYY-MM-DD

    auth.onAuthStateChanged(async (user) => {
      if (!user) {
        window.location.href = 'login.html';
        return;
      }

      const logRef = doc(db, 'users', user.uid, 'logs', dateId);

      try {
        await setDoc(logRef, {
          mood: selectedMood,
          gratitude,
          text: logText,
          date: today.toISOString()
        });

        alert('Log saved successfully!');
        logForm.reset();
        gratitudeInputs.forEach(input => input.value = '');
        moodImages.forEach(i => i.classList.remove('selected'));
        selectedMood = null;
      } catch (error) {
        console.error('Error saving log:', error);
        alert('Failed to save your log. Try again later.');
      } finally {
        saveButton.disabled = false;
        saveButton.textContent = 'Save';
      }
    });
  });
});
