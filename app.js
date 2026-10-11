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