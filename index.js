//DATA STORAGE 
let registrations = [];

//TAB SWITCHING FUNCTIONALITY
document.addEventListener('DOMContentLoaded', function() {
    // Get all tab buttons and content sections
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    // Add click event listeners to tab buttons
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Show corresponding content
            const targetContent = document.getElementById(targetTab);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });

    // Initialize form event listeners
    initializeRegistrationForm();
    initializeFeedbackForm();
});

// REGISTRATION FORM HANDLING 
function initializeRegistrationForm() {
    const registrationForm = document.getElementById('registrationForm');
    
    registrationForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent page reload
        
        // Validate form
        if (!validateRegistrationForm()) {
            showMessage('Please fill in all required fields correctly.', 'error');
            return;
        }

        // Get form data
        const formData = {
            studentName: document.getElementById('studentName').value.trim(),
            studentId: document.getElementById('studentId').value.trim(),
            email: document.getElementById('email').value.trim(),
            course: document.getElementById('course').value,
            semester: document.getElementById('semester').value,
            studyMode: document.querySelector('input[name="studyMode"]:checked').value,
            registrationDate: new Date().toLocaleDateString('en-AU', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            })
        };

        // Add to registrations array
        registrations.push(formData);

        // Update the table
        updateRecordsTable();

        // Show success message
        showMessage(`✅ Registration successful! Welcome, ${formData.studentName}!`, 'success');

        // Reset form
        registrationForm.reset();

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Add real-time validation to Student ID
    const studentIdInput = document.getElementById('studentId');
    studentIdInput.addEventListener('input', function() {
        const value = this.value;
        if (value && !/^\d{0,8}$/.test(value)) {
            this.setCustomValidity('Student ID must contain only numbers (max 8 digits)');
        } else {
            this.setCustomValidity('');
        }
    });

    // Add real-time validation to Email
    const emailInput = document.getElementById('email');
    emailInput.addEventListener('blur', function() {
        const value = this.value;
        if (value && !value.includes('@')) {
            showMessage('Please enter a valid email address.', 'error');
        }
    });
}

// REGISTRATION FORM VALIDATION 
function validateRegistrationForm() {
    const studentName = document.getElementById('studentName').value.trim();
    const studentId = document.getElementById('studentId').value.trim();
    const email = document.getElementById('email').value.trim();
    const course = document.getElementById('course').value;
    const semester = document.getElementById('semester').value;
    const studyMode = document.querySelector('input[name="studyMode"]:checked');

    // Check if all fields are filled
    if (!studentName || !studentId || !email || !course || !semester || !studyMode) {
        return false;
    }

    // Validate Student ID (must be 8 digits)
    if (!/^\d{8}$/.test(studentId)) {
        showMessage('Student ID must be exactly 8 digits.', 'error');
        return false;
    }

    // Validate email format
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        showMessage('Please enter a valid email address.', 'error');
        return false;
    }

    return true;
}

// FEEDBACK FORM HANDLING
function initializeFeedbackForm() {
    const feedbackForm = document.getElementById('feedbackForm');
    
    feedbackForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent page reload
        
        // Validate form
        if (!validateFeedbackForm()) {
            showMessage('Please fill in all required fields.', 'error');
            return;
        }

        // Get form data
        const isAnonymous = document.getElementById('anonymous').checked;
        const feedbackData = {
            name: isAnonymous ? 'Anonymous' : document.getElementById('feedbackName').value.trim(),
            course: document.getElementById('feedbackCourse').value,
            rating: document.getElementById('rating').value,
            comments: document.getElementById('comments').value.trim(),
            anonymous: isAnonymous,
            submissionDate: new Date().toLocaleDateString('en-AU', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            })
        };

        // Show success message
        const thankYouMessage = isAnonymous 
            ? '✅ Thank you for your anonymous feedback!' 
            : `✅ Thank you for your feedback, ${feedbackData.name}!`;
        showMessage(thankYouMessage, 'success');

        // Reset form
        feedbackForm.reset();

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Add character counter to comments
    const commentsTextarea = document.getElementById('comments');
    commentsTextarea.addEventListener('input', function() {
        const charCount = this.value.length;
        if (charCount < 10 && charCount > 0) {
            this.style.borderColor = '#dc3545';
        } else {
            this.style.borderColor = '#e0e0e0';
        }
    });
}

// FEEDBACK FORM VALIDATION
function validateFeedbackForm() {
    const feedbackName = document.getElementById('feedbackName').value.trim();
    const feedbackCourse = document.getElementById('feedbackCourse').value;
    const rating = document.getElementById('rating').value;
    const comments = document.getElementById('comments').value.trim();

    // Check if all required fields are filled
    if (!feedbackName || !feedbackCourse || !rating || !comments) {
        return false;
    }

    // Validate comments length
    if (comments.length < 10) {
        showMessage('Comments must be at least 10 characters long.', 'error');
        return false;
    }

    return true;
}

// UPDATE RECORDS TABLE
function updateRecordsTable() {
    const tableBody = document.getElementById('recordsTableBody');
    
    // Clear existing content
    tableBody.innerHTML = '';

    // Check if there are any registrations
    if (registrations.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="8" class="no-records">No registrations yet. Submit the registration form to see records here.</td>
            </tr>
        `;
        return;
    }

    // Add each registration as a table row
    registrations.forEach((registration, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${registration.studentName}</td>
            <td>${registration.studentId}</td>
            <td>${registration.email}</td>
            <td>${registration.course}</td>
            <td>${registration.semester}</td>
            <td>${registration.studyMode}</td>
            <td>${registration.registrationDate}</td>
        `;
        tableBody.appendChild(row);
    });
}

// MESSAGE BOX DISPLAY
function showMessage(message, type) {
    const messageBox = document.getElementById('messageBox');
    
    // Set message and type
    messageBox.textContent = message;
    messageBox.className = 'message-box ' + type;
    
    // Remove animation class if it exists
    messageBox.style.animation = 'none';
    
    // Trigger reflow
    void messageBox.offsetWidth;
    
    // Re-add animation
    messageBox.style.animation = '';
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        messageBox.classList.add('hidden');
    }, 5000);
}

// ADDITIONAL INTERACTIVITY 
// Add hover effect to table rows
document.addEventListener('DOMContentLoaded', function() {
    // This demonstrates DOM manipulation after page load
    console.log('Student Registration & Feedback System Loaded');
    console.log('Demonstrating SIT 322 Skills:');
    console.log('✓ HTML Forms with validation');
    console.log('✓ CSS styling with box model');
    console.log('✓ JavaScript event handling');
    console.log('✓ DOM manipulation');
    console.log('✓ Client-side form validation');
});