// updated // ==================== User Storage Helpers ====================
function loadUsers() {
  return JSON.parse(localStorage.getItem("users") || "[]");
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

// ==================== Registration ====================
const regForm = document.getElementById("registerForm");
if (regForm) {
  regForm.addEventListener("submit", e => {
    e.preventDefault();
    const username = document.getElementById("reg-username").value.trim();
    const password = document.getElementById("reg-password").value.trim();
    const role = document.getElementById("reg-role").value;
    let users = loadUsers();

    if (users.find(u => u.username === username)) {
      alert("Username already exists.");
      return;
    }
    const newUser = { username, password, role, profile: {} };
    users.push(newUser);
    saveUsers(users);
    alert("Account created. You can now log in.");
    regForm.reset();
  });
}

// ==================== Login ====================
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", e => {
    e.preventDefault();
    const username = document.getElementById("login-username").value.trim();
    const password = document.getElementById("login-password").value.trim();
    let users = loadUsers();
    let user = users.find(u => u.username === username && u.password === password);
    if (user) {
      setCurrentUser(user);
      window.location.href = "dashboard.html";
    } else {
      alert("Invalid login details.");
    }
  });
}

// ==================== Logout ====================
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    clearCurrentUser();
    window.location.href = "index.html";
  });
}

// ==================== Dashboard Content ====================
if (window.location.pathname.includes("dashboard.html")) {
  const vesselsTable = document.querySelector("#vessel-list");
  const crewTable = document.querySelector("#crew-list");
  const messagesTable = document.querySelector("#message-list");

  if (vesselsTable) vesselsTable.innerHTML = "<tr><td colspan='6'>No vessels yet</td></tr>";
  if (crewTable) crewTable.innerHTML = "<tr><td colspan='5'>No crew yet</td></tr>";
  if (messagesTable) messagesTable.innerHTML = "<tr><td colspan='5'>No messages yet</td></tr>";
}

// ==================== Profile Save ====================
const saveProfileBtn = document.getElementById("save-profile");
if (saveProfileBtn) {
  saveProfileBtn.addEventListener("click", () => {
    const user = getCurrentUser();
    if (!user) return;
    user.profile = {
      firstName: document.getElementById("first-name")?.value || "",
      surname: document.getElementById("surname")?.value || "",
      address: document.getElementById("address")?.value || "",
      telephone: document.getElementById("telephone")?.value || "",
      email: document.getElementById("email")?.value || "",
      kinName: document.getElementById("kin-name")?.value || "",
      doctor: {
        name: document.getElementById("doctor-name")?.value || "",
        address: document.getElementById("doctor-address")?.value || "",
        telephone: document.getElementById("doctor-telephone")?.value || ""
      }
    };
    let users = loadUsers();
    let idx = users.findIndex(u => u.username === user.username);
    if (idx !== -1) {
      users[idx] = user;
      saveUsers(users);
      setCurrentUser(user);
      alert("Profile saved!");
    }
  });
}

// ==================== Signature Pad ====================
const signaturePad = document.getElementById("signature-pad");
if (signaturePad) {
  const ctx = signaturePad.getContext("2d");
  let drawing = false;

  signaturePad.addEventListener("mousedown", () => (drawing = true));
  signaturePad.addEventListener("mouseup", () => (drawing = false, ctx.beginPath()));
  signaturePad.addEventListener("mousemove", draw);

  function draw(e) {
    if (!drawing) return;
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#000";
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(e.offsetX, e.offsetY);
  }

  document.getElementById("clear-signature")?.addEventListener("click", () => {
    ctx.clearRect(0, 0, signaturePad.width, signaturePad.height);
  });
}
