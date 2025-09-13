// ---------- One-time silent reset (first install only) ----------
(function firstBootReset(){
  Const FLAG = “firstBootCleared”;
  If (!localStorage.getItem(FLAG)) {
    localStorage.clear();
    localStorage.setItem(FLAG, “true”);
  }
})();

// ---------- Storage helpers ----------
Const LS_USERS = “users”;
Const LS_CURRENT = “currentUser”;

Const getUsers = () => JSON.parse(localStorage.getItem(LS_USERS) || “[]”);
Const saveUsers = (u) => localStorage.setItem(LS_USERS, JSON.stringify(u));
Const getCurrentUser = () => JSON.parse(localStorage.getItem(LS_CURRENT) || “null”);
Const setCurrentUser = (u) => localStorage.setItem(LS_CURRENT, JSON.stringify(u));
Const clearCurrentUser = () => localStorage.removeItem(LS_CURRENT);

// ---------- Boot ----------
Document.addEventListener(“DOMContentLoaded”, () => {
  Const path = (location.pathname.split(“/”).pop() || “index.html”).toLowerCase();
  Const current = getCurrentUser();

  // Protect app pages
  Const protectedPages = [“dashboard.html”,”profile.html”,”messages.html”,”settings.html”];
  If (protectedPages.includes(path) && !current) {
    Location.href = “index.html”;
    Return;
  }

  If (path === “index.html”) initAuthPage();
  If (path === “dashboard.html”) initDashboardPage(current);
  If (path === “profile.html”) initProfilePage(current);

  // Logout (if present)
  Const logoutBtn = document.getElementById(“logout-btn”);
  If (logoutBtn) {
    logoutBtn.addEventListener(“click”, € => {
      e.preventDefault();
      clearCurrentUser();
      location.href = “index.html”;
    });
  }
});

// ---------- Auth (login/register) ----------
Function initAuthPage() {
  Const loginForm = document.getElementById(“loginForm”);
  Const registerForm = document.getElementById(“registerForm”);

  // Login
  loginForm?.addEventListener(“submit”, € => {
    e.preventDefault();
    const username = document.getElementById(“login-username”).value.trim();
    const password = document.getElementById(“login-password”).value.trim();
    const users = getUsers();
    const found = users.find(u => u.username === username && u.password === password);
    if (!found) return alert(“Invalid credentials.”);
    setCurrentUser(found);
    location.href = “dashboard.html”;
  });

  // Register
  registerForm?.addEventListener(“submit”, € => {
    e.preventDefault();
    const username = document.getElementById(“reg-username”).value.trim();
    const password = document.getElementById(“reg-password”).value.trim();
    const role = document.getElementById(“reg-role”).value;
    if (!username || !password || !role) return alert(“Please complete all fields.”);
    const users = getUsers();
    if (users.some(u => u.username === username)) return alert(“Username already exists.”);
    users.push({
      username, password, role,
      profile: { photo:null, personal:{}, nextOfKin:{}, certificates:[], medical:{}, signature:null }
    });
    saveUsers(users);
    alert(“Account created. Please log in.”);
    registerForm.reset();
  });
}

// ---------- Dashboard ----------
Function initDashboardPage(current) {
  Const vTBody = document.getElementById(“dash-vessels”);
  Const cTBody = document.getElementById(“dash-crew”);
  If (vTBody) vTBody.innerHTML = “”;
  If (cTBody) cTBody.innerHTML = “”;
}

