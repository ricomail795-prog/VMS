
// ---------- Storage helpers ----------
const LS_USERS = "users";
const LS_CURRENT = "currentUser";

const getUsers = () => JSON.parse(localStorage.getItem(LS_USERS) || "[]");
const saveUsers = (u) => localStorage.setItem(LS_USERS, JSON.stringify(u));
const getCurrentUser = () => JSON.parse(localStorage.getItem(LS_CURRENT) || "null");
const setCurrentUser = (u) => localStorage.setItem(LS_CURRENT, JSON.stringify(u));
const clearCurrentUser = () => localStorage.removeItem(LS_CURRENT);

// ---------- Boot ----------
document.addEventListener("DOMContentLoaded", () => {
  const path = location.pathname.split("/").pop().toLowerCase() || "index.html";
  const current = getCurrentUser();

  // Auth guard for app pages
  const protectedPages = ["dashboard.html","profile.html","messages.html","settings.html"];
  if (protectedPages.includes(path) && !current) {
    location.href = "index.html";
    return;
  }

  // Attach page-specific behavior
  if (path === "index.html") initAuthPage();
  if (path === "dashboard.html") initDashboardPage(current);
  if (path === "profile.html") initProfilePage(current);

  // Logout button (if present)
  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) logoutBtn.addEventListener("click", (e) => {
    e.preventDefault();
    clearCurrentUser();
    location.href = "index.html";
  });
});

// ---------- Auth page ----------
function initAuthPage() {
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");

  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const username = document.getElementById("login-username").value.trim();
      const password = document.getElementById("login-password").value.trim();
      const users = getUsers();
      const found = users.find(u => u.username === username && u.password === password);
      if (!found) return alert("Invalid credentials.");
      setCurrentUser(found);
      location.href = "dashboard.html";
    });
  }

  if (registerForm) {
    registerForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const username = document.getElementById("reg-username").value.trim();
      const password = document.getElementById("reg-password").value.trim();
      const role = document.getElementById("reg-role").value;
      if (!username || !password || !role) return alert("Please complete all fields.");
      const users = getUsers();
      if (users.some(u => u.username === username)) return alert("Username already exists.");
      users.push({
        username, password, role,
        profile: { personal:{}, nextOfKin:{}, certificates:[], medical:{}, signature:null, photo:null }
      });
      saveUsers(users);
      alert("Account created. Please log in.");
      registerForm.reset();
    });
  }
}

// ---------- Dashboard ----------
function initDashboardPage(current) {
  // You can fill these tables later; keeping them empty as requested.
  const vTBody = document.getElementById("dash-vessels");
  const cTBody = document.getElementById("dash-crew");
  if (vTBody) vTBody.innerHTML = ""; // no demo rows
  if (cTBody) cTBody.innerHTML = ""; // no demo rows
}

