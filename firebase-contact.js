/**
 * Firebase Contact Form Handler - Final Version
 * For M.T. Malinga Portfolio
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Firebase contact form initialized');
    
    // Your Firebase configuration
    const firebaseConfig = {
        apiKey: "AIzaSyDzwkyc5DzZprkiYpuFhrabxrp4VZ1yWjQ",
        authDomain: "my-portfolio-9951.firebaseapp.com",
        projectId: "my-portfolio-9951",
        storageBucket: "my-portfolio-9951.firebasestorage.app",
        messagingSenderId: "152313884589",
        appId: "1:152313884589:web:29c41db9d6a02017c3fb24",
        measurementId: "G-943YW07NCW"
    };
    
    // Initialize Firebase
    let db = null;
    let firebaseInitialized = false;
    
    try {
        if (typeof firebase === 'undefined') {
            console.error('Firebase SDK not loaded');
            return;
        }
        
        // Initialize Firebase if not already initialized
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
            console.log('✅ Firebase initialized');
        }
        
        firebaseInitialized = true;
        db = firebase.firestore();
        
    } catch (error) {
        console.error('Firebase initialization failed:', error);
    }
    
    // Get form elements
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) {
        console.error('Contact form not found');
        return;
    }
    
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    let isSubmitting = false;
    
    // Form submission handler
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        if (isSubmitting) return;
        isSubmitting = true;
        
        // Get form values
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();
        
        // Validate form
        const validation = validateForm(name, email, message);
        if (!validation.valid) {
            showMessage(validation.message, 'error');
            isSubmitting = false;
            return;
        }
        
        // Show loading state
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="bx bx-loader bx-spin"></i> Sending...';
        
        try {
            let saved = false;
            
            // Try Firebase first
            if (firebaseInitialized && db) {
                const messageId = await saveToFirebase(name, email, message);
                saved = true;
                console.log('✅ Saved to Firebase:', messageId);
            }
            
            // If Firebase failed, use localStorage backup
            if (!saved) {
                await saveToLocalStorage(name, email, message);
                console.log('✅ Saved to localStorage (backup)');
            }
            
            // Show success message
            showMessage('✅ Message sent successfully! I will contact you soon.', 'success');
            
            // Reset form
            contactForm.reset();
            
            // Send email notification (optional)
            await sendEmailNotification(name, email, message);
            
        } catch (error) {
            console.error('Form submission error:', error);
            showMessage('⚠️ Failed to send. Please email me at malingawelagedara525@gmail.com', 'error');
        } finally {
            // Reset button state
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
            isSubmitting = false;
        }
    });
    
    // Form validation
    function validateForm(name, email, message) {
        // Clear previous messages
        const existingMsg = document.getElementById('formMessage');
        if (existingMsg) existingMsg.remove();
        
        // Check required fields
        if (!name || !email || !message) {
            return { valid: false, message: 'Please fill in all fields.' };
        }
        
        // Name validation
        if (name.length < 2) {
            return { valid: false, message: 'Name must be at least 2 characters.' };
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return { valid: false, message: 'Please enter a valid email address.' };
        }
        
        // Message validation
        if (message.length < 10) {
            return { valid: false, message: 'Message must be at least 10 characters.' };
        }
        
        return { valid: true, message: '' };
    }
    
    // Save to Firebase
    async function saveToFirebase(name, email, message) {
        const messageData = {
            name: name,
            email: email,
            message: message,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            date: new Date().toLocaleString(),
            ip: await getIPAddress(),
            status: 'new',
            read: false
        };
        
        const docRef = await db.collection('contactMessages').add(messageData);
        return docRef.id;
    }
    
    // Backup to localStorage
    async function saveToLocalStorage(name, email, message) {
        return new Promise((resolve) => {
            try {
                const messages = JSON.parse(localStorage.getItem('portfolioMessages') || '[]');
                
                messages.push({
                    name: name,
                    email: email,
                    message: message,
                    timestamp: new Date().toISOString(),
                    status: 'pending'
                });
                
                // Keep only last 50 messages
                if (messages.length > 50) {
                    messages.splice(0, messages.length - 50);
                }
                
                localStorage.setItem('portfolioMessages', JSON.stringify(messages));
                resolve(true);
                
            } catch (error) {
                console.error('LocalStorage save failed:', error);
                resolve(false);
            }
        });
    }
    
    // Get IP address
    async function getIPAddress() {
        try {
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            return data.ip;
        } catch (error) {
            return 'unknown';
        }
    }
    
    // Send email notification (optional - you can add EmailJS later)
    async function sendEmailNotification(name, email, message) {
        // This is a placeholder for future email integration
        console.log('Email notification would be sent for:', email);
        return true;
    }
    
    // Show message to user
    function showMessage(text, type) {
        // Create or get message container
        let messageDiv = document.getElementById('formMessage');
        if (!messageDiv) {
            messageDiv = document.createElement('div');
            messageDiv.id = 'formMessage';
            contactForm.appendChild(messageDiv);
        }
        
        // Set message and styles
        messageDiv.textContent = text;
        messageDiv.style.cssText = `
            margin-top: 15px;
            padding: 12px 16px;
            border-radius: 8px;
            font-size: 0.9rem;
            display: block;
            animation: fadeIn 0.3s ease;
        `;
        
        if (type === 'success') {
            messageDiv.style.backgroundColor = 'rgba(0, 255, 136, 0.1)';
            messageDiv.style.border = '1px solid #00ff88';
            messageDiv.style.color = '#00ff88';
        } else {
            messageDiv.style.backgroundColor = 'rgba(255, 85, 85, 0.1)';
            messageDiv.style.border = '1px solid #ff5555';
            messageDiv.style.color = '#ff5555';
        }
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            messageDiv.style.opacity = '0';
            setTimeout(() => {
                messageDiv.style.display = 'none';
                messageDiv.style.opacity = '1';
            }, 300);
        }, 5000);
    }
    
    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        .bx-spin {
            animation: spin 1s linear infinite;
        }
    `;
    document.head.appendChild(style);
    
    console.log('✅ Contact form handler ready');
});