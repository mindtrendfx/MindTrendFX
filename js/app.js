// Handle registration form submission
const registrationForm = document.getElementById('registrationForm');
const formMessage = document.getElementById('formMessage');

if (registrationForm) {
    registrationForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Get form data
        const fullName = document.getElementById('fullName').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const experience = document.getElementById('experience').value;
        
        // Validate form
        if (!fullName || !email || !experience) {
            showMessage('Please fill in all required fields', 'error');
            return;
        }
        
        try {
            // Save to Firestore
            await db.collection('registrations').add({
                fullName: fullName,
                email: email,
                phone: phone || 'N/A',
                experience: experience,
                registrationDate: new Date(),
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            // Show success message
            showMessage('Successfully registered! We will contact you soon.', 'success');
            
            // Reset form
            registrationForm.reset();
            
            // Clear message after 5 seconds
            setTimeout(() => {
                formMessage.textContent = '';
                formMessage.className = 'form-message';
            }, 5000);
            
        } catch (error) {
            console.error('Error:', error);
            showMessage('An error occurred. Please try again later.', 'error');
        }
    });
}

function showMessage(message, type) {
    formMessage.textContent = message;
    formMessage.className = `form-message ${type}`;
}

// Inspiration Panel Toggle
document.addEventListener('DOMContentLoaded', function() {
    const inspirationToggle = document.getElementById('inspirationToggle');
    const closeInspiration = document.getElementById('closeInspiration');
    const inspirationPanel = document.getElementById('inspirationPanel');

    if (inspirationToggle && inspirationPanel) {
        inspirationToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            inspirationPanel.classList.remove('hidden');
            inspirationPanel.classList.add('open');
            inspirationToggle.classList.add('open');
            console.log('Panel opened');
        });
    }

    if (closeInspiration && inspirationPanel) {
        closeInspiration.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            inspirationPanel.classList.remove('open');
            inspirationPanel.classList.add('hidden');
            if (inspirationToggle) inspirationToggle.classList.remove('open');
            console.log('Panel closed');
        });
    }

    // Close inspiration panel when clicking outside
    document.addEventListener('click', function(event) {
        if (inspirationPanel && 
            !inspirationPanel.contains(event.target) && 
            inspirationToggle &&
            !inspirationToggle.contains(event.target) &&
            inspirationPanel.classList.contains('open')) {
            inspirationPanel.classList.remove('open');
            inspirationPanel.classList.add('hidden');
            if (inspirationToggle) inspirationToggle.classList.remove('open');
        }
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            // Don't prevent default or smooth scroll for buttons
            if (this.tagName === 'BUTTON') return;
            
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Update social media links
    const socialLinks = {
        youtube: 'https://www.youtube.com/YOUR_CHANNEL',
        telegram: 'https://t.me/YOUR_CHANNEL',
        instagram: 'https://www.instagram.com/YOUR_PROFILE'
    };
    
    // Update social links if needed
    const youtubeLink = document.querySelector('.social-link.youtube');
    const telegramLink = document.querySelector('.social-link.telegram');
    const instagramLink = document.querySelector('.social-link.instagram');
    
    if (youtubeLink) youtubeLink.href = socialLinks.youtube;
    if (telegramLink) telegramLink.href = socialLinks.telegram;
    if (instagramLink) instagramLink.href = socialLinks.instagram;
});
