// Auth form handling
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const resetForm = document.getElementById("resetForm");

const registerContainer = document.getElementById("registerContainer");
const resetContainer = document.getElementById("resetContainer");
const backToLogin1 = document.getElementById("backToLogin1");
const backToLogin2 = document.getElementById("backToLogin2");
const showRegister = document.getElementById("showRegister");
const showReset = document.getElementById("showReset");

function showSection(section) {
  document.querySelectorAll(".auth-container").forEach(el => el.classList.add("hidden"));
  if (section) section.classList.remove("hidden");
}

// Login
if (loginForm) {
  loginForm.addEventListener("submit", e => {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(() => {
        window.location.href = "dashboard.html";
      })
      .catch(error => alert(error.message));
  });
}

// Register
if (registerForm) {
  registerForm.addEventListener("submit", e => {
    e.preventDefault();
    const email = document.getElementById("registerEmail").value;
    const password = document.getElementById("registerPassword").value;
    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then(() => {
        alert("Account created! Please verify your email.");
        firebase.auth().currentUser.sendEmailVerification();
        window.location.href = "index.html";
      })
      .catch(error => alert(error.message));
  });
}

// Reset Password
if (resetForm) {
  resetForm.addEventListener("submit", e => {
    e.preventDefault();
    const email = document.getElementById("resetEmail").value;
    firebase.auth().sendPasswordResetEmail(email)
      .then(() => alert("Password reset link sent!"))
      .catch(error => alert(error.message));
  });
}

// Navigation between forms
if (showRegister) showRegister.addEventListener("click", () => showSection(registerContainer));
if (showReset) showReset.addEventListener("click", () => showSection(resetContainer));
if (backToLogin1) backToLogin1.addEventListener("click", () => showSection(document.querySelector(".auth-container")));
if (backToLogin2) backToLogin2.addEventListener("click", () => showSection(document.querySelector(".auth-container")));
