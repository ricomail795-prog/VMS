// Firebase configuration
var firebaseConfig = {
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
document.getElementById("loginForm")?.addEventListener("submit", function(e) {
  e.preventDefault();
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;
  
  auth.signInWithEmailAndPassword(email, password)
    .then(() => {
      alert("Login successful!");
      window.location.href = "dashboard.html";
    })
    .catch(error => alert(error.message));
});

// Logout
document.getElementById("logoutBtn")?.addEventListener("click", function() {
  auth.signOut().then(() => {
    window.location.href = "index.html";
  });
});

// Reset password
document.getElementById("resetForm")?.addEventListener("submit", function(e) {
  e.preventDefault();
  const email = document.getElementById("resetEmail").value;
  auth.sendPasswordResetEmail(email)
    .then(() => alert("Password reset email sent!"))
    .catch(error => alert(error.message));
});

// Example Firestore usage (save profile)
function saveProfile(uid, data) {
  return db.collection("users").doc(uid).set(data);
}
