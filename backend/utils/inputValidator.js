const validateEmail = (email) => {
    const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email);
};

const validatePassword = (password) => {
    return password.length >= 6;
};

const validateRegistration = (data) => {
    const errors = {};

    if (!data.fullName || data.fullName.length < 2) {
        errors.fullName = 'Full name must be at least 2 characters long';
    }

    if (!data.email || !validateEmail(data.email)) {
        errors.email = 'Please enter a valid email address';
    }

    if (!data.password || !validatePassword(data.password)) {
        errors.password = 'Password must be at least 6 characters long';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

const validateScriptGeneration = (data) => {
    const errors = {};

    if (!data.productName?.trim()) {
        errors.productName = 'Product name is required';
    }

    if (!data.targetAudience?.trim()) {
        errors.targetAudience = 'Target audience is required';
    }

    if (!data.tone?.trim()) {
        errors.tone = 'Tone is required';
    }

    if (!data.adStyle?.trim()) {
        errors.adStyle = 'Ad style is required';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

module.exports = {
    validateEmail,
    validatePassword,
    validateRegistration,
    validateScriptGeneration
}; 