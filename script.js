// ================= User Management =================
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

// ================= Registration =================
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

// ================= Login =================
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

    setCurrentUser(user);
    applyLanguage(user.lang || "en");
    alert("Login successful!");
    // redirect logic could go here
  });
}

// ================= Language =================
const translations = {
  en: {
    login: "Login",
    createAccount: "Create Account",
    username: "Username",
    password: "Password",
    role: "Role",
    register: "Register"
  },
  es: {
    login: "Iniciar sesión",
    createAccount: "Crear cuenta",
    username: "Usuario",
    password: "Contraseña",
    role: "Rol",
    register: "Registrar"
  },
  fr: {
    login: "Connexion",
    createAccount: "Créer un compte",
    username: "Nom d'utilisateur",
    password: "Mot de passe",
    role: "Rôle",
    register: "S'inscrire"
  },
  de: {
    login: "Anmelden",
    createAccount: "Konto erstellen",
    username: "Benutzername",
    password: "Passwort",
    role: "Rolle",
    register: "Registrieren"
  },
  it: {
    login: "Accedi",
    createAccount: "Crea account",
    username: "Nome utente",
    password: "Password",
    role: "Ruolo",
    register: "Registrati"
  },
  id: {
    login: "Masuk",
    createAccount: "Buat Akun",
    username: "Nama pengguna",
    password: "Kata sandi",
    role: "Peran",
    register: "Daftar"
  }
};

function applyLanguage(lang) {
  const dict = translations[lang] || translations.en;
  const map = {
    "login-title": dict.login,
    "create-account-title": dict.createAccount,
    "login-username-label": dict.username,
    "login-password-label": dict.password,
    "username-label": dict.username,
    "password-label": dict.password,
    "role-label": dict.role,
    "login-btn": dict.login,
    "register-btn": dict.register
  };
  Object.keys(map).forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = map[id];
  });
}

const pageLangSelect = document.getElementById("page-lang");
if (pageLangSelect) {
  pageLangSelect.addEventListener("change", () => {
    applyLanguage(pageLangSelect.value);
  });
  applyLanguage(pageLangSelect.value);
}

// ================= Settings =================
const settingsForm = document.getElementById("settingsForm");
if (settingsForm) {
  const user = getCurrentUser();
  if (user) {
    document.getElementById("settings-lang").value = user.lang || "en";
    document.getElementById("auto-logout").value = user.autoLogout || 30;
    document.getElementById("theme-toggle").value = user.theme || "day";
  }

  document.getElementById("save-settings").addEventListener("click", () => {
    const users = loadUsers();
    const idx = users.findIndex(u => u.username === user.username);

    users[idx].lang = document.getElementById("settings-lang").value;
    users[idx].autoLogout = parseInt(document.getElementById("auto-logout").value, 10);
    users[idx].theme = document.getElementById("theme-toggle").value;

    saveUsers(users);
    setCurrentUser(users[idx]);
    alert("Settings saved!");
  });

  // Screenshot
  document.getElementById("take-screenshot").addEventListener("click", () => {
    html2canvas(document.body).then(canvas => {
      document.getElementById("screenshot-preview").innerHTML = "";
      document.getElementById("screenshot-preview").appendChild(canvas);
    });
  });
}

// ================= Auto Logout =================
let logoutTimer, warningTimer;
function resetLogoutTimer() {
  clearTimeout(logoutTimer);
  clearTimeout(warningTimer);

  const user = getCurrentUser();
  if (!user) return;

  let minutes = user.autoLogout;
  if (minutes === 0) minutes = 720; // 12h cap

  warningTimer = setTimeout(() => {
    const warn = document.getElementById("logout-warning");
    if (warn) {
      warn.style.display = "block";
      warn.textContent = "You will be logged out in 1 minute. Click to stay logged in.";
      warn.onclick = () => resetLogoutTimer();
    }
  }, (minutes - 1) * 60 * 1000);

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

// ================= Messaging =================
// Placeholder (you already have messages.html etc.)
// Can be extended with inbox/outbox, attachments, unread counters, etc.
