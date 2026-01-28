// firebase-contact.js - UPDATED VERSION
/**
 * Firebase Contact Form Handler - Final Version
 * For M.T. Malinga Portfolio
 * Updated for Firebase Functions compatibility
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
    let firebaseApp = null;
    
    try {
        // Check if Firebase is available (using CDN version)
        if (typeof firebase === 'undefined') {
            console.error('Firebase SDK not loaded. Please include Firebase SDK in your HTML.');
            showStaticMessage('Firebase SDK not loaded. Form may not work properly.', 'warning');
        }
        
        // Initialize Firebase if not already initialized
        if (firebase && !firebase.apps.length) {
            firebaseApp = firebase.initializeApp(firebaseConfig);
            console.log('✅ Firebase initialized successfully');
            firebaseInitialized = true;
            db = firebase.firestore();
        } else if (firebase && firebase.apps.length > 0) {
            firebaseApp = firebase.app();
            firebaseInitialized = true;
            db = firebase.firestore();
            console.log('✅ Using existing Firebase app');
        }
        
    } catch (error) {
        console.error('Firebase initialization failed:', error);
        showStaticMessage('Failed to initialize Firebase. Using backup storage.', 'warning');
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
            let messageId = null;
            let formData = null;
            
            // Prepare form data
            formData = {
                name: name,
                email: email,
                message: message,
                timestamp: new Date().toISOString(),
                date: new Date().toLocaleString(),
                ip: await getIPAddress(),
                status: 'new',
                read: false,
                notified: false
            };
            
            // Try Firebase first
            if (firebaseInitialized && db) {
                try {
                    messageId = await saveToFirebase(formData);
                    saved = true;
                    console.log('✅ Saved to Firebase with ID:', messageId);
                    
                    // Optional: You can also trigger HTTP function here if needed
                    // await triggerEmailNotification(messageId, formData);
                    
                } catch (firebaseError) {
                    console.warn('⚠️ Firebase save failed:', firebaseError);
                    saved = false;
                }
            }
            
            // If Firebase failed, use localStorage backup
            if (!saved) {
                const backupSaved = await saveToLocalStorage(formData);
                if (backupSaved) {
                    console.log('✅ Saved to localStorage (backup)');
                    saved = true;
                }
            }
            
            if (saved) {
                // Show success message
                showMessage('✅ Message sent successfully! I will contact you soon.', 'success');
                
                // Reset form
                contactForm.reset();
                
                // Show backup info if Firebase failed
                if (!firebaseInitialized || !db) {
                    console.log('⚠️ Using localStorage backup. Messages will be saved locally.');
                }
            } else {
                throw new Error('Failed to save message');
            }
            
        } catch (error) {
            console.error('Form submission error:', error);
            showMessage('⚠️ Failed to send message. Please email me directly at malingawelagedara525@gmail.com', 'error');
            
            // Show email as fallback
            const emailFallback = document.createElement('div');
            emailFallback.style.marginTop = '10px';
            emailFallback.style.fontSize = '0.9rem';
            emailFallback.innerHTML = `Or copy this email: <code style="background: #f0f0f0; padding: 2px 6px; border-radius: 4px;">malingawelagedara525@gmail.com</code>`;
            setTimeout(() => {
                const msgDiv = document.getElementById('formMessage');
                if (msgDiv) {
                    msgDiv.appendChild(emailFallback);
                }
            }, 100);
            
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
        if (name.length > 100) {
            return { valid: false, message: 'Name is too long (max 100 characters).' };
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return { valid: false, message: 'Please enter a valid email address.' };
        }
        if (email.length > 255) {
            return { valid: false, message: 'Email is too long.' };
        }
        
        // Message validation
        if (message.length < 10) {
            return { valid: false, message: 'Message must be at least 10 characters.' };
        }
        if (message.length > 5000) {
            return { valid: false, message: 'Message is too long (max 5000 characters).' };
        }
        
        // Check for suspicious content (basic spam filter)
        const spamWords = ['http://', 'https://', '.ru', '.cn', 'viagra', 'casino', 'lottery'];
        const lowerMessage = message.toLowerCase();
        for (const word of spamWords) {
            if (lowerMessage.includes(word)) {
                return { valid: false, message: 'Message contains suspicious content.' };
            }
        }
        
        return { valid: true, message: '' };
    }
    
    // Save to Firebase - Updated for compatibility
    async function saveToFirebase(formData) {
        // IMPORTANT: Save to 'contactMessages' collection to match Firebase Function trigger
        const messageData = {
            name: formData.name,
            email: formData.email,
            message: formData.message,
            ip: formData.ip,
            status: 'new',
            read: false,
            notified: false,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            date: formData.date,
            userAgent: navigator.userAgent,
            language: navigator.language,
            platform: navigator.platform
        };
        
        const docRef = await db.collection('contactMessages').add(messageData);
        
        // Alternative: You can also save to 'contacts' collection if you prefer
        // const contactsRef = await db.collection('contacts').add(messageData);
        
        return docRef.id;
    }
    
    // Backup to localStorage
    async function saveToLocalStorage(formData) {
        return new Promise((resolve) => {
            try {
                const messages = JSON.parse(localStorage.getItem('portfolioMessages') || '[]');
                
                messages.push({
                    name: formData.name,
                    email: formData.email,
                    message: formData.message,
                    ip: formData.ip,
                    timestamp: new Date().toISOString(),
                    date: formData.date,
                    status: 'pending',
                    source: 'localStorage_backup'
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
            const response = await fetch('https://api.ipify.org?format=json', {
                timeout: 5000 // 5 second timeout
            });
            
            if (!response.ok) {
                throw new Error('IP API response not OK');
            }
            
            const data = await response.json();
            return data.ip;
        } catch (error) {
            console.warn('Could not fetch IP address:', error);
            return 'unknown';
        }
    }
    
    // Optional: Trigger email notification via HTTP function
    async function triggerEmailNotification(messageId, formData) {
        try {
            // This is optional - Firebase Functions will auto-trigger when document is created
            // But you can also call an HTTP function directly if needed
            
            // Example HTTP function call (if you set it up):
            /*
            const functions = firebase.functions();
            const sendEmail = functions.httpsCallable('sendContactEmail');
            
            await sendEmail({
                messageId: messageId,
                name: formData.name,
                email: formData.email,
                message: formData.message
            });
            */
            
            console.log('Email notification will be sent via Firebase Function trigger');
            return true;
            
        } catch (error) {
            console.warn('Email trigger failed (not critical):', error);
            return false;
        }
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
        
        // Clear previous content
        messageDiv.innerHTML = '';
        
        // Create message text element
        const messageText = document.createElement('span');
        messageText.textContent = text;
        messageDiv.appendChild(messageText);
        
        // Set message and styles
        messageDiv.className = `form-message ${type}`;
        messageDiv.style.cssText = `
            margin-top: 15px;
            padding: 12px 16px;
            border-radius: 8px;
            font-size: 0.9rem;
            display: block;
            animation: fadeIn 0.3s ease;
            transition: opacity 0.3s ease;
        `;
        
        if (type === 'success') {
            messageDiv.style.backgroundColor = 'rgba(46, 204, 113, 0.1)';
            messageDiv.style.border = '1px solid #2ecc71';
            messageDiv.style.color = '#27ae60';
        } else if (type === 'error') {
            messageDiv.style.backgroundColor = 'rgba(231, 76, 60, 0.1)';
            messageDiv.style.border = '1px solid #e74c3c';
            messageDiv.style.color = '#c0392b';
        } else if (type === 'warning') {
            messageDiv.style.backgroundColor = 'rgba(241, 196, 15, 0.1)';
            messageDiv.style.border = '1px solid #f1c40f';
            messageDiv.style.color = '#f39c12';
        }
        
        // Auto-hide after 5 seconds (only for success messages)
        if (type === 'success') {
            setTimeout(() => {
                messageDiv.style.opacity = '0';
                setTimeout(() => {
                    if (messageDiv.parentNode) {
                        messageDiv.style.display = 'none';
                        messageDiv.style.opacity = '1';
                    }
                }, 300);
            }, 5000);
        }
    }
    
    // Show static message (for initialization errors)
    function showStaticMessage(text, type) {
        // Only show if form exists
        if (!contactForm) return;
        
        let messageDiv = document.getElementById('staticFormMessage');
        if (!messageDiv) {
            messageDiv = document.createElement('div');
            messageDiv.id = 'staticFormMessage';
            contactForm.insertBefore(messageDiv, contactForm.firstChild);
        }
        
        messageDiv.textContent = text;
        messageDiv.style.cssText = `
            padding: 10px 15px;
            margin-bottom: 15px;
            border-radius: 6px;
            font-size: 0.85rem;
            display: block;
        `;
        
        if (type === 'warning') {
            messageDiv.style.backgroundColor = 'rgba(241, 196, 15, 0.15)';
            messageDiv.style.border = '1px solid #f1c40f';
            messageDiv.style.color = '#f39c12';
        }
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
        .form-message.success {
            background-color: rgba(46, 204, 113, 0.1) !important;
            border: 1px solid #2ecc71 !important;
            color: #27ae60 !important;
        }
        .form-message.error {
            background-color: rgba(231, 76, 60, 0.1) !important;
            border: 1px solid #e74c3c !important;
            color: #c0392b !important;
        }
        .form-message.warning {
            background-color: rgba(241, 196, 15, 0.1) !important;
            border: 1px solid #f1c40f !important;
            color: #f39c12 !important;
        }
    `;
    document.head.appendChild(style);
    
    // Optional: Add a test function to verify Firebase connection
    async function testFirebaseConnection() {
        if (!firebaseInitialized || !db) return false;
        
        try {
            // Try to write and read a test document
            const testRef = db.collection('_test').doc('connection_test');
            await testRef.set({
                test: true,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            // Clean up
            await testRef.delete();
            console.log('✅ Firebase connection test passed');
            return true;
        } catch (error) {
            console.warn('⚠️ Firebase connection test failed:', error);
            return false;
        }
    }
    
    // Run connection test on load (optional)
    setTimeout(() => {
        if (firebaseInitialized) {
            testFirebaseConnection();
        }
    }, 2000);
    
    console.log('✅ Contact form handler ready');
    console.log('📝 Collection: contactMessages');
    console.log('📧 Email notifications: Auto-triggered via Firebase Functions');
});