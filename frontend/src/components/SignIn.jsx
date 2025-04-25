import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { EnvelopeIcon, LockClosedIcon, UserIcon, ShieldCheckIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';
import authService from '../services/authService';
import zxcvbn from 'zxcvbn';

const SignIn = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [captchaValue, setCaptchaValue] = useState('');
    const [generatedCaptcha, setGeneratedCaptcha] = useState('');
    const [passwordStrength, setPasswordStrength] = useState({ score: 0, message: '' });

    useEffect(() => {
        generateNewCaptcha();
    }, []);

    useEffect(() => {
        if (formData.password) {
            const result = zxcvbn(formData.password);
            const messages = [
                'Very Weak',
                'Weak',
                'Fair',
                'Strong',
                'Very Strong'
            ];
            setPasswordStrength({
                score: result.score,
                message: messages[result.score]
            });
        }
    }, [formData.password]);

    const generateNewCaptcha = () => {
        const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        let captcha = '';
        for (let i = 0; i < 6; i++) {
            captcha += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setGeneratedCaptcha(captcha);
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const validatePassword = (password) => {
        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        const errors = [];
        if (password.length < minLength) errors.push(`At least ${minLength} characters`);
        if (!hasUpperCase) errors.push('One uppercase letter');
        if (!hasLowerCase) errors.push('One lowercase letter');
        if (!hasNumbers) errors.push('One number');
        if (!hasSpecialChar) errors.push('One special character');

        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Validate captcha
        if (captchaValue !== generatedCaptcha) {
            setError('Invalid captcha. Please try again.');
            generateNewCaptcha();
            setLoading(false);
            return;
        }

        // Validate password
        const passwordErrors = validatePassword(formData.password);
        if (passwordErrors.length > 0) {
            setError(`Password requirements: ${passwordErrors.join(', ')}`);
            setLoading(false);
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        if (!acceptedTerms) {
            setError('Please accept the Terms and Conditions');
            setLoading(false);
            return;
        }

        if (passwordStrength.score < 3) {
            setError('Please choose a stronger password');
            setLoading(false);
            return;
        }

        try {
            const response = await authService.register({
                fullName: formData.fullName,
                email: formData.email,
                password: formData.password
            });
            
            if (response.success && response.token) {
                localStorage.setItem('token', response.token);
                localStorage.setItem('user', JSON.stringify(response.user));
                navigate('/dashboard', { replace: true });
            } else {
                setError(response.message || 'Registration failed');
            }
        } catch (err) {
            console.error('Registration error:', err);
            setError(err.message || 'Registration failed');
            generateNewCaptcha();
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-primary-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="absolute inset-0 overflow-hidden">
                <motion.div
                    className="absolute -top-4 -right-4 w-72 h-72 bg-primary-200 rounded-full mix-blend-multiply filter blur-xl opacity-70"
                    animate={{
                        x: [0, 100, 0],
                        y: [0, 50, 0],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                />
                <motion.div
                    className="absolute -bottom-8 -left-8 w-96 h-96 bg-primary-300 rounded-full mix-blend-multiply filter blur-xl opacity-70"
                    animate={{
                        x: [0, -100, 0],
                        y: [0, -50, 0],
                    }}
                    transition={{
                        duration: 25,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative w-full max-w-md px-6 py-8 bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 mx-4"
            >
                <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/10 rounded-2xl" />
                
                <div className="relative">
                    <div className="text-center mb-8">
                        <ShieldCheckIcon className="mx-auto h-12 w-12 text-primary-600" />
                        <h2 className="mt-4 text-3xl font-bold text-gray-900">Create Account</h2>
                        <p className="mt-2 text-sm text-gray-600">Join us today</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-lg text-sm"
                            >
                                {error}
                            </motion.div>
                        )}

                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="relative"
                        >
                            <UserIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                            <input
                                id="fullName"
                                name="fullName"
                                type="text"
                                required
                                className="w-full pl-10 pr-4 py-3 bg-white/50 backdrop-blur-sm border border-gray-200 rounded-lg focus:ring-0 focus:border-primary-500 text-gray-900 placeholder-gray-400 transition-all duration-200"
                                placeholder="Full Name"
                                value={formData.fullName}
                                onChange={handleChange}
                            />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="relative"
                        >
                            <EnvelopeIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                className="w-full pl-10 pr-4 py-3 bg-white/50 backdrop-blur-sm border border-gray-200 rounded-lg focus:ring-0 focus:border-primary-500 text-gray-900 placeholder-gray-400 transition-all duration-200"
                                placeholder="Email address"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="relative"
                        >
                            <LockClosedIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="w-full pl-10 pr-4 py-3 bg-white/50 backdrop-blur-sm border border-gray-200 rounded-lg focus:ring-0 focus:border-primary-500 text-gray-900 placeholder-gray-400 transition-all duration-200"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                            />
                            {formData.password && (
                                <div className="mt-2">
                                    <div className="flex items-center space-x-2">
                                        {[...Array(5)].map((_, index) => (
                                            <div
                                                key={index}
                                                className={`h-1 flex-1 rounded-full ${
                                                    index <= passwordStrength.score
                                                        ? [
                                                            'bg-red-500',
                                                            'bg-orange-500',
                                                            'bg-yellow-500',
                                                            'bg-green-500',
                                                            'bg-green-600'
                                                          ][passwordStrength.score]
                                                        : 'bg-gray-200'
                                                }`}
                                            />
                                        ))}
                                    </div>
                                    <p className={`text-xs mt-1 ${
                                        passwordStrength.score >= 3 ? 'text-green-600' : 'text-gray-500'
                                    }`}>
                                        Password strength: {passwordStrength.message}
                                    </p>
                                </div>
                            )}
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                            className="relative"
                        >
                            <LockClosedIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                required
                                className="w-full pl-10 pr-4 py-3 bg-white/50 backdrop-blur-sm border border-gray-200 rounded-lg focus:ring-0 focus:border-primary-500 text-gray-900 placeholder-gray-400 transition-all duration-200"
                                placeholder="Confirm Password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                            />
                        </motion.div>

                        {/* Captcha */}
                        <div>
                            <label htmlFor="captcha" className="block text-sm font-medium text-gray-700">
                                Security Check
                            </label>
                            <div className="mt-1 flex items-center space-x-4">
                                <div className="flex-1">
                                    <input
                                        type="text"
                                        id="captcha"
                                        value={captchaValue}
                                        onChange={(e) => setCaptchaValue(e.target.value)}
                                        className="block w-full px-4 py-3 bg-white/50 backdrop-blur-sm border border-gray-200 rounded-lg focus:ring-0 focus:border-primary-500 text-gray-900 placeholder-gray-400"
                                        placeholder="Enter captcha"
                                        required
                                    />
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="px-4 py-2 bg-gray-100 rounded font-mono text-sm select-none">
                                        {generatedCaptcha}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={generateNewCaptcha}
                                        className="p-2 text-gray-500 hover:text-gray-700"
                                    >
                                        ↺
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center">
                            <input
                                id="terms"
                                name="terms"
                                type="checkbox"
                                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                                checked={acceptedTerms}
                                onChange={(e) => setAcceptedTerms(e.target.checked)}
                            />
                            <label htmlFor="terms" className="ml-2 block text-sm text-gray-600">
                                I accept the{' '}
                                <a href="/terms" className="text-primary-600 hover:text-primary-700">
                                    Terms and Conditions
                                </a>
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full px-4 py-3 text-white bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg hover:from-primary-600 hover:to-primary-700 transition-all duration-200 hover:shadow-lg hover:shadow-primary-500/20 disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm"
                        >
                            {loading ? 'Creating account...' : 'Create Account'}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            Already have an account?{' '}
                            <button
                                onClick={() => navigate('/login')}
                                className="font-medium text-primary-600 hover:text-primary-500 transition-colors"
                            >
                                Sign in
                            </button>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default SignIn; 