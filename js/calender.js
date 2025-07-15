import { auth, db } from './firebase.js';
import {
  collection,
  getDocs
} from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js';

const calendarEl = document.getElementById("calendar");
const overlay = document.getElementById("overlay");
const logTile = document.getElementById("logTile");
const tileDate = document.getElementById("tileDate");
const tileEmoji = document.getElementById("tileEmoji");
const gratitudeList = document.getElementById("gratitudeList");
const logText = document.getElementById("logText");

const today = new Date();
const year = today.getFullYear();
const month = today.getMonth();
const firstDay = new Date(year, month, 1).getDay();
const daysInMonth = new Date(year, month + 1, 0).getDate();

const moodLogs = {}; // store mood logs fetched from Firestore

auth.onAuthStateChanged(async user => {
  if (!user) {
    window.location.href = 'login.html';
    return;
  }

  const logsRef = collection(db, 'users', user.uid, 'logs');
  const logsSnapshot = await getDocs(logsRef);

  if (logsSnapshot.empty) {
    console.warn("No logs found in Firestore.");
  }

  logsSnapshot.forEach(docSnap => {
    const log = docSnap.data();
    const date = docSnap.id;

    console.log("📅 Log Fetched:", { date, log });

    moodLogs[date] = {
      emoji: getEmojiForMood(log.mood),
      gratitude: Array.isArray(log.gratitude) ? log.gratitude : [],
      log: log.text || ""
    };
  });

  console.log("✅ All Logs:", moodLogs);

  generateCalendar();
});

function getEmojiForMood(mood) {
  const map = {
    happy: '😊',
    cool: '😎',
    sad: '☹️',
    cry: '😭',
    neutral: '😐'
  };
  return map[mood] || '😶'; // fallback if mood is unknown or missing
}

function generateCalendar() {
  calendarEl.innerHTML = ''; // clear previous content

  // Padding days
  for (let i = 0; i < firstDay; i++) {
    const empty = document.createElement("div");
    calendarEl.appendChild(empty);
  }

  for (let date = 1; date <= daysInMonth; date++) {
    const fullDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`;
    const logEntry = moodLogs[fullDate];
    const emoji = logEntry?.emoji || "😶";

    const day = document.createElement("div");
    day.classList.add("day");

    day.innerHTML = `
      <div class="tile-header">
        <span class="day-number">${String(date).padStart(2, '0')}</span>
        <span class="day-label">${new Date(year, month, date).toLocaleDateString("en-US", { weekday: 'short' })}</span>
      </div>
      <div class="tile-emoji">${emoji}</div>
    `;

    if (logEntry) {
      day.addEventListener("click", () => openTile(fullDate));
    }

    calendarEl.appendChild(day);
  }
}

function openTile(date) {
  const entry = moodLogs[date];
  if (!entry) return;

  tileDate.innerHTML = `${date} <span>${entry.emoji}</span>`;
  tileEmoji.textContent = entry.emoji;
  gratitudeList.innerHTML = "";
  logText.textContent = `"${entry.log}"`;

  entry.gratitude.forEach(item => {
    const li = document.createElement("li");
    li.textContent = item;
    gratitudeList.appendChild(li);
  });

  overlay.classList.remove("hidden");
  logTile.classList.remove("hidden");
}

window.closeTile = function () {
  overlay.classList.add("hidden");
  logTile.classList.add("hidden");
};

document.querySelector('.title').textContent = new Date().toLocaleString('en-US', {
  month: 'long',
  year: 'numeric'
});
