import { auth } from './firebase.js';
import {
  doc,
  getFirestore,
  setDoc,
  getDoc,
  collection,
  getDocs
} from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js';

// Initialize Firestore
const db = getFirestore();

document.addEventListener('DOMContentLoaded', () => {
  const nameInput = document.getElementById('username');
  const emailInput = document.getElementById('useremail');
  const editButton = document.getElementById('save-profile');
  const imageInput = document.getElementById('image-upload');
  const profileImg = document.getElementById('profile-image');
  const moodSummaryEl = document.querySelector('.mood-summary');
  const totalLogsEl = document.querySelectorAll('.info-tile')[0];
  const sinceEl = document.querySelectorAll('.info-tile')[1];

  // Load profile image from localStorage
  const storedImage = localStorage.getItem('profile-image');
  if (storedImage) {
    profileImg.src = storedImage;
  }

  auth.onAuthStateChanged(async (user) => {
    if (!user) {
      window.location.href = 'login.html';
      return;
    }

    const uid = user.uid;
    const userRef = doc(db, 'users', uid);

    try {
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        nameInput.value = data.name || '';
        emailInput.value = data.email || user.email;
      } else {
        emailInput.value = user.email;
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }

    // Save name and email
    editButton.addEventListener('click', async () => {
      const updatedName = nameInput.value.trim();
      const updatedEmail = emailInput.value.trim();

      try {
        await setDoc(userRef, {
          name: updatedName,
          email: updatedEmail,
        }, { merge: true });

        alert('Profile updated successfully!');
      } catch (error) {
        alert('Failed to update profile: ' + error.message);
      }
    });

    // Handle image upload and save to localStorage
    imageInput.addEventListener('change', function () {
      const file = this.files[0];
      if (!file || !file.type.startsWith('image/')) {
        alert('Please select a valid image.');
        return;
      }

      const reader = new FileReader();
      reader.onload = function () {
        const base64 = reader.result;
        profileImg.src = base64;
        localStorage.setItem('profile-image', base64);
      };
      reader.readAsDataURL(file);
    });

    // Load stats: mood, total logs, since
    await loadLogStats(uid);
  });

  // Trigger file input on image click
  document.getElementById('profile-photo').addEventListener('click', () => {
    document.getElementById('image-upload').click();
  });

  // Mood emoji map
  const emojiMap = {
    happy: '😄',
    sad: '😢',
    angry: '😠',
    excited: '🤩',
    calm: '😌',
    anxious: '😰',
    tired: '😴',
    neutral: '😐'
  };

  // ✅ Updated general mood logic
  async function loadLogStats(uid) {
    try {
      const logsRef = collection(db, 'users', uid, 'logs');
      const logSnap = await getDocs(logsRef);

      const logs = [];
      logSnap.forEach(doc => logs.push(doc.data()));

      if (logs.length === 0) {
        moodSummaryEl.innerHTML = '😐<br/>General Mood';
        totalLogsEl.textContent = 'Total logs: 0';
        sinceEl.textContent = 'Since -';
        return;
      }

      // ✅ Count moods
      const moodCounts = logs.reduce((acc, log) => {
        const mood = log.mood;
        if (mood) {
          acc[mood] = (acc[mood] || 0) + 1;
        }
        return acc;
      }, {});

      // ✅ Determine top mood
      let topMood = 'neutral';
      let maxCount = 0;

      for (const [mood, count] of Object.entries(moodCounts)) {
        if (count > maxCount) {
          maxCount = count;
          topMood = mood;
        }
      }

      const moodEmoji = emojiMap[topMood] || '😐';
      moodSummaryEl.innerHTML = `${moodEmoji}<br/>General Mood`;

      totalLogsEl.textContent = `Total logs: ${logs.length}`;

      // ✅ Find first log date
      const sortedLogs = logs
        .filter(log => log.date)
        .sort((a, b) => new Date(a.date) - new Date(b.date));

      if (sortedLogs.length > 0) {
        const firstDate = new Date(sortedLogs[0].date);
        const formatted = firstDate.toLocaleDateString('en-GB'); // dd/mm/yyyy
        sinceEl.textContent = `Since ${formatted}`;
      } else {
        sinceEl.textContent = 'Since -';
      }
    } catch (error) {
      console.error('Error loading log stats:', error);
      moodSummaryEl.innerHTML = '⚠️<br/>Error';
      totalLogsEl.textContent = 'Total logs: -';
      sinceEl.textContent = 'Since -';
    }
  }
});