// ---------- Profile ----------
Function initProfilePage(current) {
  If (!current) return;

  Const p = current.profile || { photo:null, personal:{}, nextOfKin:{}, certificates:[], medical:{}, signature:null };

  // Photo
  Const picInput = document.getElementById(“profile-pic”);
  Const picPrev = document.getElementById(“profile-pic-preview”);
  If (p.photo && picPrev) picPrev.src = p.photo;
  picInput?.addEventListener(“change”, € => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => { if (picPrev) picPrev.src = reader.result; };
    reader.readAsDataURL(file);
  });

  // Personal
  setVal(“first-name”, p.personal.firstName);
  setVal(“surname”, p.personal.surname);
  setVal(“address”, p.personal.address);
  setVal(“telephone”, p.personal.telephone);
  setVal(“email”, p.personal.email);

  // Kin
  setVal(“kin-relationship”, p.nextOfKin.relationship);
  setVal(“kin-name”, p.nextOfKin.name);
  setVal(“kin-address”, p.nextOfKin.address);
  setVal(“kin-telephone”, p.nextOfKin.telephone);

  // Medical
  setVal(“doctor-name”, p.medical.doctorName);
  setVal(“doctor-address”, p.medical.doctorAddress);
  setVal(“doctor-telephone”, p.medical.doctorTelephone);
  setVal(“surgery”, p.medical.surgery);
  setVal(“chronic”, p.medical.chronic);
  setVal(“medication”, p.medical.medication);

  // Certificates
  setupCertificatesTable(p.certificates || []);

  // Signature
  setupSignaturePad(p.signature);

  // Save Profile
  Document.getElementById(“save-profile-btn”)?.addEventListener(“click”, () => {
    Const users = getUsers();

    Const updated = {
      Photo: document.getElementById(“profile-pic-preview”)?.src || p.photo || null,
      Personal: {
        firstName: getVal(“first-name”),
        surname: getVal(“surname”),
        address: getVal(“address”),
        telephone: getVal(“telephone”),
        email: getVal(“email”),
      },
      nextOfKin: {
        relationship: getVal(“kin-relationship”),
        name: getVal(“kin-name”),
        address: getVal(“kin-address”),
        telephone: getVal(“kin-telephone”),
      },
      Certificates: collectCertificateRows(),
      Medical: {
        doctorName: getVal(“doctor-name”),
        doctorAddress: getVal(“doctor-address”),
        doctorTelephone: getVal(“doctor-telephone”),
        surgery: getVal(“surgery”),
        chronic: getVal(“chronic”),
        medication: getVal(“medication”),
      },
      Signature: document.getElementById(“signature-pad”).toDataURL(),
    };

    Current.profile = updated;
    Const usersAll = getUsers();
    Const idx = usersAll.findIndex(u => u.username === current.username);
    If (idx !== -1) usersAll[idx] = current;
    saveUsers(usersAll);
    setCurrentUser(current);
    alert(“Profile saved.”);
  });
}

Function setVal(id, v) { const el = document.getElementById(id); if (el) el.value = v || “”; }
Function getVal(id) { const el = document.getElementById(id); return el ? el.value.trim() : “”; }

// Certificates
Function setupCertificatesTable(existing) {
  Const tbody = document.querySelector(“#certificates-table tbody”);
  Const addBtn = document.getElementById(“add-certificate”);
  If (!tbody) return;
  Tbody.innerHTML = “”;
  (existing || []).forEach(c => appendCertRow(tbody, c));
  addBtn?.addEventListener(“click”, () => appendCertRow(tbody, {}));
}
Function appendCertRow(tbody, cert) {
  Const tr = document.createElement(“tr”);
  Tr.innerHTML = `
    <td><input type=”text” value=”${esc(cert.type)}” /></td>
    <td><input type=”text” value=”${esc(cert.number)}” /></td>
    <td><input type=”text” value=”${esc(cert.issuingBody)}” /></td>
    <td><input type=”date” value=”${esc(cert.validFrom)}” /></td>
    <td><input type=”date” value=”${esc(cert.validTo)}” /></td>
    <td><input type=”file” /></td>
    <td><button type=”button” class=”link danger”>Delete</button></td>
  `;
  Tr.querySelector(“.danger”).addEventListener(“click”, () => tr.remove());
  Tbody.appendChild(tr);
}
Function collectCertificateRows() {
  Const rows = […document.querySelectorAll(“#certificates-table tbody tr”)];
  Return rows.map(r => {
    Const inputs = r.querySelectorAll(“input”);
    Return {
      Type: inputs[0].value.trim(),
      Number: inputs[1].value.trim(),
      issuingBody: inputs[2].value.trim(),
      validFrom: inputs[3].value,
      validTo: inputs[4].value
    };
  });
}
Function esc(v){ return (v || “”).toString().replace(/”/g,”&quot;”); }

// Signature
Function setupSignaturePad(existingDataUrl) {
  Const canvas = document.getElementById(“signature-pad”);
  If (!canvas) return;
  Const ctx = canvas.getContext(“2d”);
  If (existingDataUrl) {
    Const img = new Image();
    Img.onload = () => ctx.drawImage(img, 0, 0);
    Img.src = existingDataUrl;
  }
  Let drawing = false;
  Canvas.addEventListener(“mousedown”, () => drawing = true);
  Canvas.addEventListener(“mouseup”, () => drawing = false);
  Canvas.addEventListener(“mouseleave”, () => drawing = false);
  Canvas.addEventListener(“mousemove”, € => {
    If (!drawing) return;
    Const rect = canvas.getBoundingClientRect();
    Const x = e.clientX – rect.left;
    Const y = e.clientY – rect.top;
    Ctx.fillStyle = “#000”;
    Ctx.beginPath();
    Ctx.arc(x, y, 2, 0, Math.PI * 2);
    Ctx.fill();
  });
  Document.getElementById(“clear-signature”)?.addEventListener(“click”, () => {
    Ctx.clearRect(0,0,canvas.width,canvas.height);
  });
}

