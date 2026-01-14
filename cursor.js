// ============================================
// CUSTOM CURSOR SYSTEM - OPTIMIZED
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing custom cursor system...');
    
    // ============================================
    // 1. CHECK DEVICE TYPE
    // ============================================
    const isDesktop = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const isMobile = !isDesktop;
    
    // ============================================
    // 2. MOBILE DEVICE HANDLING
    // ============================================
    if (isMobile) {
        console.log('Mobile/touch device detected - disabling custom cursor');
        
        // Remove all cursor elements
        const cursorElements = document.querySelectorAll('.cursor, .cursor-outer, .cursor-inner, .cursor-follower, .cursor-trail');
        cursorElements.forEach(el => {
            if (el && el.parentNode) {
                el.parentNode.removeChild(el);
            }
        });
        
        // Add click effect for mobile
        document.addEventListener('click', createClickEffect);
        
        return; // Stop execution for mobile
    }
    
    // ============================================
    // 3. DESKTOP CURSOR INITIALIZATION
    // ============================================
    console.log('Desktop detected - initializing custom cursor');
    
    // Get cursor elements
    const cursorOuter = document.querySelector('.cursor-outer');
    const cursorInner = document.querySelector('.cursor-inner');
    const cursorFollower = document.querySelector('.cursor-follower');
    const cursorTrail = document.querySelector('.cursor-trail');
    
    // Check if elements exist
    if (!cursorOuter || !cursorInner) {
        console.error('Cursor elements not found');
        return;
    }
    
    console.log('Cursor elements found:', {
        outer: !!cursorOuter,
        inner: !!cursorInner,
        follower: !!cursorFollower,
        trail: !!cursorTrail
    });
    
    // ============================================
    // 4. VARIABLES & STATE
    // ============================================
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    let followerX = 0;
    let followerY = 0;
    
    // Trail system
    const trailPoints = [];
    const TRAIL_LENGTH = 15;
    const TRAIL_UPDATE_RATE = 16; // ~60fps
    
    // Initialize trail points
    for (let i = 0; i < TRAIL_LENGTH; i++) {
        trailPoints.push({ x: 0, y: 0 });
    }
    
    // Animation frame IDs
    let animationFrameId = null;
    let trailAnimationId = null;
    
    // ============================================
    // 5. EVENT LISTENERS
    // ============================================
    
    // Mouse movement
    document.addEventListener('mousemove', handleMouseMove);
    
    // Window enter/leave
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    
    // Click effects
    document.addEventListener('click', handleClick);
    
    // ============================================
    // 6. EVENT HANDLERS
    // ============================================
    
    function handleMouseMove(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Update trail
        updateTrailPosition(e.clientX, e.clientY);
        
        // Update trail effect with throttling
        if (!trailAnimationId) {
            trailAnimationId = setTimeout(() => {
                updateTrailEffect();
                trailAnimationId = null;
            }, TRAIL_UPDATE_RATE);
        }
    }
    
    function handleMouseLeave() {
        cursorOuter.style.opacity = '0';
        cursorInner.style.opacity = '0';
        if (cursorFollower) cursorFollower.style.opacity = '0';
    }
    
    function handleMouseEnter() {
        cursorOuter.style.opacity = '1';
        cursorInner.style.opacity = '1';
        if (cursorFollower) cursorFollower.style.opacity = '1';
    }
    
    function handleClick(e) {
        createClickEffect(e.clientX, e.clientY);
    }
    
    // ============================================
    // 7. CURSOR ANIMATION
    // ============================================
    
    function animateCursor() {
        // Smooth movement for outer cursor (lagging effect)
        cursorX += (mouseX - cursorX) * 0.15;
        cursorY += (mouseY - cursorY) * 0.15;
        
        cursorOuter.style.left = cursorX + 'px';
        cursorOuter.style.top = cursorY + 'px';
        
        // Direct movement for inner cursor
        cursorInner.style.left = mouseX + 'px';
        cursorInner.style.top = mouseY + 'px';
        
        // Smooth movement for follower (more lag)
        if (cursorFollower) {
            followerX += (mouseX - followerX) * 0.08;
            followerY += (mouseY - followerY) * 0.08;
            
            cursorFollower.style.left = followerX + 'px';
            cursorFollower.style.top = followerY + 'px';
        }
        
        // Update trail background
        if (cursorTrail) {
            cursorTrail.style.setProperty('--x', mouseX + 'px');
            cursorTrail.style.setProperty('--y', mouseY + 'px');
        }
        
        animationFrameId = requestAnimationFrame(animateCursor);
    }
    
    // ============================================
    // 8. TRAIL SYSTEM
    // ============================================
    
    function updateTrailPosition(x, y) {
        // Add new point to beginning of array
        trailPoints.unshift({ x: x, y: y });
        
        // Remove oldest point if array is too long
        if (trailPoints.length > TRAIL_LENGTH) {
            trailPoints.pop();
        }
    }
    
    function updateTrailEffect() {
        if (!cursorTrail) return;
        
        let trailHTML = '';
        
        trailPoints.forEach((point, index) => {
            const progress = index / TRAIL_LENGTH;
            const size = 4 - (progress * 3);
            const opacity = 0.5 - (progress * 0.5);
            const color = `rgba(0, 255, 136, ${opacity})`;
            
            trailHTML += `
                <div class="trail-point" style="
                    position: absolute;
                    left: ${point.x}px;
                    top: ${point.y}px;
                    width: ${size}px;
                    height: ${size}px;
                    background: ${color};
                    border-radius: 50%;
                    opacity: ${opacity};
                    pointer-events: none;
                    z-index: 9998;
                    transform: translate(-50%, -50%);
                "></div>
            `;
        });
        
        cursorTrail.innerHTML = trailHTML;
    }
    
    // ============================================
    // 9. CLICK EFFECT
    // ============================================
    
    function createClickEffect(x, y) {
        const clickEffect = document.createElement('div');
        clickEffect.className = 'click-effect';
        clickEffect.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            transform: translate(-50%, -50%);
            pointer-events: none;
            z-index: 9999;
        `;
        
        document.body.appendChild(clickEffect);
        
        // Remove after animation
        setTimeout(() => {
            if (clickEffect.parentNode) {
                clickEffect.remove();
            }
        }, 600);
    }
    
    // ============================================
    // 10. HOVER EFFECTS
    // ============================================
    
    function setupHoverEffects() {
        // General hover elements
        const hoverElements = document.querySelectorAll('.cursor-hover');
        
        hoverElements.forEach(element => {
            element.addEventListener('mouseenter', function() {
                cursorOuter.style.width = '60px';
                cursorOuter.style.height = '60px';
                cursorOuter.style.borderColor = '#0088ff';
                cursorOuter.style.boxShadow = `
                    0 0 30px #0088ff,
                    0 0 60px #0088ff,
                    inset 0 0 30px rgba(0, 136, 255, 0.3)
                `;
                
                cursorInner.style.width = '12px';
                cursorInner.style.height = '12px';
                cursorInner.style.background = '#0088ff';
                
                if (cursorFollower) {
                    cursorFollower.style.width = '30px';
                    cursorFollower.style.height = '30px';
                    cursorFollower.style.borderColor = 'rgba(0, 136, 255, 0.8)';
                    cursorFollower.style.animationDuration = '10s';
                }
            });
            
            element.addEventListener('mouseleave', function() {
                cursorOuter.style.width = '40px';
                cursorOuter.style.height = '40px';
                cursorOuter.style.borderColor = '#00ff88';
                cursorOuter.style.boxShadow = `
                    0 0 20px #00ff88,
                    0 0 40px #00ff88,
                    inset 0 0 20px rgba(0, 255, 136, 0.3)
                `;
                
                cursorInner.style.width = '8px';
                cursorInner.style.height = '8px';
                cursorInner.style.background = '#00ff88';
                
                if (cursorFollower) {
                    cursorFollower.style.width = '20px';
                    cursorFollower.style.height = '20px';
                    cursorFollower.style.borderColor = 'rgba(0, 255, 136, 0.5)';
                    cursorFollower.style.animationDuration = '20s';
                }
            });
        });
        
        // Buttons and links specific
        const interactiveElements = document.querySelectorAll('button, a');
        
        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', function() {
                cursorOuter.style.borderColor = '#aa00ff';
                cursorOuter.style.boxShadow = `
                    0 0 25px #aa00ff,
                    0 0 50px #aa00ff,
                    inset 0 0 25px rgba(170, 0, 255, 0.3)
                `;
                
                cursorInner.style.background = '#aa00ff';
            });
            
            element.addEventListener('mouseleave', function() {
                cursorOuter.style.borderColor = '#00ff88';
                cursorOuter.style.boxShadow = `
                    0 0 20px #00ff88,
                    0 0 40px #00ff88,
                    inset 0 0 20px rgba(0, 255, 136, 0.3)
                `;
                
                cursorInner.style.background = '#00ff88';
            });
        });
        
        // Form elements
        const formElements = document.querySelectorAll('input, textarea');
        
        formElements.forEach(element => {
            element.addEventListener('mouseenter', function() {
                cursorInner.style.background = '#ff8800';
                cursorInner.style.boxShadow = `
                    0 0 15px #ff8800,
                    0 0 30px #ff8800
                `;
            });
            
            element.addEventListener('mouseleave', function() {
                cursorInner.style.background = '#00ff88';
                cursorInner.style.boxShadow = `
                    0 0 10px #00ff88,
                    0 0 20px #00ff88
                `;
            });
        });
    }
    
    // ============================================
    // 11. INITIALIZATION
    // ============================================
    
    function initializeCursor() {
        console.log('Starting cursor animation...');
        
        // Start animation loop
        animateCursor();
        
        // Setup hover effects
        setupHoverEffects();
        
        // Initial trail update
        updateTrailEffect();
        
        // Hide cursor during initial load
        setTimeout(() => {
            cursorOuter.style.opacity = '1';
            cursorInner.style.opacity = '1';
            if (cursorFollower) cursorFollower.style.opacity = '1';
        }, 100);
    }
    
    // ============================================
    // 12. CLEANUP FUNCTION
    // ============================================
    
    function cleanup() {
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }
        
        if (trailAnimationId) {
            clearTimeout(trailAnimationId);
        }
        
        // Remove event listeners
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseleave', handleMouseLeave);
        document.removeEventListener('mouseenter', handleMouseEnter);
        document.removeEventListener('click', handleClick);
    }
    
    // Initialize
    initializeCursor();
    
    // Cleanup on page unload
    window.addEventListener('beforeunload', cleanup);
    
    // Handle window resize
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            // Re-center cursor if needed
            cursorOuter.style.opacity = '0';
            cursorInner.style.opacity = '0';
            if (cursorFollower) cursorFollower.style.opacity = '0';
            
            setTimeout(() => {
                cursorOuter.style.opacity = '1';
                cursorInner.style.opacity = '1';
                if (cursorFollower) cursorFollower.style.opacity = '1';
            }, 100);
        }, 250);
    });
    
    console.log('Custom cursor system initialized successfully');
});