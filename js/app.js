// Phone number validation
const countryCodeSelect = document.getElementById('countryCode');
const phoneInput = document.getElementById('phone');
const phoneHint = document.getElementById('phoneHint');

if (countryCodeSelect && phoneInput && phoneHint) {
    // Update hint when country code changes
    countryCodeSelect.addEventListener('change', function() {
        const selectedOption = this.options[this.selectedIndex];
        const length = selectedOption.getAttribute('data-length');
        
        if (length) {
            phoneHint.textContent = `Enter ${length} digits for this country`;
            phoneHint.classList.remove('error');
        } else {
            phoneHint.textContent = '';
        }
        
        // Clear phone input when country changes
        phoneInput.value = '';
    });

    // Validate phone input - only allow numbers
    phoneInput.addEventListener('input', function(e) {
        // Remove any non-numeric characters
        this.value = this.value.replace(/[^0-9]/g, '');
        
        const countryCode = countryCodeSelect.value;
        const selectedOption = countryCodeSelect.options[countryCodeSelect.selectedIndex];
        const requiredLength = selectedOption.getAttribute('data-length');
        
        if (countryCode && requiredLength && this.value.length > 0) {
            const lengths = requiredLength.split('-');
            const minLength = parseInt(lengths[0]);
            const maxLength = lengths.length > 1 ? parseInt(lengths[1]) : minLength;
            
            if (this.value.length >= minLength && this.value.length <= maxLength) {
                phoneHint.textContent = `✓ Valid phone number`;
                phoneHint.classList.remove('error');
                phoneHint.style.color = '#00e676';
            } else {
                phoneHint.textContent = `Enter ${requiredLength} digits`;
                phoneHint.classList.add('error');
            }
        }
    });
}

// Handle registration form submission
const registrationForm = document.getElementById('registrationForm');
const formMessage = document.getElementById('formMessage');

if (registrationForm) {
    registrationForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Get form data
        const fullName = document.getElementById('fullName').value.trim();
        const email = document.getElementById('email').value.trim();
        const countryCode = document.getElementById('countryCode') ? document.getElementById('countryCode').value : '';
        const phone = document.getElementById('phone').value.trim();
        const experience = document.getElementById('experience').value;
        const interests = document.getElementById('interests') ? document.getElementById('interests').value : '';
        
        // Validate form
        if (!fullName || !email || !experience) {
            showMessage('Please fill in all required fields', 'error');
            return;
        }

        // Validate phone number
        if (!countryCode || !phone) {
            showMessage('Please select country code and enter phone number', 'error');
            return;
        }

        // Check phone number length
        const selectedOption = document.getElementById('countryCode').options[document.getElementById('countryCode').selectedIndex];
        const requiredLength = selectedOption.getAttribute('data-length');
        if (requiredLength) {
            const lengths = requiredLength.split('-');
            const minLength = parseInt(lengths[0]);
            const maxLength = lengths.length > 1 ? parseInt(lengths[1]) : minLength;
            
            if (phone.length < minLength || phone.length > maxLength) {
                showMessage(`Phone number must be ${requiredLength} digits for selected country`, 'error');
                return;
            }
        }
        
        // Check if phone contains only numbers
        if (!/^\d+$/.test(phone)) {
            showMessage('Phone number must contain only numbers', 'error');
            return;
        }

        // Show loading message
        showMessage('Submitting registration...', 'info');
        
        // Prepare data for Google Apps Script
        const formData = {
            fullName: fullName,
            email: email,
            countryCode: countryCode,
            phone: phone,
            completePhone: countryCode + phone,
            experience: experience,
            interests: interests || 'Not specified'
        };
        
        try {
            // Check if APPS_SCRIPT_URL is configured
            if (!window.APPS_SCRIPT_URL || window.APPS_SCRIPT_URL === 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE') {
                throw new Error('Google Apps Script URL not configured. Please follow setup instructions in GOOGLE_APPS_SCRIPT.md');
            }

            // Send to Google Apps Script
            const response = await fetch(window.APPS_SCRIPT_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'text/plain',
                },
                body: JSON.stringify(formData)
            });

            // Parse the response
            const result = await response.json();
            
            // Check for errors
            if (result.status === 'error') {
                // Handle specific field errors
                if (result.field === 'email') {
                    showMessage('⚠️ ' + result.message, 'error');
                    document.getElementById('email').focus();
                } else if (result.field === 'phone') {
                    showMessage('⚠️ ' + result.message, 'error');
                    document.getElementById('phone').focus();
                } else {
                    showMessage('⚠️ ' + result.message, 'error');
                }
                
                // Clear error message after 10 seconds
                setTimeout(() => {
                    formMessage.textContent = '';
                    formMessage.className = 'form-message';
                }, 10000);
                
                return;
            }
            
            // Show success message
            showMessage('✓ Successfully registered! Check your email for confirmation. We will contact you soon.', 'success');
            
            // Reset form
            registrationForm.reset();
            if (phoneHint) phoneHint.textContent = '';
            
            // Clear message after 8 seconds
            setTimeout(() => {
                formMessage.textContent = '';
                formMessage.className = 'form-message';
            }, 8000);
            
        } catch (error) {
            console.error('Error:', error);
            showMessage('⚠️ An error occurred. Please try again later.', 'error');
            
            // Clear error message after 10 seconds
            setTimeout(() => {
                formMessage.textContent = '';
                formMessage.className = 'form-message';
            }, 10000);
        }
    });
}

