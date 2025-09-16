// Firebase v8 setup with embedded config

var firebaseConfig = {
  apiKey: "AIzaSyDJ8GbgNdLO6oGKCzTjxD17edp8Jq-_0w",
  authDomain: "vms-app-6a0c3.firebaseapp.com",
  projectId: "vms-app-6a0c3",
  storageBucket: "vms-app-6a0c3.appspot.com",
  messagingSenderId: "868366477824",
  appId: "1:868366477824:web:05588a6d013a372f0606e5",
  measurementId: "G-NBZBPJQ3QR"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Toggle sections on index page
function toggleSection(sectionId) {
  document.querySelectorAll('.auth-section').forEach(sec => sec.classList.remove('active'));
  document.getElementById(sectionId).classList.add('active');
}

// Login
document.getElementById("login-form")?.addEventListener("submit", e => {
  e.preventDefault();
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;
  auth.signInWithEmailAndPassword(email, password)
    .then(() => window.location.href = "dashboard.html")
    .catch(err => alert(err.message));
});

// Register
document.getElementById("register-form")?.addEventListener("submit", e => {
  e.preventDefault();
  const email = document.getElementById("register-email").value;
  const password = document.getElementById("register-password").value;
  auth.createUserWithEmailAndPassword(email, password)
    .then(() => { alert("Account created!"); toggleSection('login-section'); })
    .catch(err => alert(err.message));
});

// Reset Password
document.getElementById("reset-form")?.addEventListener("submit", e => {
  e.preventDefault();
  const email = document.getElementById("reset-email").value;
  auth.sendPasswordResetEmail(email)
    .then(() => alert("Password reset email sent"))
    .catch(err => alert(err.message));
});

// Logout
document.getElementById("logoutBtn")?.addEventListener("click", () => {
  auth.signOut().then(() => window.location.href = "index.html");
});

// Firestore helpers
function saveProfile(uid, profileData) {
  return db.collection("users").doc(uid).set(profileData, { merge: true });
}
function sendMessage(uid, message) {
  return db.collection("messages").add({ uid, message, createdAt: firebase.firestore.FieldValue.serverTimestamp() });
}
function saveSettings(uid, settingsData) {
  return db.collection("settings").doc(uid).set(settingsData, { merge: true });
}
function logIncident(uid, incidentData) {
  return db.collection("incidents").add({ uid, incidentData, createdAt: firebase.firestore.FieldValue.serverTimestamp() });
}
