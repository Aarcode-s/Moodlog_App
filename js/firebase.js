import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-storage.js";

// ✅ Updated Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCBBIrld9-eNV9lmwS00m1I-n_GUt1c1hA",
  authDomain: "mood-log-2025.firebaseapp.com",
  projectId: "mood-log-2025",
  storageBucket: "mood-log-2025.appspot.com", // ✅ Corrected from firebasestorage.app
  messagingSenderId: "566685928782",
  appId: "1:566685928782:web:922ecf021ce0e44069a21f"
};

// ✅ Initialize app and services
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app); // will remain unused since you're using localStorage for images

export { auth, db, storage };
