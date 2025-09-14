// =====================
// Local Storage Helpers
// =====================
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

// =====================
// Translation System
// =====================
const translations = {
  en: {
    login: "Login",
    createAccount: "Create Account",
    username: "Username",
    password: "Password",
    role: "Role",
    preferredLanguage: "Preferred Language",
    register: "Register",
    dashboard: "Dashboard",
    messages: "Messages",
    settings: "Settings",
    logout: "Logout",
    registeredVessels: "Registered Vessels",
    registeredCrew: "Registered Crew",
    latestMessages: "Latest Messages",
  },
  fr: {
    login: "Connexion",
    createAccount: "Créer un compte",
    username: "Nom d'utilisateur",
    password: "Mot de passe",
    role: "Rôle",
    preferredLanguage: "Langue Préférée",
    register: "S'inscrire",
    dashboard: "Tableau de bord",
    messages: "Messages",
    settings: "Paramètres",
    logout: "Déconnexion",
    registeredVessels: "Navires enregistrés",
    registeredCrew: "Équipage enregistré",
    latestMessages: "Derniers messages",
  },
  es: {
    login: "Iniciar sesión",
    createAccount: "Crear cuenta",
    username: "Usuario",
    password: "Contraseña",
    role: "Rol",
    preferredLanguage: "Idioma preferido",
    register: "Registrar",
    dashboard: "Tablero",
    messages: "Mensajes",
    settings: "Configuraciones",
    logout: "Cerrar sesión",
    registeredVessels: "Buques registrados",
    registeredCrew: "Tripulación registrada",
    latestMessages: "Últimos mensajes",
  },
  id: {
    login: "Masuk",
    createAccount: "Buat Akun",
    username: "Nama Pengguna",
    password: "Kata Sandi",
    role: "Peran",
    preferredLanguage: "Bahasa Pilihan",
    register: "Daftar",
    dashboard: "Dasbor",
    messages: "Pesan",
    settings: "Pengaturan",
    logout: "Keluar",
    registeredVessels: "Kapal Terdaftar",
    registeredCrew: "Awak Terdaftar",
    latestMessages: "Pesan Terbaru",
  }
};

// Apply translation to UI
function applyLanguage(lang) {
  if (!translations[lang]) return;

  // Login header
  const loginHeader = document.querySelector("h2");
  if (loginHeader) loginHeader.textContent = translations[lang].login;

  // Register header
  const regHeader = document.querySelector("h2:nth-of-type(2)");
  if (regHeader) regHeader.textContent = translations[lang].createAccount;

  // Labels
  const labels = document.querySelectorAll("label");
  labels.forEach(label => {
    if (label.htmlFor.includes("username")) label.textContent = translations[lang].username;
    if (label.htmlFor.includes("password")) label.textContent = translations[lang].password;
    if (label.htmlFor.includes("role")) label.textContent = translations[lang].role;
    if (label.htmlFor.includes("lang")) label.textContent = translations[lang].preferredLanguage;
  });

  // Buttons
  const buttons = document.querySelectorAll("button[type=submit]");
  if (buttons[0]) buttons[0].textContent = translations[lang].login;
  if (buttons[1]) buttons[1].textContent = translations[lang].register;
}

// =====================
// Activity Log
// =====================
function logActivity(message, type = "info", userOverride = null) {
  const logs = JSON.parse(localStorage.getItem("activityLog")) || [];
  const current = getCurrentUser();
  const username = userOverride || (current ? current.username : "System");

  const entry = {
    time: new Date().toLocaleString(),
    message,
    type,
    user: username
  };

  logs.push(entry);
  localStorage.setItem("activityLog", JSON.stringify(logs));
}

// =====================
// Registration
// =====================
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
      alert("⚠ Username already exists!");
      return;
    }

    const newUser = { username, password, role, lang };
    users.push(newUser);
    saveUsers(users);

    logActivity(`Registered new account (${role})`, "success", username);
    alert("✅ Account created! You can now log in.");

    regForm.reset();
  });
}

// =====================
// Login
// =====================
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", e => {
    e.preventDefault();

    const username = document.getElementById("login-username").value.trim();
    const password = document.getElementById("login-password").value.trim();

    const users = getUsers();
    const user = users.find(u => u.username === username && u.password === password);

    if (!user) {
      alert("❌ Invalid username or password!");
      return;
    }

    setCurrentUser(user);
    logActivity(`User logged in as ${user.role}`, "success", username);
    applyLanguage(user.lang);

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
