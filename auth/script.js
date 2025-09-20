// Firebase config
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
var auth=firebase.auth();

// Helper: safe bind
function onReady(fn){
  if(document.readyState==="loading"){document.addEventListener("DOMContentLoaded",fn);} else {fn();}
}

// LOGIN
onReady(function(){
  var form=document.getElementById("loginForm");
  if(!form) return;
  form.addEventListener("submit",function(e){
    e.preventDefault();
    var email=document.getElementById("loginEmail").value;
    var pw=document.getElementById("loginPassword").value;
    auth.signInWithEmailAndPassword(email,pw)
      .then(function(){
        alert("Login successful, redirecting to dashboard...");
        window.location.href="../dashboard/dashboard.html";
      })
      .catch(function(){ alert("Login failed: Invalid email or password."); });
  });
});

// REGISTER
onReady(function(){
  var form=document.getElementById("createForm");
  if(!form) return;
  form.addEventListener("submit",function(e){
    e.preventDefault();
    var email=document.getElementById("createEmail").value;
    var pw=document.getElementById("createPassword").value;
    auth.createUserWithEmailAndPassword(email,pw)
      .then(function(){
        alert("Account created successfully, please login.");
        window.location.href="../auth/index.html";
      })
      .catch(function(){ alert("Registration failed: Please try again."); });
  });
});

// FORGOT
onReady(function(){
  var form=document.getElementById("forgotForm");
  if(!form) return;
  form.addEventListener("submit",function(e){
    e.preventDefault();
    var email=document.getElementById("forgotEmail").value;
    auth.sendPasswordResetEmail(email)
      .then(function(){
        alert("Password reset email sent, please check your inbox.");
        window.location.href="../auth/index.html";
      })
      .catch(function(){ alert("Password reset failed: Please try again."); });
  });
});

// LOGOUT (event delegation; no duplicate variable declarations)
onReady(function(){
  document.addEventListener("click",function(e){
    var t=e.target;
    if(t && t.id==="logoutBtn"){
      e.preventDefault();
      auth.signOut()
        .then(function(){
          alert("You have been logged out.");
          window.location.href="../auth/index.html";
        })
        .catch(function(){ alert("Logout failed: Please try again."); });
    }
  }, { once:false });
});
