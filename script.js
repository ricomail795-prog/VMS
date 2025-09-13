// ===============================
// One-time silent reset of localStorage
// ===============================
If (!localStorage.getItem(“firstResetDone”)) {
  localStorage.clear();
  localStorage.setItem(“firstResetDone”, “true”);
}

// ===============================
// Default avatar (Base64 silhouette)
// ===============================
Const defaultAvatar =
  “data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAABm0lEQVR4nO3csU3DQBRA0aWg” +
  “GoRoEaJGgRoEo0aJGgRoEaJGgRoEZ7wkK28+59d5d8/Z2c5XwnsP0O8gzIAAAAAAAAAAAAAAAAz6CUnjnsn6E7/6iT5XkYF7O0dRrR” +
  “URW2myCZR3bGmYgykm2+2zTL0+ImyPluPHTm6AhENOp9AVgMURQugvGRYFYF1FELoDxnWBaBVRVC6A8Z1gWgVUVQugPGdYFoFVFULo” +
  “DxnWBaBVRVC6A8Z1gWgVUVQugPGdYFoFVFULoDxnWBaBVRVC6A8Z1gWgVUVQugPGdYFoFVFULoDxnWBaBVRVC6A8Z1gWgVUVQugPGd” +
  “YFoFVFULoDxnWBaBVRVC6A8Z1gWgVUVQugPGdYFoFVFUP4FMG3O/zsYfM6yZsda5j30upfy+Qxz0n6cvITMzAAAAAAAAAAAAAAAAAA” +
  “AA+Bc8AhKx+CDp6+dwAAAAASUVORK5CYII=”;

// ===============================
// Utility functions
// ===============================
Function getUsers() {
  Return JSON.parse(localStorage.getItem(“users”) || “[]”);
}
Function saveUsers(users) {
  localStorage.setItem(“users”, JSON.stringify(users));
}
Function getCurrentUser() {
  Return JSON.parse(localStorage.getItem(“currentUser”) || “null”);
}
Function setCurrentUser(user) {
  localStorage.setItem(“currentUser”, JSON.stringify(user));
}
Function clearCurrentUser() {
  localStorage.removeItem(“currentUser”);
}