function showMessage(message, type) {
    formMessage.textContent = message;
    formMessage.className = `form-message ${type}`;
}

// Modal Handlers
document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navLinks = document.getElementById('navLinks');
    
    if (mobileMenuToggle && navLinks) {
        // Handle both click and touch events for better mobile support
        const toggleMenu = function(e) {
            e.preventDefault();
            e.stopPropagation();
            navLinks.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active');
            
            // Change icon
            const icon = mobileMenuToggle.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.className = 'fas fa-times';
            } else {
                icon.className = 'fas fa-bars';
            }
        };
        
        mobileMenuToggle.addEventListener('click', toggleMenu);
        mobileMenuToggle.addEventListener('touchstart', function(e) {
            e.preventDefault();
            toggleMenu(e);
        }, { passive: false });

        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (navLinks.classList.contains('active') && 
                !navLinks.contains(event.target) && 
                !mobileMenuToggle.contains(event.target)) {
                navLinks.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
                const icon = mobileMenuToggle.querySelector('i');
                icon.className = 'fas fa-bars';
            }
        });

        // Close menu when clicking a nav item
        navLinks.querySelectorAll('.nav-icon-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                navLinks.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
                const icon = mobileMenuToggle.querySelector('i');
                icon.className = 'fas fa-bars';
            });
        });
    }

    // Home Button - scroll to top/hero section
    const navHomeBtn = document.getElementById('navHomeBtn');
    if (navHomeBtn) {
        navHomeBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            // Close all modals
            document.querySelectorAll('.content-modal').forEach(modal => {
                modal.classList.remove('open');
                modal.classList.add('hidden');
            });
        });
    }

    // About Modal
    const navAboutBtn = document.getElementById('navAboutBtn');
    const closeAboutModal = document.getElementById('closeAboutModal');
    const aboutModal = document.getElementById('aboutModal');

    if (navAboutBtn) {
        navAboutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            if (aboutModal) {
                aboutModal.classList.remove('hidden');
                aboutModal.classList.add('open');
            }
        });
    }

    if (closeAboutModal) {
        closeAboutModal.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            if (aboutModal) {
                aboutModal.classList.remove('open');
                aboutModal.classList.add('hidden');
            }
        });
    }

    if (aboutModal) {
        aboutModal.addEventListener('click', function(event) {
            if (event.target === aboutModal) {
                aboutModal.classList.remove('open');
                aboutModal.classList.add('hidden');
            }
        });
    }

    // Inspiration Modal
    const navInspirationToggle = document.getElementById('navInspirationToggle');
    const closeInspirationModal = document.getElementById('closeInspirationModal');
    const inspirationModal = document.getElementById('inspirationModal');

    if (navInspirationToggle) {
        navInspirationToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            if (inspirationModal) {
                inspirationModal.classList.remove('hidden');
                inspirationModal.classList.add('open');
            }
        });
    }

    if (closeInspirationModal) {
        closeInspirationModal.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            if (inspirationModal) {
                inspirationModal.classList.remove('open');
                inspirationModal.classList.add('hidden');
            }
        });
    }

    if (inspirationModal) {
        inspirationModal.addEventListener('click', function(event) {
            if (event.target === inspirationModal) {
                inspirationModal.classList.remove('open');
                inspirationModal.classList.add('hidden');
            }
        });
    }

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
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
        youtube: 'https://www.youtube.com/@ridhcharttalks',
        telegram: 'https://t.me/+R4DCumglwzQwNTEx',
        instagram: 'https://www.instagram.com/ridhcharttalks'
    };
    
    const youtubeLink = document.querySelector('.social-link.youtube');
    const telegramLink = document.querySelector('.social-link.telegram');
    const instagramLink = document.querySelector('.social-link.instagram');
    
    if (youtubeLink) youtubeLink.href = socialLinks.youtube;
    if (telegramLink) telegramLink.href = socialLinks.telegram;
    if (instagramLink) instagramLink.href = socialLinks.instagram;
});
