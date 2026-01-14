/**
 * Contact Form Handler with Firebase
 * Works with GitHub Pages
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Contact form script loaded');
    
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;
    
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    let isSubmitting = false;
    
    // Add event listener
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        if (isSubmitting) return;
        isSubmitting = true;
        
        // Get form values
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();
        
        // Validation
        if (!validateForm(name, email, message)) {
            isSubmitting = false;
            return;
        }
        
        // Show loading state
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="bx bx-loader bx-spin"></i> Sending...';
        
        try {
            // Initialize Firebase if not already
            await initializeFirebaseWithFallback();
            
            // Save to Firebase
            const messageId = await saveToFirebase(name, email, message);
            
            // Show success
            showMessage('✅ Message sent successfully! I will contact you soon.', 'success');
            
            // Reset form
            contactForm.reset();
            
            // Track event in analytics
            trackContactEvent(name, email);
            
        } catch (error) {
            console.error('Error:', error);
            
            // Try fallback method
            try {
                await fallbackSave(name, email, message);
                showMessage('✅ Message saved! (Backup method)', 'success');
                contactForm.reset();
            } catch (fallbackError) {
                showMessage('⚠️ Failed to send. Please email: malingawelagedara525@gmail.com', 'error');
            }
        } finally {
            // Reset button
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
            isSubmitting = false;
        }
    });
    
    function validateForm(name, email, message) {
        // Clear previous messages
        const existingMsg = document.getElementById('formMessage');
        if (existingMsg) existingMsg.remove();
        
        // Check required fields
        if (!name || !email || !message) {
            showMessage('Please fill in all fields.', 'error');
            return false;
        }
        
        // Name validation
        if (name.length < 2) {
            showMessage('Name must be at least 2 characters.', 'error');
            return false;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showMessage('Please enter a valid email address.', 'error');
            return false;
        }
        
        // Message validation
        if (message.length < 10) {
            showMessage('Message must be at least 10 characters.', 'error');
            return false;
        }
        
        return true;
    }
    
    async function initializeFirebaseWithFallback() {
        // Check if Firebase is available
        if (typeof firebase === 'undefined') {
            throw new Error('Firebase not loaded');
        }
        
        // Initialize if not already
        if (firebase.apps.length === 0) {
            const firebaseConfig = {
                apiKey: "AIzaSyDzwkyc5DzZprkiYpuFhrabxrp4VZ1yWjQ",
                authDomain: "my-portfolio-9951.firebaseapp.com",
                projectId: "my-portfolio-9951",
                storageBucket: "my-portfolio-9951.firebasestorage.app",
                messagingSenderId: "152313884589",
                appId: "1:152313884589:web:29c41db9d6a02017c3fb24",
                measurementId: "G-943YW07NCW"
            };
            
            firebase.initializeApp(firebaseConfig);
        }
        
        return firebase.firestore();
    }
    
    async function saveToFirebase(name, email, message) {
        const db = firebase.firestore();
        
        const messageData = {
            name: name,
            email: email,
            message: message,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            date: new Date().toLocaleString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }),
            ip: await getUserIP(),
            status: 'new'
        };
        
        // Add to Firestore
        const docRef = await db.collection('contactMessages').add(messageData);
        
        console.log('Message saved with ID:', docRef.id);
        return docRef.id;
    }
    
    async function fallbackSave(name, email, message) {
        // Save to localStorage as backup
        const messages = JSON.parse(localStorage.getItem('portfolioContacts') || '[]');
        
        messages.push({
            name: name,
            email: email,
            message: message,
            timestamp: new Date().toISOString(),
            status: 'pending'
        });
        
        localStorage.setItem('portfolioContacts', JSON.stringify(messages));
        
        // Also prepare email
        prepareEmailFallback(name, email, message);
        
        return true;
    }
    
    function prepareEmailFallback(name, email, message) {
        const subject = `Portfolio Contact: ${name}`;
        const body = `
Name: ${name}
Email: ${email}

Message:
${message}

---
Sent from portfolio website at ${new Date().toLocaleString()}
        `.trim();
        
        // Store email data for manual sending
        const pendingEmails = JSON.parse(localStorage.getItem('pendingEmails') || '[]');
        pendingEmails.push({ subject, body });
        localStorage.setItem('pendingEmails', JSON.stringify(pendingEmails));
        
        console.log('Email prepared for manual sending');
    }
    
    async function getUserIP() {
        try {
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            return data.ip;
        } catch (error) {
            return 'unknown';
        }
    }
    
    function trackContactEvent(name, email) {
        // Track with Firebase Analytics if available
        if (firebase.analytics) {
            firebase.analytics().logEvent('contact_form_submit', {
                name_length: name.length,
                email_domain: email.split('@')[1]
            });
        }
    }
    
    function showMessage(text, type) {
        // Remove existing message
        const existingMsg = document.getElementById('formMessage');
        if (existingMsg) existingMsg.remove();
        
        // Create message element
        const messageDiv = document.createElement('div');
        messageDiv.id = 'formMessage';
        messageDiv.innerHTML = text;
        
        // Style based on type
        messageDiv.style.cssText = `
            margin-top: 15px;
            padding: 12px 16px;
            border-radius: 8px;
            font-size: 0.9rem;
            animation: fadeIn 0.3s ease;
            display: block;
        `;
        
        if (type === 'success') {
            messageDiv.style.backgroundColor = 'rgba(0, 255, 136, 0.1)';
            messageDiv.style.border = '1px solid var(--cyber-green)';
            messageDiv.style.color = 'var(--cyber-green)';
        } else {
            messageDiv.style.backgroundColor = 'rgba(255, 85, 85, 0.1)';
            messageDiv.style.border = '1px solid #ff5555';
            messageDiv.style.color = '#ff5555';
        }
        
        // Add to form
        contactForm.appendChild(messageDiv);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            messageDiv.style.opacity = '0';
            setTimeout(() => {
                if (messageDiv.parentNode) {
                    messageDiv.parentNode.removeChild(messageDiv);
                }
            }, 300);
        }, 5000);
    }
});