// Handle Registration
document.addEventListener("DOMContentLoaded", () => {
  const regForm = document.getElementById("registerForm");
  const loginForm = document.getElementById("loginForm");
  const profileDiv = document.getElementById("profileInfo");
  const logoutBtn = document.getElementById("logoutBtn");

  // Signature pad
  const sigCanvas = document.getElementById("signaturePad");
  if (sigCanvas) {
    const ctx = sigCanvas.getContext("2d");
    let drawing = false;

    sigCanvas.addEventListener("mousedown", () => (drawing = true));
    sigCanvas.addEventListener("mouseup", () => (drawing = false));
    sigCanvas.addEventListener("mousemove", draw);
    sigCanvas.addEventListener("touchstart", () => (drawing = true));
    sigCanvas.addEventListener("touchend", () => (drawing = false));
    sigCanvas.addEventListener("touchmove", draw);

    function draw(e) {
      if (!drawing) return;
      e.preventDefault();
      const rect = sigCanvas.getBoundingClientRect();
      const x = (e.clientX || e.touches[0].clientX) - rect.left;
      const y = (e.clientY || e.touches[0].clientY) - rect.top;
      ctx.fillStyle = "#000";
      ctx.fillRect(x, y, 2, 2);
    }

    document.getElementById("clearSig").addEventListener("click", () => {
      ctx.clearRect(0, 0, sigCanvas.width, sigCanvas.height);
    });
  }

  if (regForm) {
    regForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("regName").value;
      const email = document.getElementById("regEmail").value;
      const password = document.getElementById("regPassword").value;
      const signature = sigCanvas.toDataURL();

      const user = { name, email, password, signature };
      localStorage.setItem("vmsUser", JSON.stringify(user));
      alert("Registration successful!");
      window.location.href = "index.html";
    });
  }

  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.getElementById("loginEmail").value;
      const password = document.getElementById("loginPassword").value;
      const user = JSON.parse(localStorage.getItem("vmsUser"));

      if (user && user.email === email && user.password === password) {
        alert("Login successful!");
        window.location.href = "profile.html";
      } else {
        alert("Invalid credentials!");
      }
    });
  }

  if (profileDiv) {
    const user = JSON.parse(localStorage.getItem("vmsUser"));
    if (!user) {
      window.location.href = "index.html";
    } else {
      profileDiv.innerHTML = `
        <p><strong>Name:</strong> ${user.name}</p>
        <p><strong>Email:</strong> ${user.email}</p>
        <p><strong>Signature:</strong><br><img src="${user.signature}" alt="Signature" /></p>
      `;
    }
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("vmsUser");
      window.location.href = "index.html";
    });
  }
});
