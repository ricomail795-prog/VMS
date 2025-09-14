// ========================
// User storage helpers
// ========================
function getUsers() {
  return JSON.parse(localStorage.getItem("users")) || {};
}

function saveUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
}

function getUserProfile(username) {
  const users = getUsers();
  return users[username.toLowerCase()] || null;
}

function saveUserProfile(username, password, role, lang) {
  const users = getUsers();
  users[username.toLowerCase()] = { password, role, lang };
  saveUsers(users);
}

// ========================
// Registration
// ========================
const regForm = document.getElementById("registerForm");
if (regForm) {
  regForm.addEventListener("submit", e => {
    e.preventDefault();

    const username = document.getElementById("reg-username").value.trim();
    const password = document.getElementById("reg-password").value.trim();
    const role = document.getElementById("reg-role").value;
    const lang = document.getElementById("reg-lang").value;

    if (!username || !password || !role || !lang) {
      alert("Please fill in all fields.");
      return;
    }

    const users = getUsers();
    if (users[username.toLowerCase()]) {
      alert("That username already exists.");
      return;
    }

    saveUserProfile(username, password, role, lang);
    alert("Account created successfully!");
    regForm.reset();
  });
}

// ========================
// Login
// ========================
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", e => {
    e.preventDefault();

    const username = document.getElementById("login-username").value.trim();
    const password = document.getElementById("login-password").value.trim();

    const profile = getUserProfile(username);

    if (!profile || profile.password !== password) {
      alert("Invalid username or password.");
      return;
    }

    alert("Welcome back, " + username + "! Your language is set to " + profile.lang);
  });
}