// ---------- Profile ----------
function initProfilePage(current) {
  if (!current) return;

  // Load existing
  const p = current.profile || { personal:{}, nextOfKin:{}, certificates:[], medical:{}, signature:null, photo:null };

  // Photo preview
  const picInput = document.getElementById("profile-pic");
  const picPrev = document.getElementById("profile-pic-preview");
  if (p.photo) picPrev.src = p.photo;
  if (picInput) {
    picInput.addEventListener("change", (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => { picPrev.src = reader.result; };
      reader.readAsDataURL(file);
    });
  }

  // Personal
  setVal("first-name", p.personal.firstName);
  setVal("surname", p.personal.surname);
  setVal("address", p.personal.address);
  setVal("telephone", p.personal.telephone);
  setVal("email", p.personal.email);

  // Kin
  setVal("kin-relationship", p.nextOfKin.relationship);
  setVal("kin-name", p.nextOfKin.name);
  setVal("kin-address", p.nextOfKin.address);
  setVal("kin-telephone", p.nextOfKin.telephone);

  // Medical
  setVal("doctor-name", p.medical.doctorName);
  setVal("doctor-address", p.medical.doctorAddress);
  setVal("doctor-telephone", p.medical.doctorTelephone);
  setVal("surgery", p.medical.surgery);
  setVal("chronic", p.medical.chronic);
  setVal("medication", p.medical.medication);

  // Certificates
  setupCertificatesTable(p.certificates || []);

  // Signature
  setupSignaturePad(p.signature);

  // Save
  const saveBtn = document.getElementById("save-profile-btn");
  saveBtn?.addEventListener("click", () => {
    const users = getUsers();
    // build updated profile
    const updated = {
      photo: picPrev?.src || null,
      personal: {
        firstName: getVal("first-name"),
        surname: getVal("surname"),
        address: getVal("address"),
        telephone: getVal("telephone"),
        email: getVal("email"),
      },
      nextOfKin: {
        relationship: getVal("kin-relationship"),
        name: getVal("kin-name"),
        address: getVal("kin-address"),
        telephone: getVal("kin-telephone"),
      },
      certificates: collectCertificateRows(),
      medical: {
        doctorName: getVal("doctor-name"),
        doctorAddress: getVal("doctor-address"),
        doctorTelephone: getVal("doctor-telephone"),
        surgery: getVal("surgery"),
        chronic: getVal("chronic"),
        medication: getVal("medication"),
      },
      signature: document.getElementById("signature-pad").toDataURL(),
    };

    // persist
    current.profile = updated;
    const idx = users.findIndex(u => u.username === current.username);
    if (idx !== -1) users[idx] = current;
    saveUsers(users);
    setCurrentUser(current);
    alert("Profile saved.");
  });
}

function setVal(id, v) { const el = document.getElementById(id); if (el) el.value = v || ""; }
function getVal(id) { const el = document.getElementById(id); return el ? el.value.trim() : ""; }

// Certificates
function setupCertificatesTable(existing) {
  const tbody = document.querySelector("#certificates-table tbody");
  const addBtn = document.getElementById("add-certificate");
  tbody.innerHTML = "";
  (existing || []).forEach(c => appendCertRow(tbody, c));
  addBtn?.addEventListener("click", () => appendCertRow(tbody, {}));
}
function appendCertRow(tbody, cert) {
  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td><input type="text" value="${esc(cert.type)}" /></td>
    <td><input type="text" value="${esc(cert.number)}" /></td>
    <td><input type="text" value="${esc(cert.issuingBody)}" /></td>
    <td><input type="date" value="${esc(cert.validFrom)}" /></td>
    <td><input type="date" value="${esc(cert.validTo)}" /></td>
    <td><input type="file" /></td>
    <td><button type="button" class="link danger">Delete</button></td>
  `;
  tr.querySelector(".danger").addEventListener("click", () => tr.remove());
  tbody.appendChild(tr);
}
function collectCertificateRows() {
  const rows = [...document.querySelectorAll("#certificates-table tbody tr")];
  return rows.map(r => {
    const inputs = r.querySelectorAll("input");
    return {
      type: inputs[0].value.trim(),
      number: inputs[1].value.trim(),
      issuingBody: inputs[2].value.trim(),
      validFrom: inputs[3].value,
      validTo: inputs[4].value
    };
  });
}
function esc(v){ return (v || "").toString().replace(/"/g,"&quot;"); }

// Signature
function setupSignaturePad(existingDataUrl) {
  const canvas = document.getElementById("signature-pad");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (existingDataUrl) {
    const img = new Image();
    img.onload = () => ctx.drawImage(img, 0, 0);
    img.src = existingDataUrl;
  }
  let drawing = false;
  canvas.addEventListener("mousedown", () => drawing = true);
  canvas.addEventListener("mouseup", () => drawing = false);
  canvas.addEventListener("mouseleave", () => drawing = false);
  canvas.addEventListener("mousemove", (e) => {
    if (!drawing) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    ctx.fillStyle = "#000";
    ctx.beginPath();
    ctx.arc(x, y, 2, 0, Math.PI * 2);
    ctx.fill();
  });
  document.getElementById("clear-signature")?.addEventListener("click", () => {
    ctx.clearRect(0,0,canvas.width,canvas.height);
  });
}
