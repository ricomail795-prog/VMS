// ================= USERS =================
function saveUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
}

function getUsers() {
  return JSON.parse(localStorage.getItem("users")) || [];
}

function setCurrentUser(user) {
  localStorage.setItem("currentUser", JSON.stringify(user));
}

function getCurrentUser() {
  return JSON.parse(localStorage.getItem("currentUser"));
}

function clearCurrentUser() {
  localStorage.removeItem("currentUser");
}

// ================= LOGIN =================
function loginUser(username, password) {
  const users = getUsers();
  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    setCurrentUser(user);
    showNotification("Logged in successfully!");
    resetInactivityTimer(); // Start inactivity timer
    return true;
  } else {
    showNotification("Invalid username or password.");
    return false;
  }
}

// ================= LOGOUT =================
function logoutUser(reason = "Logged out") {
  clearCurrentUser();
  showNotification(reason);
}

// ================= NOTIFICATIONS =================
function showNotification(msg) {
  const bar = document.getElementById("notification-bar");
  if (bar) {
    bar.innerText = msg;
    bar.style.display = "block";
    setTimeout(() => {
      bar.style.display = "none";
    }, 4000);
  }
}

// ================= AUTO LOGOUT =================
let logoutTimer;

function resetInactivityTimer() {
  clearTimeout(logoutTimer);

  const currentUser = getCurrentUser();
  if (!currentUser) return;

  // Default 30 mins, unless changed in settings
  let timeout = localStorage.getItem("logoutTime") || "30";
  if (timeout === "stay") {
    timeout = 720; // 12 hours safety cap
  }
  const ms = parseInt(timeout, 10) * 60 * 1000;

  logoutTimer = setTimeout(() => {
    logoutUser("You have been logged out due to inactivity.");
  }, ms);
}

// Reset timer on activity
["click", "mousemove", "keydown"].forEach(evt =>
  document.addEventListener(evt, resetInactivityTimer)
);

// ================= FORM HANDLING =================
document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", e => {
      e.preventDefault();
      const username = document.getElementById("login-username").value.trim();
      const password = document.getElementById("login-password").value.trim();
      if (loginUser(username, password)) {
        window.location.href = "dashboard.html";
      }
    });
  }

  const registerForm = document.getElementById("registerForm");
  if (registerForm) {
    registerForm.addEventListener("submit", e => {
      e.preventDefault();
      const username = document.getElementById("reg-username").value.trim();
      const password = document.getElementById("reg-password").value.trim();
      const role = document.getElementById("reg-role").value;

      if (!username || !password || !role) {
        showNotification("Please complete all fields.");
        return;
      }

      const users = getUsers();
      if (users.find(u => u.username === username)) {
        showNotification("Username already exists.");
        return;
      }

      const newUser = { username, password, role };
      users.push(newUser);
      saveUsers(users);
      showNotification("Account created successfully!");
      registerForm.reset();
    });
  }
});
