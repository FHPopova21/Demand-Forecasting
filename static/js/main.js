// Main JavaScript file for ML Forecasting System

document.addEventListener('DOMContentLoaded', function () {
    // Form validation
    const predictionForm = document.getElementById('predictForm');
    if (predictionForm) {
        predictionForm.addEventListener('submit', handleFormSubmit);

        // Add real-time validation
        const inputs = predictionForm.querySelectorAll('input[type="number"]');
        inputs.forEach(input => {
            input.addEventListener('input', validateInput);
            input.addEventListener('blur', validateInput);
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
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

    // Add loading animation to buttons
    const buttons = document.querySelectorAll('.btn-primary');
    buttons.forEach(button => {
        button.addEventListener('click', function (e) {
            if (this.closest('form')) {
                // Let form validation handle this
                return;
            }
            addLoadingState(this);
        });
    });

    // Initialize tooltips
    initializeTooltips();

    // Add animation on scroll
    observeElements();
});

function handleFormSubmit(e) {
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');

    // Validate all inputs
    const inputs = form.querySelectorAll('input[required]');
    let isValid = true;

    inputs.forEach(input => {
        if (!input.value || !validateInputValue(input)) {
            isValid = false;
            showError(input, 'Please enter a valid number');
        }
    });

    if (!isValid) {
        e.preventDefault();
        return;
    }

    // Add loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner"></span> Generating...';

    // Add CSS for spinner if not already present
    if (!document.getElementById('spinner-style')) {
        const style = document.createElement('style');
        style.id = 'spinner-style';
        style.textContent = `
            .spinner {
                display: inline-block;
                width: 14px;
                height: 14px;
                border: 2px solid rgba(255,255,255,0.3);
                border-top-color: white;
                border-radius: 50%;
                animation: spin 0.6s linear infinite;
                margin-right: 8px;
            }
            @keyframes spin {
                to { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }
}

function validateInput(e) {
    const input = e.target;
    clearError(input);

    if (!input.value) {
        if (e.type === 'blur') {
            showError(input, 'This field is required');
        }
        return false;
    }

    if (!validateInputValue(input)) {
        showError(input, 'Please enter a valid number');
        return false;
    }

    return true;
}

function validateInputValue(input) {
    const value = parseFloat(input.value);
    return !isNaN(value) && isFinite(value);
}

function showError(input, message) {
    clearError(input);

    const errorDiv = document.createElement('div');
    errorDiv.className = 'input-error';
    errorDiv.textContent = message;
    errorDiv.style.color = '#ef4444';
    errorDiv.style.fontSize = '0.875rem';
    errorDiv.style.marginTop = '0.25rem';

    input.style.borderColor = '#ef4444';
    input.parentElement.appendChild(errorDiv);
}

function clearError(input) {
    input.style.borderColor = '';
    const errorDiv = input.parentElement.querySelector('.input-error');
    if (errorDiv) {
        errorDiv.remove();
    }
}

function addLoadingState(button) {
    const originalText = button.textContent;
    button.disabled = true;
    button.textContent = 'Loading...';

    setTimeout(() => {
        button.disabled = false;
        button.textContent = originalText;
    }, 2000);
}

function initializeTooltips() {
    // Add tooltip functionality if needed
    const helpTexts = document.querySelectorAll('.help-text');
    helpTexts.forEach(text => {
        text.style.cursor = 'help';
    });
}

function observeElements() {
    // Intersection Observer for animations on scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });

    // Observe cards and sections
    const elements = document.querySelectorAll('.card, .section, .step');
    elements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Utility function to format numbers
function formatNumber(num, decimals = 2) {
    return parseFloat(num).toFixed(decimals);
}

// Export for potential use in other scripts
window.MLForecastingApp = {
    formatNumber,
    validateInputValue
};