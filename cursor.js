'use strict';
(() => {
  const pointer=matchMedia('(hover: hover) and (pointer: fine)');
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const root=document.documentElement;
  const layer=document.createElement('div');layer.className='professional-cursor';layer.hidden=true;layer.setAttribute('aria-hidden','true');
  const dot=document.createElement('div');dot.className='cursor-dot';dot.append(document.createElement('span'));
  const ring=document.createElement('div');ring.className='cursor-ring';ring.append(document.createElement('span'));
  layer.append(ring,dot);document.body.append(layer);
  let x=0,y=0,rx=0,ry=0,frame=0,visible=false;
  const enabled=()=>pointer.matches&&!reduced.matches;
  function hide(){visible=false;layer.hidden=true;root.classList.remove('cursor-active');cancelAnimationFrame(frame);frame=0;layer.classList.remove('is-pressed');}
  function draw(){frame=0;if(!visible)return;rx+=(x-rx)*.26;ry+=(y-ry)*.26;ring.style.transform=`translate3d(${rx}px,${ry}px,0)`;if(Math.abs(x-rx)+Math.abs(y-ry)>.1)frame=requestAnimationFrame(draw);}
  document.addEventListener('pointermove',e=>{
    if(!enabled()||e.pointerType!=='mouse'||e.target.closest('input,textarea,select,[contenteditable="true"],iframe')){hide();return;}
    x=e.clientX;y=e.clientY;if(!visible){rx=x;ry=y;visible=true;layer.hidden=false;root.classList.add('cursor-active');}
    dot.style.transform=`translate3d(${x}px,${y}px,0)`;
    layer.classList.toggle('is-interactive',!!e.target.closest('a,button,[role="button"],summary'));
    if(!frame)frame=requestAnimationFrame(draw);
  },{passive:true});
  document.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse'&&visible)layer.classList.add('is-pressed');});
  document.addEventListener('pointerup',()=>layer.classList.remove('is-pressed'));
  document.addEventListener('pointerout',e=>{if(!e.relatedTarget)hide();});
  window.addEventListener('blur',hide);document.addEventListener('visibilitychange',()=>{if(document.hidden)hide();});
  pointer.addEventListener('change',hide);reduced.addEventListener('change',hide);
  const drawer=document.getElementById('site-drawer');
  // Native modal dialogs occupy the top layer. Move the cursor into that same layer.
  if(drawer)new MutationObserver(()=>{(drawer.open?drawer:document.body).append(layer);hide();}).observe(drawer,{attributes:true,attributeFilter:['open']});
})();
