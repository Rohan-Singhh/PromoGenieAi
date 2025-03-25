import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    HomeIcon,
    DocumentTextIcon,
    VideoCameraIcon,
    ChartBarIcon,
    CreditCardIcon,
    QuestionMarkCircleIcon,
    UserIcon,
    Cog6ToothIcon,
    SunIcon,
    MoonIcon,
    ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';
import authService from '../services/authService';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedMode = localStorage.getItem('darkMode');
        return savedMode ? JSON.parse(savedMode) : false;
    });
    const [activeSection, setActiveSection] = useState('overview');
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const settingsRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/login');
                    return;
                }

                const userData = await authService.getCurrentUser();
                setUser(userData);
            } catch (error) {
                console.error('Error fetching user data:', error);
                navigate('/login');
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [navigate]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (settingsRef.current && !settingsRef.current.contains(event.target)) {
                setIsSettingsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDarkMode]);

    const toggleDarkMode = () => {
        setIsDarkMode(prev => !prev);
    };

    const handleLogout = async () => {
        try {
            authService.logout();
            navigate('/');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const navigation = [
        { name: 'Overview', icon: HomeIcon, id: 'overview' },
        { name: 'Ad Generation', icon: DocumentTextIcon, id: 'generation' },
        { name: 'Video Studio', icon: VideoCameraIcon, id: 'studio' },
        { name: 'Analytics', icon: ChartBarIcon, id: 'analytics' },
        { name: 'Subscription', icon: CreditCardIcon, id: 'subscription' },
        { name: 'Support', icon: QuestionMarkCircleIcon, id: 'support' },
    ];

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen ${isDarkMode ? 'dark bg-gray-900' : 'bg-white'}`}>
            {/* Background with animation */}
            <div className={`fixed inset-0 ${
                isDarkMode 
                    ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
                    : 'bg-gradient-to-br from-primary-50 via-white to-primary-100'
            }`}>
                <div className="absolute inset-0 overflow-hidden">
                    <motion.div
                        className={`absolute -top-4 -right-4 w-72 h-72 rounded-full mix-blend-multiply filter blur-xl opacity-70 ${
                            isDarkMode ? 'bg-primary-800' : 'bg-primary-200'
                        }`}
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
                        className={`absolute -bottom-8 -left-8 w-96 h-96 rounded-full mix-blend-multiply filter blur-xl opacity-70 ${
                            isDarkMode ? 'bg-primary-900' : 'bg-primary-300'
                        }`}
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
            </div>

            {/* Main Layout */}
            <div className="relative flex min-h-screen">
                {/* Sidebar */}
                <motion.div
                    initial={{ x: -300 }}
                    animate={{ x: 0 }}
                    className={`w-64 border-r ${
                        isDarkMode 
                            ? 'bg-gray-800/80 border-gray-700' 
                            : 'bg-white/80 border-gray-200'
                    }`}
                >
                    <div className="p-6">
                        <div className="flex items-center space-x-3">
                            <UserIcon className={`w-8 h-8 ${
                                isDarkMode ? 'text-primary-400' : 'text-primary-600'
                            }`} />
                            <div>
                                <h2 className={`text-lg font-semibold ${
                                    isDarkMode ? 'text-white' : 'text-gray-900'
                                }`}>{user?.fullName || 'User'}</h2>
                                <p className={`text-sm ${
                                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                                }`}>Pro Plan</p>
                            </div>
                        </div>
                    </div>

                    <nav className="mt-6">
                        {navigation.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setActiveSection(item.id)}
                                className={`w-full flex items-center px-6 py-3 text-sm font-medium transition-colors ${
                                    activeSection === item.id
                                        ? isDarkMode 
                                            ? 'text-primary-400 bg-gray-700'
                                            : 'text-primary-600 bg-primary-50'
                                        : isDarkMode
                                            ? 'text-gray-400 hover:text-primary-400 hover:bg-gray-700/50'
                                            : 'text-gray-600 hover:text-primary-600 hover:bg-primary-50/50'
                                }`}
                            >
                                <item.icon className="w-5 h-5 mr-3" />
                                {item.name}
                            </button>
                        ))}
                    </nav>

                    <div className={`absolute bottom-0 w-full p-4 border-t ${
                        isDarkMode ? 'border-gray-700' : 'border-gray-200'
                    }`}>
                        <button
                            onClick={toggleDarkMode}
                            className={`flex items-center justify-center w-full px-4 py-2 text-sm font-medium ${
                                isDarkMode 
                                    ? 'text-gray-400 hover:text-primary-400' 
                                    : 'text-gray-600 hover:text-primary-600'
                            }`}
                        >
                            {isDarkMode ? (
                                <>
                                    <SunIcon className="w-5 h-5 mr-2" />
                                    Light Mode
                                </>
                            ) : (
                                <>
                                    <MoonIcon className="w-5 h-5 mr-2" />
                                    Dark Mode
                                </>
                            )}
                        </button>
                    </div>
                </motion.div>

                {/* Main Content */}
                <div className="flex-1 p-8">
                    <div className="max-w-7xl mx-auto">
                        {/* Header */}
                        <div className="flex justify-between items-center mb-8">
                            <h1 className={`text-2xl font-bold ${
                                isDarkMode 
                                    ? 'text-white' 
                                    : 'text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-800'
                            }`}>
                                {navigation.find(n => n.id === activeSection)?.name}
                            </h1>
                            <div className="relative" ref={settingsRef}>
                                <button 
                                    onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                                    className={`p-2 transition-colors ${
                                        isDarkMode 
                                            ? 'text-gray-400 hover:text-primary-400' 
                                            : 'text-gray-600 hover:text-primary-600'
                                    }`}
                                >
                                    <Cog6ToothIcon className="w-6 h-6" />
                                </button>
                                
                                {isSettingsOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg py-1 z-50 ${
                                            isDarkMode 
                                                ? 'bg-gray-800 border border-gray-700' 
                                                : 'bg-white border border-gray-100'
                                        }`}
                                    >
                                        <div className={`px-4 py-2 text-sm font-medium border-b ${
                                            isDarkMode 
                                                ? 'text-white border-gray-700' 
                                                : 'text-gray-900 border-gray-100'
                                        }`}>
                                            {user?.fullName || 'User'}
                                        </div>
                                        <button
                                            onClick={() => {
                                                setIsSettingsOpen(false);
                                                navigate('/settings');
                                            }}
                                            className={`w-full px-4 py-2 text-left text-sm flex items-center ${
                                                isDarkMode 
                                                    ? 'text-gray-300 hover:bg-gray-700' 
                                                    : 'text-gray-700 hover:bg-gray-50'
                                            }`}
                                        >
                                            <Cog6ToothIcon className={`w-5 h-5 mr-3 ${
                                                isDarkMode ? 'text-gray-500' : 'text-gray-400'
                                            }`} />
                                            Settings & Privacy
                                        </button>
                                        <button
                                            onClick={() => {
                                                setIsSettingsOpen(false);
                                                handleLogout();
                                            }}
                                            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-50 flex items-center"
                                        >
                                            <ArrowRightOnRectangleIcon className="w-5 h-5 mr-3 text-red-400" />
                                            Logout
                                        </button>
                                    </motion.div>
                                )}
                            </div>
                        </div>

                        {/* Content Area */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeSection}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                            >
                                {/* Overview Cards */}
                                {activeSection === 'overview' && (
                                    <>
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="bg-white p-6 rounded-xl shadow-lg border border-gray-100"
                                        >
                                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Script Quota</h3>
                                            <div className="flex items-center justify-between">
                                                <div className="text-3xl font-bold text-primary-600">45/50</div>
                                                <div className="w-24 h-2 bg-gray-100 rounded-full">
                                                    <div className="w-3/4 h-full bg-gradient-to-r from-primary-400 to-primary-600 rounded-full"></div>
                                                </div>
                                            </div>
                                        </motion.div>

                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: 0.1 }}
                                            className="bg-white p-6 rounded-xl shadow-lg border border-gray-100"
                                        >
                                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Video Quota</h3>
                                            <div className="flex items-center justify-between">
                                                <div className="text-3xl font-bold text-primary-600">28/30</div>
                                                <div className="w-24 h-2 bg-gray-100 rounded-full">
                                                    <div className="w-5/6 h-full bg-gradient-to-r from-primary-400 to-primary-600 rounded-full"></div>
                                                </div>
                                            </div>
                                        </motion.div>

                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: 0.2 }}
                                            className="bg-white p-6 rounded-xl shadow-lg border border-gray-100"
                                        >
                                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Subscription</h3>
                                            <div className="flex items-center justify-between">
                                                <div className="text-3xl font-bold text-primary-600">Pro</div>
                                                <button className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg hover:from-primary-600 hover:to-primary-700 transition-all duration-200 hover:shadow-lg hover:shadow-primary-500/20">
                                                    Upgrade
                                                </button>
                                            </div>
                                        </motion.div>
                                    </>
                                )}

                                {/* Ad Generation Section */}
                                {activeSection === 'generation' && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="col-span-full bg-white p-6 rounded-xl shadow-lg border border-gray-100"
                                    >
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Ad</h3>
                                        <div className="space-y-4">
                                            <input
                                                type="text"
                                                placeholder="Enter your product idea..."
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 placeholder-gray-400"
                                            />
                                            <button className="w-full px-4 py-3 text-white bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg hover:from-primary-600 hover:to-primary-700 transition-all duration-200 hover:shadow-lg hover:shadow-primary-500/20 flex items-center justify-center">
                                                <DocumentTextIcon className="w-5 h-5 mr-2" />
                                                Generate Script
                                            </button>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Add more sections as needed */}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard; 