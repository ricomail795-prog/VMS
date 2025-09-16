// Firebase v8 setup
import firebase from "https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js";
import "https://www.gstatic.com/firebasejs/8.10.0/firebase-auth.js";
import "https://www.gstatic.com/firebasejs/8.10.0/firebase-firestore.js";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDJ8GbgNdLO6oGKCzTjxDI7edp8Jq-_0w",
  authDomain: "vms-app-6a0c3.firebaseapp.com",
  projectId: "vms-app-6a0c3",
  storageBucket: "vms-app-6a0c3.appspot.com",
  messagingSenderId: "868366477824",
  appId: "1:868366477824:web:05588a6d013a372f6060e5",
  measurementId: "G-NBZBPJQ3QR"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Login
document.getElementById("loginForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  auth.signInWithEmailAndPassword(email, password)
    .then(() => {
      window.location.href = "dashboard.html";
    })
    .catch((error) => alert(error.message));
});

// Register
document.getElementById("registerForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("registerEmail").value;
  const password = document.getElementById("registerPassword").value;

  auth.createUserWithEmailAndPassword(email, password)
    .then(() => {
      alert("Account created successfully!");
      document.getElementById("registerForm").style.display = "none";
      document.getElementById("loginForm").style.display = "block";
    })
    .catch((error) => alert(error.message));
});

// Reset Password
document.getElementById("resetForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("resetEmail").value;

  auth.sendPasswordResetEmail(email)
    .then(() => alert("Password reset email sent!"))
    .catch((error) => alert(error.message));
});

// Toggle forms
document.getElementById("createAccountLink").addEventListener("click", () => {
  document.getElementById("loginForm").style.display = "none";
  document.getElementById("registerForm").style.display = "block";
  document.getElementById("resetForm").style.display = "none";
});

document.getElementById("forgotPasswordLink").addEventListener("click", () => {
  document.getElementById("loginForm").style.display = "none";
  document.getElementById("registerForm").style.display = "none";
  document.getElementById("resetForm").style.display = "block";
});
