'use strict';
(() => {
  const canvas=document.getElementById('ambientCanvas');if(!canvas)return;
  const ctx=canvas.getContext('2d');const button=document.getElementById('backgroundToggle');
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  let width=0,height=0,points=[],frame=0,last=0,paused=false;
  function resize(){width=innerWidth;height=innerHeight;const ratio=Math.min(devicePixelRatio||1,1.5);canvas.width=Math.round(width*ratio);canvas.height=Math.round(height*ratio);if(ctx)ctx.setTransform(ratio,0,0,ratio,0,0);points=Array.from({length:width<700?16:32},()=>({x:Math.random()*width,y:Math.random()*height,vx:(Math.random()-.5)*.25,vy:(Math.random()-.5)*.25}));}
  function draw(now){frame=0;if(paused||document.hidden||reduced.matches||!ctx)return;frame=requestAnimationFrame(draw);if(now-last<33)return;const dt=Math.min((now-last)/33||1,2);last=now;ctx.clearRect(0,0,width,height);
    points.forEach((p,i)=>{p.x+=p.vx*dt;p.y+=p.vy*dt;if(p.x<0||p.x>width)p.vx*=-1;if(p.y<0||p.y>height)p.vy*=-1;ctx.fillStyle='#62cdae';ctx.beginPath();ctx.arc(p.x,p.y,1.5,0,Math.PI*2);ctx.fill();for(let j=i+1;j<points.length;j++){const q=points[j],distance=Math.hypot(p.x-q.x,p.y-q.y);if(distance<155){ctx.strokeStyle=`rgba(94,191,180,${(1-distance/155)*.22})`;ctx.lineWidth=.7;ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);ctx.stroke();}}});
  }
  function sync(){cancelAnimationFrame(frame);frame=0;document.body.classList.toggle('background-paused',paused||reduced.matches||document.hidden);if(button){button.disabled=reduced.matches;button.textContent=reduced.matches?'Reduced motion enabled':paused?'Resume background':'Pause background';button.setAttribute('aria-pressed',String(paused||reduced.matches));}if(!paused&&!document.hidden&&!reduced.matches&&ctx){last=performance.now();frame=requestAnimationFrame(draw);}}
  button?.addEventListener('click',()=>{paused=!paused;sync();});window.addEventListener('resize',resize,{passive:true});document.addEventListener('visibilitychange',sync);reduced.addEventListener('change',sync);resize();sync();
})();
