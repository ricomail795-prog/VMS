// ===== Local Storage Helpers =====
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

// ===== Translation System =====
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
    username: "Nom d’utilisateur",
    password: "Mot de passe",
    role: "Rôle",
    preferredLanguage: "Langue Préférée",
    register: "S’inscrire",
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
    registeredVessels: "Barcos registrados",
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

// Apply translations
function applyLanguage(lang) {
  const t = translations[lang];
  if (!t) return;

  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (t[key]) el.textContent = t[key];
  });

  localStorage.setItem("selectedLanguage", lang);
}

// Load language on page load
window.addEventListener("load", () => {
  const savedLang = localStorage.getItem("selectedLanguage") || "en";
  applyLanguage(savedLang);

  const langSelect = document.getElementById("reg-lang");
  if (langSelect) langSelect.value = savedLang;

  const settingsLang = document.getElementById("settings-lang");
  if (settingsLang) settingsLang.value = savedLang;
});

// ===== Registration =====
const regForm = document.getElementById("registerForm");
if (regForm) {
  regForm.addEventListener("submit", e => {
    e.preventDefault();
    const username = document.getElementById("reg-username").value.trim();
    const password = document.getElementById("reg-password").value.trim();
    const role = document.getElementById("reg-role").value;
    const lang = document.getElementById("reg-lang").value;

    let users = getUsers();
    if (users.some(u => u.username === username)) {
      alert("❌ Username already exists!");
      return;
    }

    const newUser = { username, password, role, lang };
    users.push(newUser);
    saveUsers(users);

    alert("✔ Account created! You can now log in.");
    regForm.reset();
  });
}

// ===== Login =====
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
    applyLanguage(user.lang);

    if (user.role === "admin") {
      window.location.href = "dashboard.html";
    } else if (user.role === "crew") {
      window.location.href = "messages.html";
    } else if (user.role === "manager") {
      window.location.href = "profile.html";
    }
  });
}
