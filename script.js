
// ============================
// Firebase V8 Setup
// ============================

var firebaseConfig = {
  apiKey: "AIzaSyDJ8GbgNdLO6oGKCzTjxDI7edp8Jq-_0w",
  storageBucket: "vms-app-6a0c3.appspot.com",
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// ============================
// AUTH STATE LISTENER
// ============================

auth.onAuthStateChanged((user) => {
  if (user) {
    console.log("User logged in:", user.email);

    // Redirect to dashboard if logged in and on login page
    if (window.location.pathname.endsWith("index.html") || window.location.pathname.endsWith("/VMS/")) {
      window.location.href = "dashboard.html";
    }
  } else {
    console.log("No user logged in");

    // Redirect to login if logged out and on a protected page
    if (!window.location.pathname.endsWith("index.html")) {
      window.location.href = "index.html";
    }
  }
});

// ============================
// LOGIN
// ============================

document.getElementById("loginForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  auth.signInWithEmailAndPassword(email, password)
    .then(() => {
      console.log("Login successful");
    })
    .catch((error) => alert(error.message));
});

// ============================
// REGISTER
// ============================

document.getElementById("registerForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("registerEmail").value;
  const password = document.getElementById("registerPassword").value;

  auth.createUserWithEmailAndPassword(email, password)
    .then((cred) => {
      return db.collection("users").doc(cred.user.uid).set({
        email: email,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
    })
    .then(() => {
      alert("Account created successfully!");
    })
    .catch((error) => alert(error.message));
});

// ============================
// PASSWORD RESET
// ============================

document.getElementById("resetForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("resetEmail").value;

  auth.sendPasswordResetEmail(email)
    .then(() => alert("Password reset email sent!"))
    .catch((error) => alert(error.message));
});

// ============================
// LOGOUT
// ============================

document.getElementById("logoutBtn")?.addEventListener("click", () => {
  auth.signOut()
    .then(() => {
      console.log("User logged out");
    });
});

// ============================
// FIRESTORE HELPERS
// ============================

function saveProfile(uid, profileData) {
  return db.collection("users").doc(uid).update(profileData);
}

function sendMessage(uid, message) {
  return db.collection("messages").add({
    uid: uid,
    message: message,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  });
}

function saveSettings(uid, settingsData) {
  return db.collection("settings").doc(uid).set(settingsData);
}

function logIncident(uid, incidentData) {
  return db.collection("incidents").add({
    uid: uid,
    incidentData: incidentData,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  });
}
