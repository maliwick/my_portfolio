'use strict';
(() => {
  const toggle=document.getElementById('site-menu-toggle');
  const drawer=document.getElementById('site-drawer');
  if(!toggle || !drawer)return;
  const desktop=window.matchMedia('(min-width: 1241px)');
  let previousOverflow='';
  toggle.addEventListener('click',()=>{if(drawer.open)return;previousOverflow=document.body.style.overflow;drawer.showModal();toggle.setAttribute('aria-expanded','true');document.body.style.overflow='hidden';});
  drawer.addEventListener('close',()=>{toggle.setAttribute('aria-expanded','false');document.body.style.overflow=previousOverflow;if(!desktop.matches)toggle.focus();});
  drawer.addEventListener('click',e=>{if(e.target!==drawer)return;const r=drawer.getBoundingClientRect();if(e.clientX<r.left || e.clientX>r.right || e.clientY<r.top || e.clientY>r.bottom)drawer.close();});
  drawer.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>drawer.close()));
  desktop.addEventListener('change',e=>{if(e.matches && drawer.open)drawer.close();});
  const links=document.querySelectorAll('[data-site-link]');
  function active(){
    const current=new URL(location.href);let path=current.pathname;
    if(path.endsWith('/'))path+='index.html';
    if(path.endsWith('/work.html'))path=path.replace(/work\.html$/,current.searchParams.get('type')==='labs'?'labs.html':'projects.html');
    if(path.includes('/blog-'))path=path.replace(/blog-[^/]+\.html$/,'blog.html');
    links.forEach(a=>{const url=new URL(a.href);const matched=url.pathname===path && (url.hash?url.hash===current.hash:!current.hash);if(matched)a.setAttribute('aria-current',url.hash?'location':'page');else a.removeAttribute('aria-current');});
  }
  active();window.addEventListener('hashchange',active);
})();