// ===============================
// Login / Register Logic
// ===============================
Document.addEventListener(“DOMContentLoaded”, () => {
  Const loginForm = document.getElementById(“loginForm”);
  Const registerForm = document.getElementById(“registerForm”);

  If (loginForm) {
    loginForm.addEventListener(“submit”, € => {
      e.preventDefault();
      const username = document.getElementById(“login-username”).value.trim();
      const password = document.getElementById(“login-password”).value.trim();
      const users = getUsers();
      const found = users.find(
        (u) => u.username === username && u.password === password
      );
      If (found) {
        setCurrentUser(found);
        window.location.href = “dashboard.html”;
      } else {
        Alert(“Invalid credentials.”);
      }
    });
  }

  If (registerForm) {
    registerForm.addEventListener(“submit”, € => {
      e.preventDefault();
      const username = document.getElementById(“reg-username”).value.trim();
      const password = document.getElementById(“reg-password”).value.trim();
      const role = document.getElementById(“reg-role”).value;
      if (!username || !password || !role) {
        alert(“Fill all fields”);
        return;
      }
      Let users = getUsers();
      If (users.find((u) => u.username === username)) {
        Alert(“Username already exists”);
        Return;
      }
      Const newUser = {
        Username,
        Password,
        Role,
        Profile: {},
        Messages: [],
        Avatar: defaultAvatar,
      };
      Users.push(newUser);
      saveUsers(users);
      alert(“Account created. Please log in.”);
      registerForm.reset();
    });
  }

  // Logout
  Const logoutBtn = document.getElementById(“logoutBtn”);
  If (logoutBtn) {
    logoutBtn.addEventListener(“click”, () => {
      clearCurrentUser();
      window.location.href = “index.html”;
    });
  }

  // Sidebar avatar
  Const sidebarAvatar = document.getElementById(“sidebar-avatar”);
  If (sidebarAvatar) {
    Const user = getCurrentUser();
    If (user && user.avatar) {
      sidebarAvatar.src = user.avatar;
    } else {
      sidebarAvatar.src = defaultAvatar;
    }
  }

  // Dashboard tables
  Const vesselTable = document.getElementById(“vesselTable”);
  Const crewTable = document.getElementById(“crewTable”);
  If (vesselTable || crewTable) {
    Const users = getUsers();
    If (crewTable) {
      Const tbody = crewTable.querySelector(“tbody”);
      Tbody.innerHTML = “”;
      Users
        .filter((u) => u.role === “crew”)
        .forEach((crew) => {
          Const tr = document.createElement(“tr”);
          Const avatarTd = document.createElement(“td”);
          Const img = document.createElement(“img”);
          Img.src = crew.avatar || defaultAvatar;
          Img.classList.add(“avatar-circle”);
          Img.style.width = “40px”;
          Img.style.height = “40px”;
          avatarTd.appendChild(img);

          tr.innerHTML = `
            <td></td>
            <td>${crew.username}</td>
            <td>${crew.profile.rank || “”}</td>
            <td>${crew.profile.assignedVessel || “”}</td>
          `;
          Tr.replaceChild(avatarTd, tr.firstChild);
          Tbody.appendChild(tr);
        });
    }
  }

  // Profile page
  Const saveProfileBtn = document.getElementById(“saveProfileBtn”);
  If (saveProfileBtn) {
    Const currentUser = getCurrentUser();
    If (!currentUser) {
      Window.location.href = “index.html”;
      Return;
    }

    // Profile picture
    Const picUpload = document.getElementById(“profilePicUpload”);
    Const picPreview = document.getElementById(“profilePicPreview”);
    If (picPreview) {
      picPreview.src = currentUser.avatar || defaultAvatar;
    }
    If (picUpload) {
      picUpload.addEventListener(“change”, € => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = function (ev) {
            picPreview.src = ev.target.result;
            currentUser.avatar = ev.target.result;
            setCurrentUser(currentUser);
            let users = getUsers();
            const idx = users.findIndex((u) => u.username === currentUser.username);
            users[idx] = currentUser;
            saveUsers(users);
            const sidebarAvatar = document.getElementById(“sidebar-avatar”);
            if (sidebarAvatar) sidebarAvatar.src = ev.target.result;
          };
          Reader.readAsDataURL(file);
        }
      });
    }

    // Save Profile button
    saveProfileBtn.addEventListener(“click”, () => {
      // Collect data
      Const profile = {
        firstName: document.getElementById(“firstName”).value.trim(),
        surname: document.getElementById(“surname”).value.trim(),
        address: document.getElementById(“address”).value.trim(),
        telephone: document.getElementById(“telephone”).value.trim(),
        email: document.getElementById(“email”).value.trim(),
        nokRelationship: document.getElementById(“nokRelationship”).value.trim(),
        nokName: document.getElementById(“nokName”).value.trim(),
        nokAddress: document.getElementById(“nokAddress”).value.trim(),
        nokTelephone: document.getElementById(“nokTelephone”).value.trim(),
        doctorName: document.getElementById(“doctorName”).value.trim(),
        doctorAddress: document.getElementById(“doctorAddress”).value.trim(),
        doctorTelephone: document.getElementById(“doctorTelephone”).value.trim(),
        q1: document.getElementById(“q1”).value,
        q2: document.getElementById(“q2”).value,
        q3: document.getElementById(“q3”).value,
        declaredName: document.getElementById(“declaredName”).value.trim(),
        finalDeclaration: document.getElementById(“finalDeclaration”).checked,
      };

      currentUser.profile = profile;

      // Signature
      Const sigPreview = document.getElementById(“signaturePreview”);
      If (sigPreview && sigPreview.src) {
        currentUser.profile.signature = sigPreview.src;
      }

      setCurrentUser(currentUser);
      let users = getUsers();
      const idx = users.findIndex((u) => u.username === currentUser.username);
      users[idx] = currentUser;
      saveUsers(users);
      alert(“Profile saved.”);
    });

    // Signature Pad
    Const signaturePad = document.getElementById(“signaturePad”);
    If (signaturePad) {
      Const ctx = signaturePad.getContext(“2d”);
      Let drawing = false;
      signaturePad.addEventListener(“mousedown”, () => (drawing = true));
      signaturePad.addEventListener(“mouseup”, () => (drawing = false));
      signaturePad.addEventListener(“mouseout”, () => (drawing = false));
      signaturePad.addEventListener(“mousemove”, draw);

      function draw€ {
        if (!drawing) return;
        ctx.fillStyle = “black”;
        ctx.beginPath();
        ctx.arc(
          e.offsetX,
          e.offsetY,
          2,
          0,
          Math.PI * 2
        );
        Ctx.fill();
      }

      Const clearBtn = document.getElementById(“clearSignature”);
      If (clearBtn) {
        clearBtn.addEventListener(“click”, () => {
          ctx.clearRect(0, 0, signaturePad.width, signaturePad.height);
          const sigPreview = document.getElementById(“signaturePreview”);
          if (sigPreview) sigPreview.src = “”;
        });
      }

      signaturePad.addEventListener(“mouseup”, () => {
        const sigPreview = document.getElementById(“signaturePreview”);
        sigPreview.src = signaturePad.toDataURL();
      });
    }
  }

  // Messages
  Const messageForm = document.getElementById(“messageForm”);
  If (messageForm) {
    Const currentUser = getCurrentUser();
    If (!currentUser) {
      Window.location.href = “index.html”;
      Return;
    }

    Const messagesTable = document
      .getElementById(“messagesTable”)
      .querySelector(“tbody”);

    Function renderMessages() {
      messagesTable.innerHTML = “”;
      currentUser.messages.forEach((msg) => {
        const tr = document.createElement(“tr”);
        tr.innerHTML = `
          <td>${msg.status}</td>
          <td>${msg.subject}</td>
          <td>${msg.body}</td>
          <td>${msg.date}</td>
        `;
        messagesTable.appendChild(tr);
      });
    }

    renderMessages();

    messageForm.addEventListener(“submit”, € => {
      e.preventDefault();
      const subject = document.getElementById(“messageSubject”).value.trim();
      const body = document.getElementById(“messageBody”).value.trim();
      const newMsg = {
        status: “sent”,
        subject,
        body,
        date: new Date().toLocaleString(),
      };
      currentUser.messages.push(newMsg);
      setCurrentUser(currentUser);
      let users = getUsers();
      const idx = users.findIndex((u) => u.username === currentUser.username);
      users[idx] = currentUser;
      saveUsers(users);
      renderMessages();
      messageForm.reset();
    });
  }
});

