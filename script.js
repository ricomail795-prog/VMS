/****************************************************
 * Firebase Setup
 ****************************************************/
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  signOut
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

// 🔑 Replace with your Firebase config (from console)
const firebaseConfig = {
  apiKey: "AIzaSyDJ8bqNdL06oGKcZTjxD17edp8Jq_0w",
  authDomain: "vms-app-6a0c3.firebaseapp.com",
  projectId: "vms-app-6a0c3",
  storageBucket: "vms-app-6a0c3.appspot.com",
  messagingSenderId: "863866477824",
  appId: "1:863866477824:web:05588a6d013a372f6066e5",
  measurementId: "G-NBZBPJQ3QR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

/****************************************************
 * Banner Notifications
 ****************************************************/
function showBanner(message, type = "info") {
  const bar = document.getElementById("banner");
  if (!bar) return;

  bar.innerText = message;
  bar.className = `banner ${type}`;
  bar.style.display = "block";
  bar.style.top = "-50px";
  bar.style.opacity = "1";

  // Slide down
  setTimeout(() => {
    bar.style.top = "0";
  }, 50);

  // Auto-hide after 3 seconds
  setTimeout(() => {
    bar.style.top = "-50px";
    setTimeout(() => {
      bar.style.display = "none";
    }, 500);
  }, 3000);
}

/****************************************************
 * Auth Form Toggling
 ****************************************************/
document.addEventListener("DOMContentLoaded", () => {
  const loginSection = document.getElementById("login-section");
  const registerSection = document.getElementById("register-section");
  const resetSection = document.getElementById("reset-section");

  const showRegister = document.getElementById("show-register");
  const showReset = document.getElementById("show-reset");
  const showLoginFromRegister = document.getElementById("show-login-from-register");
  const showLoginFromReset = document.getElementById("show-login-from-reset");

  function toggleSection(show, ...hide) {
    hide.forEach(sec => sec.style.display = "none");
    show.style.display = "block";
  }

  if (showRegister) {
    showRegister.addEventListener("click", e => {
      e.preventDefault();
      toggleSection(registerSection, loginSection, resetSection);
    });
  }

  if (showReset) {
    showReset.addEventListener("click", e => {
      e.preventDefault();
      toggleSection(resetSection, loginSection, registerSection);
    });
  }

  if (showLoginFromRegister) {
    showLoginFromRegister.addEventListener("click", e => {
      e.preventDefault();
      toggleSection(loginSection, registerSection, resetSection);
    });
  }

  if (showLoginFromReset) {
    showLoginFromReset.addEventListener("click", e => {
      e.preventDefault();
      toggleSection(loginSection, resetSection, registerSection);
    });
  }
});

/****************************************************
 * Auth Handlers
 ****************************************************/

// Register
const registerForm = document.getElementById("register-form");
if (registerForm) {
  registerForm.addEventListener("submit", async e => {
    e.preventDefault();
    const email = document.getElementById("register-email").value;
    const password = document.getElementById("register-password").value;

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(userCredential.user);
      showBanner("✅ Account created! Please verify your email.", "info");
    } catch (error) {
      showBanner("❌ " + error.message, "warning");
    }
  });
}

// Login
const loginForm = document.getElementById("login-form");
if (loginForm) {
  loginForm.addEventListener("submit", async e => {
    e.preventDefault();
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      if (!userCredential.user.emailVerified) {
        showBanner("⚠️ Please verify your email before logging in.", "warning");
        return;
      }
      showBanner("✅ Login successful!", "info");
      window.location.href = "dashboard.html"; // Redirect
    } catch (error) {
      showBanner("❌ " + error.message, "warning");
    }
  });
}

// Reset Password
const resetForm = document.getElementById("reset-form");
if (resetForm) {
  resetForm.addEventListener("submit", async e => {
    e.preventDefault();
    const email = document.getElementById("reset-email").value;

    try {
      await sendPasswordResetEmail(auth, email);
      showBanner("📧 Password reset email sent!", "info");
    } catch (error) {
      showBanner("❌ " + error.message, "warning");
    }
  });
}

// Logout
const logoutBtn = document.getElementById("logout-btn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", async e => {
    e.preventDefault();
    try {
      await signOut(auth);
      showBanner("✅ Logged out successfully", "info");
      window.location.href = "index.html";
    } catch (error) {
      showBanner("❌ " + error.message, "warning");
    }
  });
}
