// ============================================
// MOBILE MENU FUNCTIONALITY - SIMPLIFIED
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded - initializing mobile menu...');
    
    // Get elements
    const menuIcon = document.querySelector('.menu-icon');
    const closeIcon = document.querySelector('.close-icon');
    const sidebar = document.querySelector('.sidebar');
    const body = document.body;
    
    // Create overlay for mobile
    const overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay';
    document.body.appendChild(overlay);
    
    // ========== SIDEBAR FUNCTIONS ==========
    function openSidebar() {
        console.log('Opening sidebar');
        sidebar.classList.add('open');
        overlay.classList.add('active');
        body.style.overflow = 'hidden';
    }
    
    function closeSidebar() {
        console.log('Closing sidebar');
        sidebar.classList.remove('open');
        overlay.classList.remove('active');
        body.style.overflow = '';
    }
    
    // ========== EVENT LISTENERS ==========
    if (menuIcon) {
        menuIcon.addEventListener('click', function(e) {
            e.stopPropagation();
            e.preventDefault();
            openSidebar();
        });
    }
    
    if (closeIcon) {
        closeIcon.addEventListener('click', function(e) {
            e.stopPropagation();
            e.preventDefault();
            closeSidebar();
        });
    }
    
    if (overlay) {
        overlay.addEventListener('click', function(e) {
            e.stopPropagation();
            e.preventDefault();
            closeSidebar();
        });
    }
    
    // Close sidebar when clicking on links
    const sidebarLinks = document.querySelectorAll('.sidebar a');
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            closeSidebar();
        });
    });
    
    // Close sidebar with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && sidebar.classList.contains('open')) {
            closeSidebar();
        }
    });
    
    // ========== SMOOTH SCROLLING ==========
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault();
                
                // Close sidebar if open
                closeSidebar();
                
                // Calculate scroll position
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                // Smooth scroll to target
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // ========== HEADER SCROLL EFFECT ==========
    let lastScrollTop = 0;
    const header = document.querySelector('header');
    
    if (header) {
        window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // Add/remove background on scroll
            if (scrollTop > 50) {
                header.style.backgroundColor = 'rgba(16, 16, 32, 0.95)';
                header.style.backdropFilter = 'blur(20px)';
            } else {
                header.style.backgroundColor = 'rgba(16, 16, 32, 0.9)';
                header.style.backdropFilter = 'blur(10px)';
            }
            
            lastScrollTop = scrollTop;
        });
    }
    
    // ========== RESIZE HANDLER ==========
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            // Auto-close sidebar on desktop
            if (window.innerWidth > 768 && sidebar.classList.contains('open')) {
                closeSidebar();
            }
        }, 250);
    });
    
    console.log('✅ Mobile menu initialized successfully');
    console.log('✅ Header visible:', !!document.querySelector('header'));
    console.log('✅ Container visible:', !!document.querySelector('.container'));
});