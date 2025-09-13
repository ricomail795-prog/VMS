
// ===============================
// One-time silent reset of localStorage
// ===============================
if (!localStorage.getItem("firstResetDone")) {
  localStorage.clear();
  localStorage.setItem("firstResetDone", "true");
}

// ===============================
// Utility functions
// ===============================
function getUsers() {
  return JSON.parse(localStorage.getItem("users") || "[]");
}
function saveUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
}
function getCurrentUser() {
  return JSON.parse(localStorage.getItem("currentUser") || "null");
}
function setCurrentUser(user) {
  localStorage.setItem("currentUser", JSON.stringify(user));
}
function clearCurrentUser() {
  localStorage.removeItem("currentUser");
}

// ===============================
// DOM Ready
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");

  // ------------------------------
  // Login
  // ------------------------------
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const username = document.getElementById("login-username").value.trim();
      const password = document.getElementById("login-password").value.trim();
      const users = getUsers();
      const found = users.find(
        (u) => u.username === username && u.password === password
      );
      if (found) {
        setCurrentUser(found);
        window.location.href = "dashboard.html";
      } else {
        alert("Invalid credentials.");
      }
    });
  }

  // ------------------------------
  // Register
  // ------------------------------
  if (registerForm) {
    registerForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const username = document.getElementById("reg-username").value.trim();
      const password = document.getElementById("reg-password").value.trim();
      const role = document.getElementById("reg-role").value;

      if (!username || !password || !role) {
        alert("Please fill all fields");
        return;
      }

      let users = getUsers();
      if (users.find((u) => u.username === username)) {
        alert("Username already exists");
        return;
      }

      const newUser = {
        username,
        password,
        role,
        profile: {},
        messages: []
      };

      users.push(newUser);
      saveUsers(users);
      alert("Account created. Please log in.");
      registerForm.reset();
    });
  }

  // ------------------------------
  // Logout
  // ------------------------------
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      clearCurrentUser();
      window.location.href = "index.html";
    });
  }
});
