// Firebase config (v4)
var firebaseConfig = {
  apiKey: "AIzaSyDJ8GbgNdLO6OcGKCzTjxDI7edp8Jq-_0w",
  authDomain: "vms-app-6a0c3.firebaseapp.com",
  projectId: "vms-app-6a0c3",
  storageBucket: "vms-app-6a0c3.firebasestorage.app",
  messagingSenderId: "868366477824",
  appId: "1:868366477824:web:05588a6d013a372f0606e5",
  measurementId: "G-NBZBPJQ3QR"
};
firebase.initializeApp(firebaseConfig);
const auth=firebase.auth();

function showMsg(id,text,type){const box=document.getElementById(id);if(!box)return;box.textContent=text;box.className='msg '+type;box.classList.remove('hidden');setTimeout(()=>{box.classList.add('hidden')},5000);}
function toggleSpinner(btnId,loading){const btn=document.getElementById(btnId);if(!btn)return;const text=btn.querySelector('.btn-text');const spin=btn.querySelector('.spinner');if(loading){text.classList.add('hidden');spin.classList.remove('hidden');}else{text.classList.remove('hidden');spin.classList.add('hidden');}}

// Login
document.getElementById("loginForm")?.addEventListener("submit",e=>{e.preventDefault();toggleSpinner('loginBtn',true);const email=document.getElementById("loginEmail").value;const password=document.getElementById("loginPassword").value;auth.signInWithEmailAndPassword(email,password).then(()=>{showMsg('loginMsg','Login successful, redirecting...','success');window.location.href='dashboard.html';}).catch(err=>{showMsg('loginMsg',err.message,'error');}).finally(()=>toggleSpinner('loginBtn',false));});

// Signup
document.getElementById("signupForm")?.addEventListener("submit",e=>{e.preventDefault();toggleSpinner('signupBtn',true);const email=document.getElementById("signupEmail").value;const password=document.getElementById("signupPassword").value;auth.createUserWithEmailAndPassword(email,password).then(()=>{showMsg('signupMsg','Account created, redirecting...','success');window.location.href='dashboard.html';}).catch(err=>{showMsg('signupMsg',err.message,'error');}).finally(()=>toggleSpinner('signupBtn',false));});

// Reset
document.getElementById("resetForm")?.addEventListener("submit",e=>{e.preventDefault();toggleSpinner('resetBtn',true);const email=document.getElementById("resetEmail").value;auth.sendPasswordResetEmail(email).then(()=>{showMsg('resetMsg','Password reset email sent','success');}).catch(err=>{showMsg('resetMsg',err.message,'error');}).finally(()=>toggleSpinner('resetBtn',false));});

// Logout
document.getElementById("logoutBtn")?.addEventListener("click",()=>{auth.signOut().then(()=>window.location.href='index.html');});