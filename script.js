// ================= LANGUAGE HANDLING =================
document.addEventListener("DOMContentLoaded", () => {
  const langSelect = document.getElementById("page-lang");
  if (langSelect) {
    const savedLang = localStorage.getItem("preferredLanguage") || "en";
    langSelect.value = savedLang;
    applyLanguage(savedLang);

    langSelect.addEventListener("change", () => {
      const selectedLang = langSelect.value;
      localStorage.setItem("preferredLanguage", selectedLang);
      applyLanguage(selectedLang);
    });
  }
});

// Apply language change (placeholder translations can be added here)
function applyLanguage(lang) {
  console.log("Language set to:", lang);
}

// ================= NOTIFICATION HANDLING =================
function showNotification(message) {
  const bar = document.getElementById("notification-bar");
  if (bar) {
    bar.innerText = message;
    bar.style.display = "block";
    setTimeout(() => {
      bar.style.display = "none";
    }, 4000);
  }
}

// ================= LOGOUT WARNING HANDLING =================
function showLogoutWarning(timeLeft) {
  const warning = document.getElementById("logout-warning");
  if (warning) {
    warning.innerText = `⚠ You will be logged out in ${timeLeft} minute(s) due to inactivity. Click to stay logged in.`;
    warning.style.display = "block";
    warning.onclick = () => resetLogoutTimer();
    setTimeout(() => {
      warning.style.display = "none";
    }, 5000);
  }
}

// ================= USER MANAGEMENT HELPERS =================
function loadUsers() {
  return JSON.parse(localStorage.getItem("users")) || [];
}

function saveUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
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

// ================= REGISTRATION =================
const regForm = document.getElementById("registerForm");
if (regForm) {
  regForm.addEventListener("submit", e => {
    e.preventDefault();
    const username = document.getElementById("reg-username").value.trim();
    const password = document.getElementById("reg-password").value.trim();
    const role = document.getElementById("reg-role").value;

    if (!username || !password || !role) {
      alert("All fields required!");
      return;
    }

    const users = loadUsers();
    if (users.some(u => u.username === username)) {
      alert("User already exists!");
      return;
    }

    const lang = document.getElementById("page-lang").value || "en";
    users.push({ username, password, role, lang, theme: "day", autoLogout: 30 });
    saveUsers(users);

    alert("Account created successfully!");
    regForm.reset();
  });
}

// ================= LOGIN =================
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", e => {
    e.preventDefault();
    const username = document.getElementById("login-username").value.trim();
    const password = document.getElementById("login-password").value.trim();

    const users = loadUsers();
    const user = users.find(u => u.username === username && u.password === password);
    if (!user) {
      alert("Invalid login details");
      return;
    }

    // Ensure autoLogout always has a value
    if (user.autoLogout === undefined || user.autoLogout === null) {
      user.autoLogout = 30;
      const idx = users.findIndex(u => u.username === user.username);
      users[idx] = user;
      saveUsers(users);
    }

    setCurrentUser(user);
    applyLanguage(user.lang || "en");
    alert("Login successful!");
  });
}

// ================= AUTO LOGOUT =================
let logoutTimer, warningTimer;

function resetLogoutTimer() {
  clearTimeout(logoutTimer);
  clearTimeout(warningTimer);

  const user = getCurrentUser();
  if (!user) return;

  let minutes = user.autoLogout;
  if (minutes === undefined || minutes === null) {
    minutes = 30;
    user.autoLogout = 30;
    const users = loadUsers();
    const idx = users.findIndex(u => u.username === user.username);
    if (idx !== -1) {
      users[idx] = user;
      saveUsers(users);
    }
    setCurrentUser(user);
  }

  if (minutes === 0) minutes = 720; // Stay logged in = 12h max

  if (minutes > 1) {
    warningTimer = setTimeout(() => {
      showLogoutWarning(1);
    }, (minutes - 1) * 60 * 1000);
  }

  logoutTimer = setTimeout(() => {
    clearCurrentUser();
    alert("You have been logged out due to inactivity.");
    window.location.href = "index.html";
  }, minutes * 60 * 1000);
}

["click", "mousemove", "keypress"].forEach(evt => {
  document.addEventListener(evt, resetLogoutTimer);
});
resetLogoutTimer();

// ================= TEST FUNCTIONS =================
// Call these in console for testing:
// simulateIncomingMessage(); simulateLogoutWarning();
function simulateIncomingMessage() {
  showNotification("📩 New message received");
}
function simulateLogoutWarning() {
  showLogoutWarning(1);
}
