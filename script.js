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

document.getElementById("loginForm")?.addEventListener("submit",e=>{
  e.preventDefault();
  const email=document.getElementById("loginEmail").value;
  const pw=document.getElementById("loginPassword").value;
  auth.signInWithEmailAndPassword(email,pw).then(()=>{
    window.location.href="dashboard.html";
  }).catch(err=>alert(err.message));
});

document.getElementById("createForm")?.addEventListener("submit",e=>{
  e.preventDefault();
  const email=document.getElementById("createEmail").value;
  const pw=document.getElementById("createPassword").value;
  auth.createUserWithEmailAndPassword(email,pw).then(()=>{
    window.location.href="dashboard.html";
  }).catch(err=>alert(err.message));
});

document.getElementById("forgotForm")?.addEventListener("submit",e=>{
  e.preventDefault();
  const email=document.getElementById("forgotEmail").value;
  auth.sendPasswordResetEmail(email).then(()=>{
    alert("Password reset email sent");
    window.location.href="index.html";
  }).catch(err=>alert(err.message));
});

document.getElementById("logoutBtn")?.addEventListener("click",()=>{
  auth.signOut().then(()=>window.location.href="index.html");
});
