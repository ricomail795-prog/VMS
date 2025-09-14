// ==================== User Handling ====================
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

function getUserProfile(username) {
  const users = getUsers();
  return users.find(u => u.username === username);
}

// ==================== Registration ====================
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
      showConfirmation("❌ Username already exists", "error");
      return;
    }

    const newUser = { username, password, role, lang };
    users.push(newUser);
    saveUsers(users);

    logActivity(`Registered new account (${role})`, "success", username);

    showConfirmation("✔ Account created! You can now log in.", "success");
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

    const users = getUsers();
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
      setCurrentUser(user);
      logActivity(`User logged in as ${user.role}`, "success", username);
      showConfirmation(`✔ Welcome back, ${username}!`, "success");

      // Redirect based on role
      if (user.role === "admin") {
        window.location.href = "dashboard.html";
      } else if (user.role === "crew") {
        window.location.href = "messages.html";
      } else if (user.role === "manager") {
        window.location.href = "profile.html";
      }
    } else {
      showConfirmation("❌ Invalid username or password", "error");
    }
  });
}

// ==================== Logs ====================
function logActivity(message, type = "success", userOverride = null) {
  const current = getCurrentUser();
  const username = userOverride || (current ? current.username : "System");

  const entry = {
    time: new Date().toLocaleString(),
    message,
    type,
    user: username
  };

  // User-specific log (20 entries)
  let userLogs = JSON.parse(localStorage.getItem(`recentActivity_${username}`)) || [];
  userLogs.unshift(entry);
  if (userLogs.length > 20) userLogs = userLogs.slice(0, 20);
  localStorage.setItem(`recentActivity_${username}`, JSON.stringify(userLogs));

  // Global log (1000 per user)
  let globalLogs = JSON.parse(localStorage.getItem("globalActivity")) || {};
  if (!globalLogs[username]) globalLogs[username] = [];
  globalLogs[username].unshift(entry);
  if (globalLogs[username].length > 1000) {
    globalLogs[username] = globalLogs[username].slice(0, 1000);
  }
  localStorage.setItem("globalActivity", JSON.stringify(globalLogs));

  renderActivityLog();
  renderGlobalLog();
}

function renderActivityLog() {
  // Optional per-user log viewer
}

function renderGlobalLog() {
  const container = document.getElementById("global-activity");
  if (!container) return;

  container.innerHTML = "";
  const globalLogs = JSON.parse(localStorage.getItem("globalActivity")) || {};

  Object.keys(globalLogs).forEach(user => {
    // User filter
    if (filterOptions.user && !user.toLowerCase().includes(filterOptions.user.toLowerCase())) return;

    const section = document.createElement("div");
    section.classList.add("user-log");

    const header = document.createElement("h4");
    header.textContent = `User: ${user} (${globalLogs[user].length} entries)`;

    const list = document.createElement("ul");

    globalLogs[user].forEach(log => {
      // Apply filters
      if (filterOptions.keyword && !log.message.toLowerCase().includes(filterOptions.keyword.toLowerCase())) return;
      if (filterOptions.date) {
        const logDate = new Date(log.time).toISOString().split("T")[0];
        if (logDate !== filterOptions.date) return;
      }
      if (filterOptions.role) {
        const profile = getUserProfile(log.user);
        if (!profile || profile.role !== filterOptions.role) return;
      }

      const li = document.createElement("li");
      li.textContent = `${log.time} - ${log.message}`;
      li.classList.add(log.type);
      list.appendChild(li);
    });

    if (list.childNodes.length === 0) return;

    const btnExport = document.createElement("button");
    btnExport.textContent = `Export ${user}'s Log`;
    btnExport.onclick = () => exportUserLog(user);

    const btnClear = document.createElement("button");
    btnClear.textContent = `Clear ${user}'s Log`;
    btnClear.onclick = () => clearUserGlobalLog(user);

    section.appendChild(header);
    section.appendChild(btnExport);
    section.appendChild(btnClear);
    section.appendChild(list);

    container.appendChild(section);
  });
}

// ==================== Filters ====================
let filterOptions = { user: "", keyword: "", date: "", role: "" };

document.getElementById("apply-filters")?.addEventListener("click", () => {
  filterOptions.user = document.getElementById("filter-user").value.trim();
  filterOptions.keyword = document.getElementById("filter-keyword").value.trim();
  filterOptions.date = document.getElementById("filter-date").value;
  filterOptions.role = document.getElementById("filter-role").value;
  renderGlobalLog();
});

