// =============================
// Local Storage Helpers
// =============================
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

// =============================
// Translation System
// =============================
const translations = {
  en: { login: "Login", createAccount: "Create Account", username: "Username", password: "Password", role: "Role", preferredLanguage: "Preferred Language", register: "Register", logout: "Logout", dashboard: "Dashboard", messages: "Messages", settings: "Settings", registeredVessels: "Registered Vessels", registeredCrew: "Registered Crew", latestMessages: "Latest Messages" },
  fr: { login: "Connexion", createAccount: "Créer un compte", username: "Nom d'utilisateur", password: "Mot de passe", role: "Rôle", preferredLanguage: "Langue Préférée", register: "S'inscrire", logout: "Déconnexion", dashboard: "Tableau de bord", messages: "Messages", settings: "Paramètres", registeredVessels: "Navires enregistrés", registeredCrew: "Équipage enregistré", latestMessages: "Derniers messages" },
  es: { login: "Iniciar sesión", createAccount: "Crear cuenta", username: "Usuario", password: "Contraseña", role: "Rol", preferredLanguage: "Idioma preferido", register: "Registrar", logout: "Cerrar sesión", dashboard: "Tablero", messages: "Mensajes", settings: "Configuraciones", registeredVessels: "Buques registrados", registeredCrew: "Tripulación registrada", latestMessages: "Últimos mensajes" },
  de: { login: "Anmelden", createAccount: "Konto erstellen", username: "Benutzername", password: "Passwort", role: "Rolle", preferredLanguage: "Bevorzugte Sprache", register: "Registrieren", logout: "Abmelden", dashboard: "Armaturenbrett", messages: "Nachrichten", settings: "Einstellungen", registeredVessels: "Registrierte Schiffe", registeredCrew: "Registrierte Besatzung", latestMessages: "Neueste Nachrichten" },
  id: { login: "Masuk", createAccount: "Buat Akun", username: "Nama Pengguna", password: "Kata Sandi", role: "Peran", preferredLanguage: "Bahasa Pilihan", register: "Daftar", logout: "Keluar", dashboard: "Dasbor", messages: "Pesan", settings: "Pengaturan", registeredVessels: "Kapal Terdaftar", registeredCrew: "Awak Terdaftar", latestMessages: "Pesan Terbaru" }
  // You can expand with more languages as needed
};

// Apply translation on page load
function applyLanguage(lang) {
  if (!translations[lang]) return;
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    el.textContent = translations[lang][key] || key;
  });
}

// =============================
// Activity Log
// =============================
function logActivity(message, type = "info", userOverride = null) {
  const logs = JSON.parse(localStorage.getItem("activityLog")) || {};
  const user = userOverride || (getCurrentUser() ? getCurrentUser().username : "System");

  if (!logs[user]) logs[user] = [];
  logs[user].push({ time: new Date().toLocaleString(), message, type });

  if (logs[user].length > 1000) logs[user].shift(); // cap 1000 entries
  localStorage.setItem("activityLog", JSON.stringify(logs));
}

// =============================
// Registration
// =============================
const regForm = document.getElementById("registerForm");
if (regForm) {
  regForm.addEventListener("submit", e => {
    e.preventDefault();
    const lang = document.getElementById("reg-lang").value;
    const username = document.getElementById("reg-username").value.trim();
    const password = document.getElementById("reg-password").value.trim();
    const role = document.getElementById("reg-role").value;

    let users = getUsers();
    if (users.some(u => u.username === username)) {
      alert("✗ Username already exists");
      return;
    }

    const newUser = { username, password, role, lang, autoLogout: 30 }; // default 30min
    users.push(newUser);
    saveUsers(users);

    logActivity(`Registered new account (${role})`, "success", username);
    alert("✓ Account created. You can now log in.");
    regForm.reset();
  });
}

// =============================
// Login
// =============================
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", e => {
    e.preventDefault();
    const username = document.getElementById("login-username").value.trim();
    const password = document.getElementById("login-password").value.trim();

    const users = getUsers();
    const user = users.find(u => u.username === username && u.password === password);

    if (!user) {
      alert("✗ Invalid username or password");
      return;
    }

    setCurrentUser(user);
    applyLanguage(user.lang);
    logActivity(`User logged in as ${user.role}`, "success", username);

    // Redirect by role
    if (user.role === "admin") {
      window.location.href = "dashboard.html";
    } else if (user.role === "crew") {
      window.location.href = "messages.html";
    } else if (user.role === "manager") {
      window.location.href = "profile.html";
    }
  });
}

// =============================
// Auto Logout System
// =============================
function startAutoLogout() {
  const user = getCurrentUser();
  if (!user) return;

  let timeout;
  const logoutTime = (user.autoLogout || 30) * 60 * 1000; // in ms, safety 12hr cap
  const maxTime = 12 * 60 * 60 * 1000;

  function resetTimer() {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      clearCurrentUser();
      alert("You have been logged out due to inactivity.");
      window.location.href = "index.html";
    }, Math.min(logoutTime, maxTime));
  }

  ["click","mousemove","keydown"].forEach(evt =>
    document.addEventListener(evt, resetTimer)
  );
  resetTimer();
}
startAutoLogout();
