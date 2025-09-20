
var firebaseConfig={
  apiKey:"AIzaSyDJ8GbgNdLO6OcGKCzTjxDI7edp8Jq-_0w",
  authDomain:"vms-app-6a0c3.firebaseapp.com",
  projectId:"vms-app-6a0c3",
  storageBucket:"vms-app-6a0c3.firebasestorage.app",
  messagingSenderId:"868366477824",
  appId:"1:868366477824:web:05588a6d013a372f0606e5",
  measurementId:"G-NBZBPJQ3QR"
};
if(!firebase.apps.length){firebase.initializeApp(firebaseConfig);}
const auth=firebase.auth();

// Login form
document.getElementById("loginForm")?.addEventListener("submit",e=>{
 e.preventDefault();
 const email=document.getElementById("loginEmail").value;
 const pw=document.getElementById("loginPassword").value;
 auth.signInWithEmailAndPassword(email,pw)
   .then(()=>{
     alert("Login successful, redirecting to dashboard...");
     window.location.href="../dashboard.html";
   })
   .catch(()=>alert("Login failed: Invalid email or password."));
});

// Register form
document.getElementById("createForm")?.addEventListener("submit",e=>{
 e.preventDefault();
 const email=document.getElementById("createEmail").value;
 const pw=document.getElementById("createPassword").value;
 auth.createUserWithEmailAndPassword(email,pw)
   .then(()=>{
     alert("Account created successfully, please login.");
     window.location.href="index.html";
   })
   .catch(()=>alert("Registration failed: Please try again."));
});

// Forgot password form
document.getElementById("forgotForm")?.addEventListener("submit",e=>{
 e.preventDefault();
 const email=document.getElementById("forgotEmail").value;
 auth.sendPasswordResetEmail(email)
   .then(()=>{
     alert("Password reset email sent, please check your inbox.");
     window.location.href="index.html";
   })
   .catch(()=>alert("Password reset failed: Please try again."));
});

// Logout button (main pages only)
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", e => {
    e.preventDefault();
    auth.signOut()
      .then(()=>{
        alert("You have been logged out.");
        window.location.href="auth/index.html";
      })
      .catch(()=>alert("Logout failed: Please try again."));
  });
}

// Session check for main pages (redirect to login if not signed in)
auth.onAuthStateChanged(user => {
  if (!user && !window.location.pathname.includes("/auth/")) {
    window.location.href = "auth/index.html";
  }
});
