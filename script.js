// Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyDJ8GbgNdLO6OcGKCzTjxDI7edp8Jq-_0w",
  authDomain: "vms-app-6a0c3.firebaseapp.com",
  projectId: "vms-app-6a0c3",
  storageBucket: "vms-app-6a0c3.firebasestorage.app",
  messagingSenderId: "868366477824",
  appId: "1:868366477824:web:05588a6d013a372f0606e5",
  measurementId: "G-NBZBPJQ3QR"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// ---------- AUTH ---------- //

// Login
document.getElementById("loginForm")?.addEventListener("submit", e => {
  e.preventDefault();
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  auth.signInWithEmailAndPassword(email, password)
    .then(() => {
      alert("Login successful!");
      window.location.href = "dashboard.html";
    })
    .catch(err => alert(err.message));
});

// Register
document.getElementById("registerForm")?.addEventListener("submit", e => {
  e.preventDefault();
  const email = document.getElementById("registerEmail").value;
  const password = document.getElementById("registerPassword").value;

  auth.createUserWithEmailAndPassword(email, password)
    .then(() => {
      alert("Account created successfully!");
      window.location.href = "index.html";
    })
    .catch(err => alert(err.message));
});

// Reset Password
document.getElementById("resetForm")?.addEventListener("submit", e => {
  e.preventDefault();
  const email = document.getElementById("resetEmail").value;

  auth.sendPasswordResetEmail(email)
    .then(() => alert("Password reset email sent!"))
    .catch(err => alert(err.message));
});

// ---------- TOGGLE FORMS ---------- //

document.getElementById("createAccountLink")?.addEventListener("click", e => {
  e.preventDefault();
  document.getElementById("loginForm").style.display = "none";
  document.getElementById("registerContainer").style.display = "block";
});

document.getElementById("forgotPasswordLink")?.addEventListener("click", e => {
  e.preventDefault();
  document.getElementById("loginForm").style.display = "none";
  document.getElementById("resetContainer").style.display = "block";
});

document.getElementById("backToLogin")?.addEventListener("click", e => {
  e.preventDefault();
  document.getElementById("registerContainer").style.display = "none";
  document.getElementById("loginForm").style.display = "block";
});

document.getElementById("backToLogin2")?.addEventListener("click", e => {
  e.preventDefault();
  document.getElementById("resetContainer").style.display = "none";
  document.getElementById("loginForm").style.display = "block";
});