document.getElementById("clear-filters")?.addEventListener("click", () => {
  filterOptions = { user: "", keyword: "", date: "", role: "" };
  document.getElementById("filter-user").value = "";
  document.getElementById("filter-keyword").value = "";
  document.getElementById("filter-date").value = "";
  document.getElementById("filter-role").value = "";
  renderGlobalLog();
});

// ==================== Export Functions ====================
function exportUserLog(user) {
  let globalLogs = JSON.parse(localStorage.getItem("globalActivity")) || {};
  if (!globalLogs[user]) return;

  let csv = "Time,Message,Type,User,Role\n";
  globalLogs[user].forEach(log => {
    const role = getUserProfile(log.user)?.role || "Unknown";
    csv += `"${log.time}","${log.message}","${log.type}","${log.user}","${role}"\n`;
  });

  const blob = new Blob([csv], { type: "text/csv" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${user}_activity_log.csv`;
  link.click();
}

function exportFilteredLogs() {
  const globalLogs = JSON.parse(localStorage.getItem("globalActivity")) || {};
  let csv = "Time,Message,Type,User,Role\n";

  Object.keys(globalLogs).forEach(user => {
    globalLogs[user].forEach(log => {
      if (filterOptions.user && !user.toLowerCase().includes(filterOptions.user.toLowerCase())) return;
      if (filterOptions.keyword && !log.message.toLowerCase().includes(filterOptions.keyword.toLowerCase())) return;
      if (filterOptions.date) {
        const logDate = new Date(log.time).toISOString().split("T")[0];
        if (logDate !== filterOptions.date) return;
      }
      if (filterOptions.role) {
        const profile = getUserProfile(log.user);
        if (!profile || profile.role !== filterOptions.role) return;
      }

      const role = getUserProfile(log.user)?.role || "Unknown";
      csv += `"${log.time}","${log.message}","${log.type}","${log.user}","${role}"\n`;
    });
  });

  if (csv === "Time,Message,Type,User,Role\n") {
    showConfirmation("⚠ No logs match the current filters", "error");
    return;
  }

  const blob = new Blob([csv], { type: "text/csv" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "filtered_activity_log.csv";
  link.click();
}

async function exportAllLogsZIP() {
  const globalLogs = JSON.parse(localStorage.getItem("globalActivity")) || {};
  const zip = new JSZip();
  let hasData = false;

  for (const user of Object.keys(globalLogs)) {
    let csv = "Time,Message,Type,User,Role\n";
    globalLogs[user].forEach(log => {
      const role = getUserProfile(log.user)?.role || "Unknown";
      csv += `"${log.time}","${log.message}","${log.type}","${log.user}","${role}"\n`;
    });
    if (globalLogs[user].length > 0) {
      zip.file(`${user}_activity_log.csv`, csv);
      hasData = true;
    }
  }

  if (!hasData) {
    showConfirmation("⚠ No logs available to export", "error");
    return;
  }

  const content = await zip.generateAsync({ type: "blob" });
  saveAs(content, "all_activity_logs.zip");
  showConfirmation("✔ All logs exported as ZIP", "success");
}

document.getElementById("export-filters")?.addEventListener("click", exportFilteredLogs);
document.getElementById("export-all-zip")?.addEventListener("click", exportAllLogsZIP);

// ==================== Clear Functions ====================
document.getElementById("clear-global-log")?.addEventListener("click", () => {
  const profile = getCurrentUser();
  if (profile?.role === "admin") {
    localStorage.removeItem("globalActivity");
    showConfirmation("✔ All global logs cleared", "success");
    renderGlobalLog();
  } else {
    showConfirmation("❌ Only admins can clear global logs", "error");
  }
});

function clearUserGlobalLog(user) {
  let globalLogs = JSON.parse(localStorage.getItem("globalActivity")) || {};
  delete globalLogs[user];
  localStorage.setItem("globalActivity", JSON.stringify(globalLogs));
  showConfirmation(`✔ Global log cleared for ${user}`, "success");
  renderGlobalLog();
}

// ==================== Confirmations ====================
function showConfirmation(message, type) {
  const bar = document.createElement("div");
  bar.textContent = message;
  bar.className = `confirmation ${type}`;
  document.body.prepend(bar);
  setTimeout(() => bar.remove(), 5000);
}
