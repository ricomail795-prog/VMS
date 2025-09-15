/****************************************
 * Firebase Setup
 ****************************************/
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  sendPasswordResetEmail, 
  signOut 
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// ✅ Replace with your Firebase config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

/****************************************
 * Banner Notifications
 ****************************************/
function showBanner(message, type = "info") {
  const bar = document.getElementById("banner");
  if (!bar) return;

  // Reset classes and set type
  bar.className = "banner " + type;
  bar.textContent = message;

  // Show with fade-in
  bar.style.display = "block";
  bar.style.opacity = "0";
  bar.style.transition = "opacity 0.5s ease, top 0.5s ease";
  bar.style.top = "-50px";

  // Trigger animation
  setTimeout(() => {
    bar.style.opacity = "1";
    bar.style.top = "0";
  }, 50);

  // Auto-hide after 3 seconds
  setTimeout(() => {
    bar.style.opacity = "0";
    bar.style.top = "-50px";

    // Fully hide after transition
    setTimeout(() => {
      bar.style.display = "none";
    }, 500);
  }, 3000);
}

/****************************************
 * Toggle Sections (Login/Register/Reset)
 ****************************************/
window.toggleSection = function(sectionId) {
  document.querySelectorAll(".auth-section").forEach(sec => sec.classList.remove("active"));
  document.getElementById(sectionId).classList.add("active");
};

/****************************************
 * Login
 ****************************************/
const loginForm = document.getElementById("login-form");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      showBanner("✅ Login successful!", "success");
      window.location.href = "dashboard.html";
    } catch (error) {
      showBanner("❌ " + error.message, "error");
    }
  });
}

/****************************************
 * Register
 ****************************************/
const registerForm = document.getElementById("register-form");
if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("register-email").value;
    const password = document.getElementById("register-password").value;

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      showBanner("✅ Account created. Please check your email for verification.", "success");
      toggleSection("login-section");
    } catch (error) {
      showBanner("❌ " + error.message, "error");
    }
  });
}

/****************************************
 * Password Reset
 ****************************************/
const resetForm = document.getElementById("reset-form");
if (resetForm) {
  resetForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("reset-email").value;

    try {
      await sendPasswordResetEmail(auth, email);
      showBanner("📧 Reset link sent to your email.", "info");
      toggleSection("login-section");
    } catch (error) {
      showBanner("❌ " + error.message, "error");
    }
  });
}

/****************************************
 * Logout
 ****************************************/
const logoutBtn = document.getElementById("logout-btn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    try {
      await signOut(auth);
      showBanner("👋 Logged out successfully.", "info");
      window.location.href = "index.html";
    } catch (error) {
      showBanner("❌ " + error.message, "error");
    }
  });
}
