/**
 * Contact Form Handler - EmailJS Only Version
 * Uses EmailJS for emails, Firebase for storage (free tier)
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ Contact form handler loaded');
    
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) {
        console.error('❌ Contact form not found');
        return;
    }
    
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;
    let isSubmitting = false;
    
    // ================================
    // 1. EMAILJS CONFIGURATION
    // ================================
    const EMAILJS_CONFIG = {
        SERVICE_ID: "service_9wa2k0m",           // Your EmailJS Service ID
        TEMPLATE_ID: "template_rw856lf",         // Your NEW EmailJS Template ID
        PUBLIC_KEY: "TLxfUqRe-MdXkNdv4",         // Your EmailJS Public Key
        TO_EMAIL: "otherworks523501@gmail.com"   // Your receiving email
    };
    
    console.log('📧 EmailJS Config:', EMAILJS_CONFIG);
    
    // Initialize EmailJS
    if (typeof emailjs !== 'undefined') {
        emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
        console.log('✅ EmailJS initialized');
    } else {
        console.error('❌ EmailJS SDK not loaded!');
        showMessage('Email service not loaded. Please refresh page.', 'error');
        return;
    }
    
    // ================================
    // 2. SIMPLIFIED FIREBASE (Optional - Can be removed)
    // ================================
    const firebaseConfig = {
        apiKey: "AIzaSyDzwkyc5DzZprkiYpuFhrabxrp4VZ1yWjQ",
        authDomain: "my-portfolio-9951.firebaseapp.com",
        projectId: "my-portfolio-9951",
        storageBucket: "my-portfolio-9951.firebasestorage.app",
        messagingSenderId: "152313884589",
        appId: "1:152313884589:web:29c41db9d6a02017c3fb24",
        measurementId: "G-943YW07NCW"
    };
    
    let firebaseAvailable = false;
    
    // Try to initialize Firebase (optional)
    function tryInitFirebase() {
        if (typeof firebase === 'undefined') {
            console.warn('⚠️ Firebase SDK not loaded - skipping storage');
            return false;
        }
        
        try {
            if (!firebase.apps.length) {
                firebase.initializeApp(firebaseConfig);
            }
            firebaseAvailable = true;
            console.log('✅ Firebase available for storage');
            return true;
        } catch (error) {
            console.warn('⚠️ Firebase init failed:', error.message);
            console.log('ℹ️ Continuing without Firebase storage');
            return false;
        }
    }
    
    // ================================
    // 3. UTILITY FUNCTIONS
    // ================================
    
    // Get user IP address
    async function getUserIP() {
        try {
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            return data.ip;
        } catch (error) {
            return 'unknown';
        }
    }
    
    // Save to localStorage as backup
    function saveToLocalStorage(formData) {
        try {
            const messages = JSON.parse(localStorage.getItem('portfolioContacts') || '[]');
            messages.push({
                ...formData,
                savedAt: new Date().toISOString(),
                synced: false
            });
            localStorage.setItem('portfolioContacts', JSON.stringify(messages));
            console.log('💾 Saved to localStorage backup');
            return true;
        } catch (error) {
            console.warn('Could not save to localStorage');
            return false;
        }
    }
    
    // ================================
    // 4. SEND EMAIL VIA EMAILJS (MAIN FUNCTION)
    // ================================
    async function sendEmailViaEmailJS(formData) {
        return new Promise((resolve, reject) => {
            // Template parameters for your template
            const templateParams = {
                from_name: formData.name,
                from_email: formData.email,
                email: formData.email,
                message: formData.message,
                timestamp: new Date().toLocaleString('en-US', {
                    weekday: 'short',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                }),
                ip_address: formData.ip || 'unknown',
                name: formData.name,
                title: `Contact from ${formData.name}`
            };
            
            console.log('📤 Sending email via EmailJS:', templateParams);
            
            emailjs.send(
                EMAILJS_CONFIG.SERVICE_ID,
                EMAILJS_CONFIG.TEMPLATE_ID,
                templateParams
            )
            .then(response => {
                console.log('✅ Email sent successfully! Status:', response.status);
                resolve(response);
            })
            .catch(error => {
                console.error('❌ EmailJS Error:', error);
                reject(error);
            });
        });
    }
    
    // ================================
    // 5. SAVE TO FIREBASE (Optional - can fail)
    // ================================
    async function saveToFirebaseIfAvailable(formData) {
        if (!firebaseAvailable) {
            console.log('ℹ️ Firebase not available, skipping save');
            return { success: false, reason: 'firebase_not_available' };
        }
        
        try {
            const db = firebase.firestore();
            const messageData = {
                name: formData.name,
                email: formData.email,
                message: formData.message,
                ip: formData.ip,
                date: new Date().toLocaleString(),
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                status: 'new',
                read: false,
                emailSent: true,
                emailSentAt: new Date().toISOString()
            };
            
            const docRef = await db.collection('contactMessages').add(messageData);
            console.log('✅ Saved to Firebase:', docRef.id);
            return { success: true, id: docRef.id };
            
        } catch (error) {
            console.warn('⚠️ Firebase save failed:', error.message);
            return { success: false, error: error.message };
        }
    }
    
    // ================================
    // 6. FORM VALIDATION
    // ================================
    function validateForm(name, email, message) {
        if (!name || name.trim().length < 2) {
            return 'Name must be at least 2 characters';
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            return 'Please enter a valid email address';
        }
        
        if (!message || message.trim().length < 10) {
            return 'Message must be at least 10 characters';
        }
        
        return null; // No errors
    }
    
    // ================================
    // 7. USER FEEDBACK FUNCTIONS
    // ================================
    function showMessage(text, type = 'success') {
        // Remove existing messages
        const existing = document.querySelector('.form-feedback');
        if (existing) existing.remove();
        
        // Create message
        const messageDiv = document.createElement('div');
        messageDiv.className = 'form-feedback';
        messageDiv.innerHTML = `
            <div style="
                padding: 12px 16px;
                border-radius: 8px;
                margin-top: 15px;
                font-weight: 500;
                display: flex;
                align-items: center;
                gap: 10px;
                ${type === 'success' 
                    ? 'background: rgba(72, 187, 120, 0.1); border: 1px solid #48bb78; color: #48bb78;' 
                    : 'background: rgba(245, 101, 101, 0.1); border: 1px solid #f56565; color: #f56565;'
                }
            ">
                <i class='bx ${type === 'success' ? 'bx-check-circle' : 'bx-error-circle'}'></i>
                <span>${text}</span>
            </div>
        `;
        
        contactForm.appendChild(messageDiv);
        
        // Auto-remove success messages
        if (type === 'success') {
            setTimeout(() => {
                if (messageDiv.parentNode) {
                    messageDiv.style.opacity = '0';
                    setTimeout(() => messageDiv.remove(), 300);
                }
            }, 5000);
        }
    }
    
    // ================================
    // 8. MAIN FORM SUBMIT HANDLER
    // ================================
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        if (isSubmitting) return;
        isSubmitting = true;
        
        // Get form values
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();
        
        // Validate
        const validationError = validateForm(name, email, message);
        if (validationError) {
            showMessage(validationError, 'error');
            isSubmitting = false;
            return;
        }
        
        // Show loading
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="bx bx-loader-alt bx-spin"></i> Sending...';
        
        try {
            console.log('🚀 Starting form submission...');
            
            // Get IP
            const ipAddress = await getUserIP();
            
            // Step 1: Try to save to Firebase (optional)
            tryInitFirebase(); // Try to init
            const firebaseResult = await saveToFirebaseIfAvailable({
                name, email, message, ip: ipAddress
            });
            
            // Step 2: Save to localStorage as backup
            saveToLocalStorage({
                name, email, message, ip: ipAddress
            });
            
            // Step 3: Send email via EmailJS (MAIN ACTION)
            console.log('📧 Sending email...');
            const emailResult = await sendEmailViaEmailJS({
                name, email, message, ip: ipAddress
            });
            
            // Success!
            showMessage('✅ Message sent successfully! I\'ll get back to you soon.', 'success');
            contactForm.reset();
            
            console.log('🎉 Form submitted successfully!');
            console.log('- Email sent:', emailResult.status);
            console.log('- Firebase saved:', firebaseResult.success);
            
        } catch (error) {
            console.error('❌ Form submission failed:', error);
            
            // Handle specific errors
            if (error.text && error.text.includes('Invalid template')) {
                showMessage('Email template issue. Message saved locally.', 'error');
            } else if (error.text && error.text.includes('limit')) {
                showMessage('Daily email limit reached. Message saved locally.', 'error');
            } else {
                showMessage('⚠️ Could not send email. Message saved locally.', 'error');
            }
            
            // Still save to localStorage even if email fails
            const ipAddress = await getUserIP();
            saveToLocalStorage({
                name, email, message, ip: ipAddress
            });
            
        } finally {
            // Reset button
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
            isSubmitting = false;
        }
    });
    
    // ================================
    // 9. TEST FUNCTION
    // ================================
    window.testEmailJS = function() {
        console.log('🧪 Testing EmailJS...');
        
        if (typeof emailjs === 'undefined') {
            console.error('EmailJS not loaded');
            showMessage('EmailJS not loaded', 'error');
            return;
        }
        
        const testParams = {
            from_name: "Test User",
            from_email: "test@example.com",
            email: "test@example.com",
            message: "This is a test email from your portfolio website. If you receive this, EmailJS is working!",
            timestamp: new Date().toLocaleString(),
            ip_address: "127.0.0.1",
            name: "Test User",
            title: "Test Email"
        };
        
        console.log('Test parameters:', testParams);
        
        emailjs.send(EMAILJS_CONFIG.SERVICE_ID, EMAILJS_CONFIG.TEMPLATE_ID, testParams)
            .then(response => {
                console.log('✅ Test email sent! Status:', response.status);
                showMessage('✅ Test email sent! Check your inbox.', 'success');
                alert('✅ Test email sent! Check: otherworks523501@gmail.com');
            })
            .catch(error => {
                console.error('❌ Test failed:', error);
                console.error('Error:', error.text);
                showMessage('❌ Test failed: ' + (error.text || 'Unknown error'), 'error');
            });
    };
    
    // ================================
    // 10. ADD DEBUG BUTTON
    // ================================
    function addDebugButton() {
        const btn = document.createElement('button');
        btn.innerHTML = '📧 Test Email';
        btn.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 10px 15px;
            background: #4CAF50;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            z-index: 9999;
            font-size: 14px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        `;
        btn.onclick = window.testEmailJS;
        document.body.appendChild(btn);
        console.log('🔧 Debug button added');
    }
    
    // ================================
    // 11. INITIALIZATION
    // ================================
    console.log('🔍 System check:');
    console.log('- EmailJS loaded:', typeof emailjs !== 'undefined');
    console.log('- Firebase loaded:', typeof firebase !== 'undefined');
    console.log('- Template ID:', EMAILJS_CONFIG.TEMPLATE_ID);
    console.log('✅ Contact form ready!');
    
    // Try to init Firebase
    tryInitFirebase();
    
    // Add debug button
    setTimeout(addDebugButton, 1000);
    
    // Test EmailJS connection (optional)
    // setTimeout(() => testEmailJS(), 3000);
});

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    .form-feedback {
        animation: fadeIn 0.3s ease;
    }
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(style);