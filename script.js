document.addEventListener("DOMContentLoaded", () => {
  if (!localStorage.getItem("users")) localStorage.setItem("users", JSON.stringify([]));
  if (!localStorage.getItem("currentUser")) localStorage.setItem("currentUser", "null");
  if (!localStorage.getItem("vessels")) localStorage.setItem("vessels", JSON.stringify([]));
  if (!localStorage.getItem("crew")) localStorage.setItem("crew", JSON.stringify([]));
  if (!localStorage.getItem("messages")) localStorage.setItem("messages", JSON.stringify([]));

  const loginBtn = document.getElementById("login-btn");
  if (loginBtn) {
    loginBtn.addEventListener("click", () => {
      const u = document.getElementById("login-username").value.trim();
      const p = document.getElementById("login-password").value.trim();
      const users = JSON.parse(localStorage.getItem("users"));
      const found = users.find(x => x.username === u && x.password === p);
      if (found) {
        localStorage.setItem("currentUser", JSON.stringify(found));
        window.location.href = "dashboard.html";
      } else { alert("Invalid credentials"); }
    });
  }

  const regBtn = document.getElementById("register-btn");
  if (regBtn) {
    regBtn.addEventListener("click", () => {
      const u = document.getElementById("register-username").value.trim();
      const p = document.getElementById("register-password").value.trim();
      if (!u || !p) { alert("Enter details"); return; }
      let users = JSON.parse(localStorage.getItem("users"));
      if (users.find(x => x.username === u)) { alert("User exists"); return; }
      const newUser = { username: u, password: p };
      users.push(newUser);
      localStorage.setItem("users", JSON.stringify(users));
      alert("User registered. Please login.");
    });
  }

  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.setItem("currentUser", "null");
      window.location.href = "index.html";
    });
  }

  if (document.getElementById("vessel-form")) {
    const vesselForm = document.getElementById("vessel-form");
    const vesselTable = document.getElementById("vessel-table");
    let vessels = JSON.parse(localStorage.getItem("vessels"));
    renderTable(vesselTable, vessels, ["name","location","project","status"]);
    vesselForm.addEventListener("submit", e => {
      e.preventDefault();
      const v = {
        name: document.getElementById("vessel-name").value,
        location: document.getElementById("vessel-location").value,
        project: document.getElementById("vessel-project").value,
        status: document.getElementById("vessel-status").value
      };
      vessels.push(v);
      localStorage.setItem("vessels", JSON.stringify(vessels));
      renderTable(vesselTable, vessels, ["name","location","project","status"]);
      vesselForm.reset();
    });
  }

  if (document.getElementById("crew-form")) {
    const crewForm = document.getElementById("crew-form");
    const crewTable = document.getElementById("crew-table");
    let crew = JSON.parse(localStorage.getItem("crew"));
    renderTable(crewTable, crew, ["username","fullName","rank","vessel"]);
    crewForm.addEventListener("submit", e => {
      e.preventDefault();
      const c = {
        username: document.getElementById("crew-username").value,
        fullName: document.getElementById("crew-name").value,
        rank: document.getElementById("crew-rank").value,
        vessel: document.getElementById("crew-vessel").value
      };
      crew.push(c);
      localStorage.setItem("crew", JSON.stringify(crew));
      renderTable(crewTable, crew, ["username","fullName","rank","vessel"]);
      crewForm.reset();
    });
  }

  if (document.getElementById("message-form")) {
    const msgForm = document.getElementById("message-form");
    const msgTable = document.getElementById("message-table");
    let messages = JSON.parse(localStorage.getItem("messages"));
    renderTable(msgTable, messages, ["to","subject","body"]);
    msgForm.addEventListener("submit", e => {
      e.preventDefault();
      const m = {
        to: document.getElementById("message-to").value,
        subject: document.getElementById("message-subject").value,
        body: document.getElementById("message-body").value
      };
      messages.push(m);
      localStorage.setItem("messages", JSON.stringify(messages));
      renderTable(msgTable, messages, ["to","subject","body"]);
      msgForm.reset();
    });
  }

  if (document.getElementById("profile-form")) {
    const profileForm = document.getElementById("profile-form");
    const nameEl = document.getElementById("profile-name");
    const emailEl = document.getElementById("profile-email");
    const phoneEl = document.getElementById("profile-phone");
    const progressFill = document.getElementById("progress-fill");
    let currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (currentUser && currentUser !== "null") {
      nameEl.value = currentUser.fullName || "";
      emailEl.value = currentUser.email || "";
      phoneEl.value = currentUser.phone || "";
    }
    profileForm.addEventListener("submit", e => {
      e.preventDefault();
      currentUser.fullName = nameEl.value;
      currentUser.email = emailEl.value;
      currentUser.phone = phoneEl.value;
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
      let users = JSON.parse(localStorage.getItem("users"));
      users = users.map(u => u.username === currentUser.username ? currentUser : u);
      localStorage.setItem("users", JSON.stringify(users));
      updateProgress();
    });
    function updateProgress() {
      let filled = 0;
      if (nameEl.value) filled++;
      if (emailEl.value) filled++;
      if (phoneEl.value) filled++;
      const percent = Math.round((filled/3)*100);
      progressFill.style.width = percent + "%";
      progressFill.textContent = percent + "%";
    }
    updateProgress();
  }

  function renderTable(tbody, items, keys) {
    tbody.innerHTML = "";
    items.forEach(it => {
      let row = "<tr>";
      keys.forEach(k => { row += `<td>${it[k] || ""}</td>`; });
      row += "</tr>";
      tbody.innerHTML += row;
    });
  }
});