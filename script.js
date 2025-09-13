
// ===== Utility =====
function getUsers() { return JSON.parse(localStorage.getItem("users")) || []; }
function saveUsers(users) { localStorage.setItem("users", JSON.stringify(users)); }
function getCurrentUser() { return JSON.parse(localStorage.getItem("currentUser")) || null; }
function setCurrentUser(user) { localStorage.setItem("currentUser", JSON.stringify(user)); }
function clearCurrentUser() { localStorage.removeItem("currentUser"); }

// ===== DOM Ready =====
document.addEventListener("DOMContentLoaded", () => {
  const users = getUsers();
  let currentUser = getCurrentUser();

  // Login
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const username = document.getElementById("login-username").value.trim();
      const password = document.getElementById("login-password").value.trim();
      const user = users.find((u) => u.username === username && u.password === password);
      if (user) { setCurrentUser(user); window.location.href = "dashboard.html"; }
      else { alert("Invalid credentials"); }
    });
  }

  // Register
  const registerForm = document.getElementById("registerForm");
  if (registerForm) {
    registerForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const username = document.getElementById("reg-username").value.trim();
      const password = document.getElementById("reg-password").value.trim();
      const role = document.getElementById("reg-role").value;
      if (!username || !password || !role) { alert("Please complete all fields"); return; }
      if (users.find((u) => u.username === username)) { alert("Username exists"); return; }
      const newUser = { username, password, role,
        profile: { personal:{}, nextOfKin:{}, certificates:[], medical:{}, signature:null }
      };
      users.push(newUser); saveUsers(users);
      alert("Account created. Please login."); registerForm.reset();
    });
  }

  // Logout
  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) logoutBtn.addEventListener("click", () => { clearCurrentUser(); window.location.href="index.html"; });

  // Profile page
  if (window.location.pathname.includes("profile.html") && currentUser) {
    loadProfile(currentUser);
    document.getElementById("save-profile-btn").addEventListener("click", () => saveProfile(currentUser));
    setupSignaturePad();
    setupCertificates(currentUser);
  }
});

// ===== Load Profile =====
function loadProfile(user) {
  const p = user.profile || {};
  document.getElementById("first-name").value = p.personal?.firstName || "";
  document.getElementById("surname").value = p.personal?.surname || "";
  document.getElementById("address").value = p.personal?.address || "";
  document.getElementById("telephone").value = p.personal?.telephone || "";
  document.getElementById("email").value = p.personal?.email || "";
  document.getElementById("kin-relationship").value = p.nextOfKin?.relationship || "";
  document.getElementById("kin-name").value = p.nextOfKin?.name || "";
  document.getElementById("kin-address").value = p.nextOfKin?.address || "";
  document.getElementById("kin-telephone").value = p.nextOfKin?.telephone || "";
  document.getElementById("doctor-name").value = p.medical?.doctorName || "";
  document.getElementById("doctor-address").value = p.medical?.doctorAddress || "";
  document.getElementById("doctor-telephone").value = p.medical?.doctorTelephone || "";
  if (p.signature) { const ctx = document.getElementById("signature-pad").getContext("2d"); const img = new Image(); img.src = p.signature; img.onload = () => ctx.drawImage(img,0,0); }
}

// ===== Save Profile =====
function saveProfile(user) {
  const users = getUsers();
  user.profile = {
    personal: {
      firstName: document.getElementById("first-name").value,
      surname: document.getElementById("surname").value,
      address: document.getElementById("address").value,
      telephone: document.getElementById("telephone").value,
      email: document.getElementById("email").value,
    },
    nextOfKin: {
      relationship: document.getElementById("kin-relationship").value,
      name: document.getElementById("kin-name").value,
      address: document.getElementById("kin-address").value,
      telephone: document.getElementById("kin-telephone").value,
    },
    certificates: getCertificateData(),
    medical: {
      doctorName: document.getElementById("doctor-name").value,
      doctorAddress: document.getElementById("doctor-address").value,
      doctorTelephone: document.getElementById("doctor-telephone").value,
    },
    signature: document.getElementById("signature-pad").toDataURL(),
  };
  const idx = users.findIndex((u)=>u.username===user.username);
  users[idx] = user; saveUsers(users); setCurrentUser(user);
  alert("Profile saved successfully!");
}

// ===== Signature =====
function setupSignaturePad() {
  const canvas = document.getElementById("signature-pad"); if (!canvas) return;
  const ctx = canvas.getContext("2d"); let drawing=false;
  canvas.addEventListener("mousedown", ()=>drawing=true);
  canvas.addEventListener("mouseup", ()=>drawing=false);
  canvas.addEventListener("mousemove", (e)=>{ if(!drawing)return; ctx.fillStyle="#000"; ctx.beginPath(); ctx.arc(e.offsetX,e.offsetY,2,0,Math.PI*2); ctx.fill(); });
  const clearBtn=document.getElementById("clear-signature");
  if(clearBtn) clearBtn.addEventListener("click",()=>ctx.clearRect(0,0,canvas.width,canvas.height));
}

// ===== Certificates =====
function setupCertificates(user) {
  const table=document.getElementById("certificates-table").querySelector("tbody");
  const addBtn=document.getElementById("add-certificate");
  table.innerHTML=""; (user.profile.certificates||[]).forEach(c=>addCertificateRow(table,c));
  addBtn.addEventListener("click",()=>addCertificateRow(table,{}));
}
function addCertificateRow(table, cert) {
  const row=table.insertRow();
  row.innerHTML=`
    <td><input type="text" value="${cert.type||""}"></td>
    <td><input type="text" value="${cert.number||""}"></td>
    <td><input type="text" value="${cert.issuingBody||""}"></td>
    <td><input type="date" value="${cert.validFrom||""}"></td>
    <td><input type="date" value="${cert.validTo||""}"></td>
    <td><input type="file"></td>
    <td><button type="button" onclick="this.closest('tr').remove()">Delete</button></td>`;
}
function getCertificateData() {
  const rows=document.getElementById("certificates-table").querySelector("tbody").rows;
  const data=[]; for(let row of rows){data.push({
    type: row.cells[0].querySelector("input").value,
    number: row.cells[1].querySelector("input").value,
    issuingBody: row.cells[2].querySelector("input").value,
    validFrom: row.cells[3].querySelector("input").value,
    validTo: row.cells[4].querySelector("input").value,
  });}
  return data;
}
