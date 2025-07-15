// js/auth.js
import { auth } from './firebase.js';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

// Signup logic
export function signUp(email, password) {
  return createUserWithEmailAndPassword(auth, email, password);
}

// Login logic
export function login(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

// Logout logic
export function logout() {
  return signOut(auth);
}
