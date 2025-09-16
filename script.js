// Firebase configuration from your project
const firebaseConfig = {
  apiKey: "AIzaSyDJ8GbgNdLO6oGCkCzTjxD17edp8Jq-_0w",
  authDomain: "vms-app-6a0c3.firebaseapp.com",
  projectId: "vms-app-6a0c3",
  storageBucket: "vms-app-6a0c3.appspot.com",
  messagingSenderId: "868366477824",
  appId: "1:868366477824:web:05588a6d013a372f0606e5",
  measurementId: "G-NBZBPJQ3QR"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// -------- Authentication --------

// Login
document.getElementById("loginForm")?.addEventListener("submit", (e) => {
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
document.getElementById("registerForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("registerEmail").value;
  const password = document.getElementById("registerPassword").value;

  auth.createUserWithEmailAndPassword(email, password)
    .then((cred) => {
      // Create Firestore user profile
      return db.collection("users").doc(cred.user.uid).set({
        email: email,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
    })
    .then(() => {
      alert("Account created successfully!");
      window.location.href = "index.html";
    })
    .catch((error) => alert(error.message));
});

// Reset Password
document.getElementById("resetForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("resetEmail").value;

  auth.sendPasswordResetEmail(email)
    .then(() => alert("Password reset email sent!"))
    .catch((error) => alert(error.message));
});

// Logout
document.getElementById("logoutBtn")?.addEventListener("click", () => {
  auth.signOut().then(() => {
    window.location.href = "index.html";
  });
});

// -------- Firestore Helpers --------

// Save user profile
function saveProfile(uid, profileData) {
  return db.collection("users").doc(uid).update(profileData);
}

// Send message
function sendMessage(uid, message) {
  return db.collection("messages").add({
    uid: uid,
    message: message,
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
  });
}

// Save settings
function saveSettings(uid, settingsData) {
  return db.collection("settings").doc(uid).set(settingsData);
}

// Report incident
function logIncident(uid, incidentData) {
  return db.collection("incidents").add({
    uid: uid,
    ...incidentData,
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),

