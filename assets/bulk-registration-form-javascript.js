document.addEventListener('DOMContentLoaded', function () {
    // DOM Elements
    const elements = {
        step1: document.querySelector('.bulk-registration-form-step.step1'),
        step2: document.querySelector('.bulk-registration-form-step.step2'),
        previousButton: document.querySelector('.bulk-registration-form-button.previous-button'),
        nextButton: document.querySelector('.bulk-registration-form-button.next-submit-button'),
        form: document.querySelector('.bulk-registration-form form'),
        inputs: document.querySelectorAll('.bulk-registration-form input[required]')
    };

    // Validation patterns
    const validationRules = {
        name: {
            minLength: 2,
            pattern: /^[a-zA-Z\s]+$/,
            messages: {
                minLength: 'Name must be at least 2 characters long',
                pattern: 'Name should only contain letters and spaces'
            }
        },
        email: {
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            messages: {
                pattern: 'Please enter a valid email address'
            }
        },
        phone: {
            pattern: /^[6-9]\d{9}$/,
            messages: {
                pattern: 'Please enter a valid 10-digit mobile number'
            }
        },
        institution_name: {
            minLength: 2,
            messages: {
                minLength: 'Institution name must be at least 2 characters long'
            }
        }
    };

    let currentStep = 1;

    // Initialize
    init();

    function init() {
        updateButtonStates();
        attachEventListeners();
    }

    function attachEventListeners() {
        // Navigation buttons
        elements.previousButton.addEventListener('click', handlePreviousClick);
        elements.nextButton.addEventListener('click', handleNextClick);

        // Input validation
        elements.inputs.forEach(input => {
            const handleValidation = () => {
                validateFieldInline(input);
                updateButtonStates();
            };
            input.addEventListener('input', handleValidation);
            input.addEventListener('blur', handleValidation);
        });
    }

    function handlePreviousClick() {
        if (currentStep === 2) {
            currentStep = 1;
            updateSteps();
            updateButtonStates();
        }
    }

    function handleNextClick() {
        if (currentStep === 1) {
            currentStep = 2;
            updateSteps();
            updateButtonStates();
        } else if (currentStep === 2 && validateAllFields()) {
            handleFormSubmission();
        }
    }

    function updateSteps() {
        elements.step1.classList.toggle('active', currentStep === 1);
        elements.step2.classList.toggle('active', currentStep === 2);
    }

    function updateButtonStates() {
        // Previous button state
        elements.previousButton.classList.toggle('disabled', currentStep === 1);

        // Next/Submit button state
        if (currentStep === 1) {
            elements.nextButton.textContent = 'Next';
            elements.nextButton.classList.remove('disabled');
        } else {
            elements.nextButton.textContent = 'Submit';
            elements.nextButton.classList.toggle('disabled', !validateAllFields());
        }
    }

    function validateFieldInline(input) {
        const value = input.value.trim();
        const fieldContainer = input.closest('.bulk-registration-form-field');

        // Clear previous error state
        clearFieldError(input, fieldContainer);

        // Skip validation if field is empty
        if (!value) return true;

        const rule = validationRules[input.name];
        if (!rule) return true;

        const errorMessage = getValidationError(value, rule, input.name);

        if (errorMessage) {
            showFieldError(input, fieldContainer, errorMessage);
            return false;
        }

        return true;
    }

    function getValidationError(value, rule, fieldName) {
        // Check minimum length
        if (rule.minLength && value.length < rule.minLength) {
            return rule.messages.minLength;
        }

        // Check pattern
        if (rule.pattern) {
            const testValue = fieldName === 'phone' ? value.replace(/[\s-]/g, '') : value;
            if (!rule.pattern.test(testValue)) {
                return rule.messages.pattern;
            }
        }

        return null;
    }

    function clearFieldError(input, fieldContainer) {
        const existingError = fieldContainer.querySelector('.field-error-message');
        if (existingError) existingError.remove();
        input.classList.remove('field-error');
    }

    function showFieldError(input, fieldContainer, message) {
        input.classList.add('field-error');
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error-message';
        errorDiv.textContent = message;
        fieldContainer.appendChild(errorDiv);
    }

    function validateAllFields() {
        return Array.from(elements.inputs).every(input => {
            const value = input.value.trim();
            if (!value) return false;

            // Use inline validation logic for consistency
            return validateFieldInline(input);
        });
    }

    function handleFormSubmission() {
        const formData = getFormData();
        sendBulkRegistrationEvent(formData);
        showSuccessMessage();
        resetForm();
        console.log('Form submitted successfully!', formData);
    }

    function getFormData() {
        return {
            name: document.getElementById('input-name').value.trim(),
            email: document.getElementById('input-email').value.trim(),
            phone: `+91${document.getElementById('input-phone').value.trim()}`,
            institutionName: document.getElementById('input-institution_name').value.trim()
        };
    }

    function showSuccessMessage() {
        // Remove any existing success message
        const existingMessage = document.querySelector('.bulk-registration-success-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Create success message popup
        const successDiv = document.createElement('div');
        successDiv.className = 'bulk-registration-success-message';
        successDiv.innerHTML = `
            <div class="success-popup">
                <button class="success-popup-close" aria-label="Close popup">×</button>
                <div class="success-icon">✓</div>
                <h3>Form Submitted Successfully!</h3>
                <p>Thank you for your interest. We'll get back to you soon.</p>
            </div>
        `;

        // Append to body for absolute positioning
        document.body.appendChild(successDiv);

        // Add close functionality
        const closeButton = successDiv.querySelector('.success-popup-close');
        const closePopup = () => {
            if (successDiv.parentNode) {
                successDiv.remove();
            }
        };

        // Close on button click
        closeButton.addEventListener('click', closePopup);

        // Close on backdrop click
        successDiv.addEventListener('click', function (e) {
            if (e.target === successDiv) {
                closePopup();
            }
        });

        // Close on Escape key
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                closePopup();
                document.removeEventListener('keydown', handleEscape);
            }
        };
        document.addEventListener('keydown', handleEscape);

        // Auto-hide success message after 5 seconds
        const autoHideTimeout = setTimeout(closePopup, 5000);

        // Clear timeout if manually closed
        closeButton.addEventListener('click', () => clearTimeout(autoHideTimeout));
    }

    function resetForm() {
        // Reset all form fields
        elements.inputs.forEach(input => {
            input.value = '';
            clearFieldError(input, input.closest('.bulk-registration-form-field'));
        });

        // Reset to step 1
        currentStep = 1;
        updateSteps();
        updateButtonStates();
    }

    function sendBulkRegistrationEvent(formData) {
        try {
            const clevertap = window.parent.clevertap;
            if (!clevertap) {
                console.error("CleverTap not found");
                return;
            }

            const eventData = {
                "Name": formData.name,
                "Email Id": formData.email,
                "Phone Number": formData.phone,
                "Institution Name": formData.institutionName,
                "Action": "Bulk Registration Form Submission"
            };

            const userProfileData = {
                "Name": formData.name,
                "Email": formData.email,
                "Phone": formData.phone,
                "Institution Name": formData.institutionName
            };

            clevertap.event.push("Bulk Registration Form Submission", eventData);
            clevertap.onUserLogin.push({ Site: userProfileData });

            console.log("CleverTap data sent successfully:", eventData);
        } catch (error) {
            console.error("CleverTap error:", error);
        }
    }
});