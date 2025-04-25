import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { EyeIcon, EyeSlashIcon, ShieldCheckIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';
import authService from '../services/authService';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [loginAttempts, setLoginAttempts] = useState(0);
    const [isBlocked, setIsBlocked] = useState(false);
    const [blockTimer, setBlockTimer] = useState(0);
    const [captchaValue, setCaptchaValue] = useState('');
    const [generatedCaptcha, setGeneratedCaptcha] = useState('');
    const [passwordStrength, setPasswordStrength] = useState({ score: 0, message: '' });
    const navigate = useNavigate();

    useEffect(() => {
        generateNewCaptcha();
        checkBlockStatus();
    }, []);

    useEffect(() => {
        let interval;
        if (blockTimer > 0) {
            interval = setInterval(() => {
                setBlockTimer((prev) => prev - 1);
            }, 1000);
        } else if (blockTimer === 0) {
            setIsBlocked(false);
        }
        return () => clearInterval(interval);
    }, [blockTimer]);

    const generateNewCaptcha = () => {
        const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        let captcha = '';
        for (let i = 0; i < 6; i++) {
            captcha += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setGeneratedCaptcha(captcha);
    };

    const checkBlockStatus = () => {
        const blockUntil = localStorage.getItem('blockUntil');
        if (blockUntil) {
            const remainingTime = Math.max(0, Math.floor((parseInt(blockUntil) - Date.now()) / 1000));
            if (remainingTime > 0) {
                setIsBlocked(true);
                setBlockTimer(remainingTime);
            } else {
                localStorage.removeItem('blockUntil');
                setLoginAttempts(0);
            }
        }
    };

    const handleLoginFailure = () => {
        const newAttempts = loginAttempts + 1;
        setLoginAttempts(newAttempts);
        
        if (newAttempts >= 3) {
            const blockDuration = Math.min(Math.pow(2, newAttempts - 3) * 30, 1800); // Max 30 minutes
            const blockUntil = Date.now() + (blockDuration * 1000);
            localStorage.setItem('blockUntil', blockUntil.toString());
            setIsBlocked(true);
            setBlockTimer(blockDuration);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isBlocked) return;
        
        setError('');
        setLoading(true);

        // Validate captcha
        if (captchaValue !== generatedCaptcha) {
            setError('Invalid captcha. Please try again.');
            generateNewCaptcha();
            setLoading(false);
            return;
        }

        try {
            const response = await authService.login(email, password);
            if (response.token) {
                localStorage.setItem('token', response.token);
                localStorage.setItem('user', JSON.stringify(response.user));
                setLoginAttempts(0);
                localStorage.removeItem('blockUntil');
                setLoading(false);
                navigate('/dashboard', { replace: true });
            }
        } catch (error) {
            setError(error.message || 'Login failed. Please try again.');
            handleLoginFailure();
            generateNewCaptcha();
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-primary-100">
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
                        <h2 className="mt-4 text-3xl font-bold text-gray-900">Welcome Back</h2>
                        <p className="mt-2 text-sm text-gray-600">Please sign in to your account</p>
                    </div>

                    {isBlocked && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-6 p-4 bg-red-50 rounded-lg border border-red-100"
                        >
                            <div className="flex items-center">
                                <ExclamationCircleIcon className="h-5 w-5 text-red-500 mr-2" />
                                <p className="text-sm text-red-600">
                                    Account temporarily blocked. Please try again in {Math.floor(blockTimer / 60)}m {blockTimer % 60}s
                                </p>
                            </div>
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="mt-1 block w-full px-4 py-3 bg-white/50 backdrop-blur-sm border border-gray-200 rounded-lg focus:ring-0 focus:border-primary-500 text-gray-900 placeholder-gray-400"
                                placeholder="Enter your email"
                                required
                                disabled={isBlocked}
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <div className="mt-1 relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full px-4 py-3 bg-white/50 backdrop-blur-sm border border-gray-200 rounded-lg focus:ring-0 focus:border-primary-500 text-gray-900 placeholder-gray-400"
                                    placeholder="Enter your password"
                                    required
                                    disabled={isBlocked}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    disabled={isBlocked}
                                >
                                    {showPassword ? (
                                        <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                                    ) : (
                                        <EyeIcon className="h-5 w-5 text-gray-400" />
                                    )}
                                </button>
                            </div>
                        </div>

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
                                        disabled={isBlocked}
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
                                        disabled={isBlocked}
                                    >
                                        ↺
                                    </button>
                                </div>
                            </div>
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg"
                            >
                                {error}
                            </motion.div>
                        )}

                        <button
                            type="submit"
                            disabled={loading || isBlocked}
                            className="w-full px-4 py-3 text-white bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg hover:from-primary-600 hover:to-primary-700 transition-all duration-200 hover:shadow-lg hover:shadow-primary-500/20 disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm"
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            Don't have an account?{' '}
                            <Link to="/signin" className="text-primary-600 hover:text-primary-700 font-medium">
                                Sign up
                            </Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Login; 