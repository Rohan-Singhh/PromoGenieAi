import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    XMarkIcon,
    BellIcon,
    ShieldCheckIcon,
    LanguageIcon,
    EyeIcon,
    KeyIcon,
    SunIcon,
    MoonIcon,
    DevicePhoneMobileIcon,
    SwatchIcon,
    CurrencyDollarIcon,
    CheckCircleIcon,
    ExclamationCircleIcon,
    EyeSlashIcon,
    ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';
import { useTheme } from '../context/ThemeContext';
import authService from '../services/authService';
import { useNavigate } from 'react-router-dom';

const SettingsModal = ({ isOpen, onClose }) => {
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const [isSaving, setIsSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState(null); // 'success' | 'error' | null
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false
    });
    const [passwordError, setPasswordError] = useState('');
    const [isChangingPassword, setIsChangingPassword] = useState(false);

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const handleSaveChanges = async () => {
        setIsSaving(true);
        setSaveStatus(null);

        try {
            // Simulate API call to save settings
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Save successful
            setSaveStatus('success');
            
            // Close modal after showing success state for 1 second
            setTimeout(() => {
                setSaveStatus(null);
                setIsSaving(false);
                onClose(); // Close the modal
            }, 1000);
        } catch (error) {
            // Save failed
            setSaveStatus('error');
            setIsSaving(false);
        }
    };

    const handlePasswordChange = async () => {
        setIsChangingPassword(true);
        setPasswordError('');

        try {
            await authService.changePassword(
                passwordData.currentPassword,
                passwordData.newPassword,
                passwordData.confirmPassword
            );

            // Show success state
            setSaveStatus('success');
            
            // Reset form and close modal after delay
            setTimeout(() => {
                setPasswordData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                });
                setShowPasswordModal(false);
                setSaveStatus(null);
                setIsChangingPassword(false);
            }, 1500);
        } catch (error) {
            setPasswordError(error.message || 'Failed to change password');
            setIsChangingPassword(false);
        }
    };

    const handleLogout = () => {
        authService.logout();
        navigate('/');
    };

    if (!isOpen) return null;

    const PasswordChangeModal = () => (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10000] flex items-center justify-center p-4"
        >
            <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm" onClick={() => setShowPasswordModal(false)} />
            
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md p-6"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={() => setShowPasswordModal(false)}
                    className="absolute top-4 right-4 text-gray-400 dark:text-gray-500"
                >
                    <XMarkIcon className="h-6 w-6" />
                </button>

                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Change Password</h3>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Current Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPasswords.current ? "text" : "password"}
                                value={passwordData.currentPassword}
                                onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent pr-10"
                            />
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setShowPasswords(prev => ({ ...prev, current: !prev.current }));
                                }}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
                            >
                                {showPasswords.current ? 
                                    <EyeSlashIcon className="h-5 w-5" /> : 
                                    <EyeIcon className="h-5 w-5" />
                                }
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            New Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPasswords.new ? "text" : "password"}
                                value={passwordData.newPassword}
                                onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent pr-10"
                            />
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setShowPasswords(prev => ({ ...prev, new: !prev.new }));
                                }}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
                            >
                                {showPasswords.new ? 
                                    <EyeSlashIcon className="h-5 w-5" /> : 
                                    <EyeIcon className="h-5 w-5" />
                                }
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Confirm New Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPasswords.confirm ? "text" : "password"}
                                value={passwordData.confirmPassword}
                                onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent pr-10"
                            />
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }));
                                }}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
                            >
                                {showPasswords.confirm ? 
                                    <EyeSlashIcon className="h-5 w-5" /> : 
                                    <EyeIcon className="h-5 w-5" />
                                }
                            </button>
                        </div>
                    </div>

                    {passwordError && (
                        <div className="text-red-500 text-sm">
                            {passwordError}
                        </div>
                    )}

                    <div className="flex justify-end space-x-3 mt-6">
                        <button
                            type="button"
                            onClick={() => setShowPasswordModal(false)}
                            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handlePasswordChange}
                            disabled={isChangingPassword}
                            className={`px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md flex items-center space-x-2 ${
                                isChangingPassword ? 'opacity-75 cursor-not-allowed' : ''
                            }`}
                        >
                            {isChangingPassword ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span>Changing...</span>
                                </>
                            ) : (
                                'Change Password'
                            )}
                        </button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );

    return (
        <AnimatePresence>
            {showPasswordModal && <PasswordChangeModal key="password-modal" />}
            <div className="fixed inset-0 z-[9999] overflow-y-auto" key="settings-modal">
                {/* Backdrop */}
                <motion.div
                    key="backdrop"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
                    onClick={onClose}
                />

                {/* Modal Content */}
                <div className="flex items-center justify-center min-h-screen p-4">
                    <motion.div
                        key="modal-content"
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.2 }}
                        className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400 z-10"
                        >
                            <XMarkIcon className="h-6 w-6" />
                        </button>

                        <div className="p-6">
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Settings & Preferences</h3>

                            {/* Settings Sections */}
                            <div className="space-y-6">
                                {/* Theme Settings */}
                                <div className="border-b dark:border-gray-700 pb-4">
                                    <h4 className="text-lg font-medium mb-4 flex items-center text-gray-900 dark:text-white">
                                        <SwatchIcon className="h-5 w-5 mr-2 text-primary-600" />
                                        Theme
                                    </h4>
                                    <div className="space-y-3">
                                        <label className="flex items-center">
                                            <input 
                                                type="radio" 
                                                name="theme" 
                                                checked={theme === 'light'}
                                                onChange={() => toggleTheme('light')}
                                                className="text-primary-600 focus:ring-primary-500" 
                                            />
                                            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Light Mode</span>
                                        </label>
                                        <label className="flex items-center">
                                            <input 
                                                type="radio" 
                                                name="theme" 
                                                checked={theme === 'dark'}
                                                onChange={() => toggleTheme('dark')}
                                                className="text-primary-600 focus:ring-primary-500" 
                                            />
                                            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Dark Mode</span>
                                        </label>
                                        <label className="flex items-center">
                                            <input 
                                                type="radio" 
                                                name="theme" 
                                                checked={theme === 'system'}
                                                onChange={() => toggleTheme('system')}
                                                className="text-primary-600 focus:ring-primary-500" 
                                            />
                                            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">System Default</span>
                                        </label>
                                    </div>
                                </div>

                                {/* Notification Settings */}
                                <div className="border-b dark:border-gray-700 pb-4">
                                    <h4 className="text-lg font-medium mb-4 flex items-center text-gray-900 dark:text-white">
                                        <BellIcon className="h-5 w-5 mr-2 text-primary-600" />
                                        Notifications
                                    </h4>
                                    <div className="space-y-3">
                                        <label className="flex items-center">
                                            <input type="checkbox" className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                                            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Script generation updates</span>
                                        </label>
                                        <label className="flex items-center">
                                            <input type="checkbox" className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                                            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">New features and updates</span>
                                        </label>
                                        <label className="flex items-center">
                                            <input type="checkbox" className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                                            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Weekly usage summary</span>
                                        </label>
                                    </div>
                                </div>

                                {/* Display Settings */}
                                <div className="border-b dark:border-gray-700 pb-4">
                                    <h4 className="text-lg font-medium mb-4 flex items-center text-gray-900 dark:text-white">
                                        <DevicePhoneMobileIcon className="h-5 w-5 mr-2 text-primary-600" />
                                        Display
                                    </h4>
                                    <div className="space-y-3">
                                        <label className="flex items-center">
                                            <input type="checkbox" className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                                            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Compact view</span>
                                        </label>
                                        <label className="flex items-center">
                                            <input type="checkbox" className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                                            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Show grid lines</span>
                                        </label>
                                        <label className="flex items-center">
                                            <input type="checkbox" className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                                            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Enable animations</span>
                                        </label>
                                    </div>
                                </div>

                                {/* Language Settings */}
                                <div className="border-b dark:border-gray-700 pb-4">
                                    <h4 className="text-lg font-medium mb-4 flex items-center text-gray-900 dark:text-white">
                                        <LanguageIcon className="h-5 w-5 mr-2 text-primary-600" />
                                        Language
                                    </h4>
                                    <select className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500">
                                        <option>English</option>
                                        <option>Spanish</option>
                                        <option>French</option>
                                        <option>German</option>
                                    </select>
                                </div>

                                {/* Currency Settings */}
                                <div className="border-b dark:border-gray-700 pb-4">
                                    <h4 className="text-lg font-medium mb-4 flex items-center text-gray-900 dark:text-white">
                                        <CurrencyDollarIcon className="h-5 w-5 mr-2 text-primary-600" />
                                        Currency
                                    </h4>
                                    <select className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500">
                                        <option>USD ($)</option>
                                        <option>EUR (€)</option>
                                        <option>GBP (£)</option>
                                        <option>JPY (¥)</option>
                                    </select>
                                </div>

                                {/* Accessibility Settings */}
                                <div className="border-b dark:border-gray-700 pb-4">
                                    <h4 className="text-lg font-medium mb-4 flex items-center text-gray-900 dark:text-white">
                                        <EyeIcon className="h-5 w-5 mr-2 text-primary-600" />
                                        Accessibility
                                    </h4>
                                    <div className="space-y-3">
                                        <label className="flex items-center">
                                            <input type="checkbox" className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                                            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">High contrast mode</span>
                                        </label>
                                        <label className="flex items-center">
                                            <input type="checkbox" className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                                            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Large text</span>
                                        </label>
                                        <label className="flex items-center">
                                            <input type="checkbox" className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                                            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Screen reader support</span>
                                        </label>
                                    </div>
                                </div>

                                {/* Security Settings */}
                                <div>
                                    <h4 className="text-lg font-medium mb-4 flex items-center text-gray-900 dark:text-white">
                                        <KeyIcon className="h-5 w-5 mr-2 text-primary-600" />
                                        Security
                                    </h4>
                                    <div className="space-y-3">
                                        <button 
                                            onClick={() => setShowPasswordModal(true)}
                                            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                                        >
                                            Change Password
                                        </button>
                                        <label className="flex items-center">
                                            <input type="checkbox" className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                                            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Enable two-factor authentication</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 flex justify-between items-center">
                            <button
                                type="button"
                                onClick={handleLogout}
                                className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                            >
                                <ArrowRightOnRectangleIcon className="h-5 w-5" />
                                <span>Logout</span>
                            </button>
                            <div className="flex space-x-3">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={handleSaveChanges}
                                    disabled={isSaving}
                                    className={`px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 flex items-center space-x-2 ${
                                        isSaving ? 'opacity-75 cursor-not-allowed' : ''
                                    }`}
                                >
                                    {isSaving ? (
                                        <>
                                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            <span>Saving...</span>
                                        </>
                                    ) : saveStatus === 'success' ? (
                                        <>
                                            <CheckCircleIcon className="h-5 w-5 text-green-500" />
                                            <span>Saved!</span>
                                        </>
                                    ) : saveStatus === 'error' ? (
                                        <>
                                            <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                                            <span>Error</span>
                                        </>
                                    ) : (
                                        <span>Save Changes</span>
                                    )}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </AnimatePresence>
    );
};

export default SettingsModal;