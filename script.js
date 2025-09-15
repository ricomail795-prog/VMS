/*************************************************
 * Firebase Setup (v10 Modular)
 *************************************************/
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  sendPasswordResetEmail, 
  signOut 
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyJBdBgNdLO6oGKcZTjxD7edp8Jq-_0w",
  authDomain: "vms-app-6a0c3.firebaseapp.com",
  projectId: "vms-app-6a0c3",
  storageBucket: "vms-app-6a0c3.appspot.com",
  messagingSenderId: "868366477824",
  appId: "1:868366477824:web:05588a6d013a372f0606e5",
  measurementId: "G-NBZBPJQ3QR"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

/*************************************************
 * Section Toggle (Login/Register/Reset)
 *************************************************/
window.toggleSection = function(sectionId) {
  document.querySelectorAll(".auth-section").forEach(sec => sec.style.display = "none");
  const el = document.getElementById(sectionId);
  if (el) el.style.display = "block";
};

/*************************************************
 * Login
 *************************************************/
const loginForm = document.getElementById("login-form");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value;
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("✅ Login successful");
      window.location.href = "dashboard.html";
    } catch (error) {
      alert("❌ " + error.message);
      console.error(error);
    }
  });
}

/*************************************************
 * Register
 *************************************************/
const registerForm = document.getElementById("register-form");
if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("register-email").value.trim();
    const password = document.getElementById("register-password").value;
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("✅ Account created. Please log in.");
      window.toggleSection("login-section");
    } catch (error) {
      alert("❌ " + error.message);
      console.error(error);
    }
  });
}

/*************************************************
 * Reset Password
 *************************************************/
const resetForm = document.getElementById("reset-form");
if (resetForm) {
  resetForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("reset-email").value.trim();
    try {
      await sendPasswordResetEmail(auth, email);
      alert("📧 Reset link sent to your email.");
      window.toggleSection("login-section");
    } catch (error) {
      alert("❌ " + error.message);
      console.error(error);
    }
  });
}

/*************************************************
 * Logout
 *************************************************/
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    try {
      await signOut(auth);
      alert("👋 Logged out successfully.");
      window.location.href = "index.html";
    } catch (error) {
      alert("❌ " + error.message);
      console.error(error);
    }
  });
}
