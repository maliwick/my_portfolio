const menuToggle=document.getElementById('menuToggle');
const nav=document.getElementById('nav');
menuToggle.addEventListener('click',()=>nav.classList.toggle('open'));
nav.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>nav.classList.remove('open')));
document.getElementById('year').textContent=new Date().getFullYear();
document.getElementById('contactForm').addEventListener('submit',function(e){
  e.preventDefault();
  const name=document.getElementById('name').value.trim();
  const email=document.getElementById('email').value.trim();
  const service=document.getElementById('service').value;
  const message=document.getElementById('message').value.trim();
  const subject=encodeURIComponent('IT Support Inquiry — '+service);
  const body=encodeURIComponent(`Hello Thisara,\n\nMy name is ${name}.\nEmail: ${email}\nService: ${service}\n\nIssue / requirements:\n${message}\n\nThank you.`);
  document.getElementById('formStatus').textContent='Opening your email app...';
  window.location.href=`mailto:malingawelagedara523@gmail.com?subject=${subject}&body=${body}`;
});
