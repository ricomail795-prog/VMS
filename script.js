// Firebase Setup
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyJbJBgNdLO6oGKcZTjxD7edp8Jq-_0w",
  authDomain: "vms-app-6a0c3.firebaseapp.com",
  projectId: "vms-app-6a0c3",
  storageBucket: "vms-app-6a0c3.appspot.com",
  messagingSenderId: "868366477824",
  appId: "1:868366477824:web:85588a6d013a372f0606e5",
  measurementId: "G-NBZBPJQ3QR"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Banner notifications
function showBanner(message, type = "info") {
  const bar = document.getElementById("banner");
  if (!bar) return;
  bar.textContent = message;
  bar.className = "banner " + type;
  bar.style.display = "block";
  setTimeout(() => bar.style.display = "none", 3000);
}

// Toggle auth sections
window.toggleSection = function(sectionId) {
  document.querySelectorAll(".auth-section").forEach(sec => sec.style.display = "none");
  const target = document.getElementById(sectionId);
  if (target) target.style.display = "block";
};

// Login
const loginForm = document.getElementById("login-form");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;
    try {
      await signInWithEmailAndPassword(auth, email, password);
      showBanner("Login successful", "success");
      window.location.href = "dashboard.html";
    } catch (error) {
      showBanner(error.message, "error");
    }
  });
}

// Register
const registerForm = document.getElementById("register-form");
if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("register-email").value;
    const password = document.getElementById("register-password").value;
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      showBanner("Account created. Please check your email for verification.", "success");
      toggleSection("login-form");
    } catch (error) {
      showBanner(error.message, "error");
    }
  });
}

// Reset Password
const resetForm = document.getElementById("reset-form");
if (resetForm) {
  resetForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("reset-email").value;
    try {
      await sendPasswordResetEmail(auth, email);
      showBanner("Password reset email sent.", "success");
      toggleSection("login-form");
    } catch (error) {
      showBanner(error.message, "error");
    }
  });
}

// Logout
const logoutBtn = document.getElementById("logout-btn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    try {
      await signOut(auth);
      window.location.href = "index.html";
    } catch (error) {
      showBanner(error.message, "error");
    }
  });
}
