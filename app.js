// ============================================
// MOBILE MENU FUNCTIONALITY - SIMPLIFIED & FIXED
// ============================================

document.addEventListener('DOMContentLoaded', function() {

    
    // ========== SMOOTH SCROLLING ==========
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            // Skip if it's just '#'
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault();
                
                // Close sidebar if open

                
                // Calculate scroll position
                const header = document.querySelector('header');
                const headerHeight = header ? header.offsetHeight : 70;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                // Smooth scroll to target
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // ========== GOOGLE FORM BUTTON HANDLER ==========
    const openFormBtn = document.getElementById('openFormBtn');
    if (openFormBtn) {
        openFormBtn.addEventListener('click', function() {
            const formUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSe7ljXMh9tY1eUcDzJSzB5jk_IT38F61FSNP3DHEGJW70o3vg/viewform';
            window.open(formUrl, '_blank');
        });
    }
    
    // ========== HOVER EFFECTS ==========
    // Skill tags hover
    const skillTags = document.querySelectorAll('.skill-tag');
    skillTags.forEach(tag => {
        tag.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px)';
        });
        
        tag.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Project cards hover
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            if (window.innerWidth > 768) {
                this.style.transform = 'translateY(-8px)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // ========== MOBILE TOUCH FEEDBACK ==========
    const touchElements = document.querySelectorAll('.card, .skill-tag, .project-tech, button, .sidebar a');
    touchElements.forEach(el => {
        el.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.98)';
        });
        
        el.addEventListener('touchend', function() {
            this.style.transform = '';
        });
        
        el.addEventListener('touchcancel', function() {
            this.style.transform = '';
        });
    });
    
    // ========== INITIALIZE AOS ==========
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            once: true,
            offset: 100,
            disable: function() {
                return window.innerWidth < 768;
            }
        });
    }
    

    console.log('✅ Header visible:', !!document.querySelector('header'));
    console.log('✅ Container visible:', !!document.querySelector('.container'));
});

// ============================================
// CUSTOM CURSOR (Desktop only)
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // Check if device supports hover (desktop)
    const isDesktop = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    
    if (!isDesktop) {
        // Remove cursor elements on mobile
        const cursorElements = document.querySelectorAll('.cursor, .cursor-outer, .cursor-inner, .cursor-follower, .cursor-trail');
        cursorElements.forEach(el => {
            if (el && el.parentNode) {
                el.parentNode.removeChild(el);
            }
        });
        return;
    }
    
    // Get cursor elements
    const cursorOuter = document.querySelector('.cursor-outer');
    const cursorInner = document.querySelector('.cursor-inner');
    const cursorFollower = document.querySelector('.cursor-follower');
    
    if (!cursorOuter || !cursorInner) return;
    
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    let followerX = 0, followerY = 0;
    
    // Mouse move event
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    // Animation loop
    function animateCursor() {
        // Outer cursor - slow movement
        cursorX += (mouseX - cursorX) * 0.15;
        cursorY += (mouseY - cursorY) * 0.15;
        
        cursorOuter.style.left = cursorX + 'px';
        cursorOuter.style.top = cursorY + 'px';
        
        // Inner cursor - direct movement
        cursorInner.style.left = mouseX + 'px';
        cursorInner.style.top = mouseY + 'px';
        
        // Follower cursor - slower movement
        if (cursorFollower) {
            followerX += (mouseX - followerX) * 0.08;
            followerY += (mouseY - followerY) * 0.08;
            
            cursorFollower.style.left = followerX + 'px';
            cursorFollower.style.top = followerY + 'px';
        }
        
        requestAnimationFrame(animateCursor);
    }
    
    // Start animation
    animateCursor();
    
    // Hide cursor when leaving window
    document.addEventListener('mouseleave', () => {
        cursorOuter.style.opacity = '0';
        cursorInner.style.opacity = '0';
        if (cursorFollower) cursorFollower.style.opacity = '0';
    });
    
    document.addEventListener('mouseenter', () => {
        cursorOuter.style.opacity = '1';
        cursorInner.style.opacity = '1';
        if (cursorFollower) cursorFollower.style.opacity = '1';
    });
    
    // Hover effects
    const hoverElements = document.querySelectorAll('a, button, .cursor-hover');
    
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorOuter.style.transform = 'translate(-50%, -50%) scale(1.5)';
            cursorOuter.style.borderColor = 'var(--cyber-blue)';
        });
        
        el.addEventListener('mouseleave', () => {
            cursorOuter.style.transform = 'translate(-50%, -50%) scale(1)';
            cursorOuter.style.borderColor = 'var(--cyber-green)';
        });
    });
});

// ============================================
// PAGE LOAD EFFECTS
// ============================================

window.addEventListener('load', function() {
    console.log('Page fully loaded');
    
    // Add loaded class for CSS transitions
    document.body.classList.add('loaded');
    
    // Animate stats counters
    const stats = document.querySelectorAll('.stat-box h3');
    stats.forEach(stat => {
        const finalValue = parseInt(stat.textContent);
        if (isNaN(finalValue)) return;
        
        stat.textContent = '0';
        
        let current = 0;
        const increment = finalValue / 50; // 50 frames
        const timer = setInterval(() => {
            current += increment;
            if (current >= finalValue) {
                current = finalValue;
                clearInterval(timer);
            }
            stat.textContent = Math.floor(current);
        }, 20);
    });
});