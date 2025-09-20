
// --- merged from profile.js ---
// Minimal JS: add certificate clones
function addCertificate(blockSelector){
  const tpl = document.querySelector('#cert-template');
  const holder = document.querySelector(blockSelector);
  if(!tpl || !holder) return;
  const clone = tpl.content.cloneNode(true);
  holder.appendChild(clone);
}

document.addEventListener('click', (e)=>{
  if(e.target.matches('[data-add-cert]')){
    addCertificate('#cert-holder');
  }
  if(e.target.matches('[data-remove-cert]')){
    const entry = e.target.closest('.cert-entry');
    if(entry) entry.remove();
  }
});