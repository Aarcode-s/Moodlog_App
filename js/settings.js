import { auth, db } from './firebase.js';
import { deleteDoc, doc, collection, getDocs } from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js';
import { logout } from './auth.js';

document.addEventListener('DOMContentLoaded', () => {
  const logoutBtn = document.querySelector('.logout');
  const deleteAccountBtn = document.querySelector('.deleteaccount');

  // 🔓 Logout using reusable function
  logoutBtn.addEventListener('click', async () => {
    try {
      await logout();
      window.location.href = 'index.html';
    } catch (error) {
      alert('Logout failed.');
      console.error(error);
    }
  });

  // ❌ Delete Account + Optional: delete subcollection logs
  deleteAccountBtn.addEventListener('click', async () => {
    const confirmDelete = confirm("Are you sure you want to permanently delete your account?");
    if (!confirmDelete) return;

    const user = auth.currentUser;

    if (!user) {
      alert('No user found. Please log in again.');
      window.location.href = 'index.html';
      return;
    }

    try {
      const uid = user.uid;

      // OPTIONAL: delete logs subcollection
      const logsRef = collection(db, 'users', uid, 'logs');
      const logsSnap = await getDocs(logsRef);
      const deletePromises = logsSnap.docs.map(docSnap => deleteDoc(docSnap.ref));
      await Promise.all(deletePromises);

      // Delete main user doc
      await deleteDoc(doc(db, 'users', uid));

      // Delete Firebase Auth account
      await user.delete();

      alert("Account deleted successfully.");
      window.location.href = 'register.html';
    } catch (error) {
      if (error.code === 'auth/requires-recent-login') {
        alert('Please log in again to delete your account.');
        window.location.href = 'login.html';
      } else {
        alert('Error deleting account.');
        console.error(error);
      }
    }
  });
});
