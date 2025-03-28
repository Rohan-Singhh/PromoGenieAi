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
    ArrowRightOnRectangleIcon,
    ClipboardDocumentIcon,
    ArrowPathIcon,
    XMarkIcon
} from '@heroicons/react/24/outline';
import authService from '../services/authService';
import { useNavigate } from 'react-router-dom';
import GenerationModal from './GenerationModal';
import ScriptDisplayModal from './ScriptDisplayModal';
import SettingsModal from './SettingsModal';
import { useTheme } from '../context/ThemeContext';

const Dashboard = () => {
    const { theme } = useTheme();
    const [activeSection, setActiveSection] = useState('overview');
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const settingsRef = useRef(null);
    const navigate = useNavigate();
    const [scriptFormData, setScriptFormData] = useState({
        productName: '',
        targetAudience: '',
        tone: 'Professional',
        adStyle: 'Short & Catchy',
        callToAction: ''
    });
    const [generatedScripts, setGeneratedScripts] = useState([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [scriptHistory, setScriptHistory] = useState([]);
    const [scriptsGenerated, setScriptsGenerated] = useState(0);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [abortController, setAbortController] = useState(null);
    const [showScriptModal, setShowScriptModal] = useState(false);
    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

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
        const fetchScriptHistory = async () => {
            try {
                const result = await authService.getScriptHistory();
                if (result.success) {
                    setScriptHistory(result.scripts);
                    setScriptsGenerated(result.scripts.length);
                }
            } catch (error) {
                console.error('Error fetching script history:', error);
            }
        };

        fetchScriptHistory();
    }, []);

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

    const handleGenerateScript = async () => {
        // Check if user has exceeded free limit
        if (scriptsGenerated >= 5 && activeSection !== 'subscription') {
            setActiveSection('subscription');
            return;
        }

        setIsGenerating(true);
        setError(null);
        setIsModalOpen(true);
        
        // Create new AbortController for this request
        const controller = new AbortController();
        setAbortController(controller);

        try {
            if (!scriptFormData.productName || !scriptFormData.targetAudience) {
                setError('Please fill in all required fields');
                setIsModalOpen(false);
                return;
            }

            const result = await authService.generateScript(scriptFormData, controller.signal);
            if (result.success) {
                // Add to history with timestamp and scripts
                const newHistoryItem = {
                    ...scriptFormData,
                    scripts: result.scripts,
                    date: new Date(),
                    id: Date.now()
                };
                setScriptHistory(prev => [newHistoryItem, ...prev]);
                setScriptsGenerated(prev => prev + 1);
                
                // Clear the form
                setScriptFormData({
                    productName: '',
                    targetAudience: '',
                    tone: 'Professional',
                    adStyle: 'Short & Catchy',
                    callToAction: ''
                });
                
                // Show the generated scripts
                setGeneratedScripts(result.scripts);
                // Close generation modal and show script display modal
                setIsModalOpen(false);
                setShowScriptModal(true);
            } else {
                setError(result.message || 'Failed to generate scripts');
            }
        } catch (error) {
            if (error.name === 'AbortError') {
                console.log('Request was cancelled');
                setError('Script generation was cancelled');
            } else {
            console.error('Error generating script:', error);
                setError(error.message || 'An error occurred while generating scripts');
            }
        } finally {
            setIsGenerating(false);
            setAbortController(null);
        }
    };

    // Add handleCancelGeneration function
    const handleCancelGeneration = () => {
        if (abortController) {
            abortController.abort();
        }
    };

    // Add subscription plans data
    const subscriptionPlans = [
        {
            name: 'Free',
            price: '$0',
            features: [
                '5 Scripts per month',
                'Basic ad styles',
                'Standard support',
            ],
            limit: 5,
            buttonText: 'Current Plan'
        },
        {
            name: 'Pro',
            price: '$9.99',
            features: [
                'Unlimited Scripts',
                'All ad styles',
                'Priority support',
                'Advanced analytics',
                'Custom templates'
            ],
            limit: Infinity,
            buttonText: 'Upgrade Now',
            recommended: true
        },
        {
            name: 'Business',
            price: '$24.99',
            features: [
                'Everything in Pro',
                'Team collaboration',
                'API access',
                'Custom branding',
                'Dedicated support'
            ],
            limit: Infinity,
            buttonText: 'Upgrade Now'
        }
    ];

    // Render different sections based on activeSection
    const renderSection = () => {
        switch (activeSection) {
            case 'overview':
                return (
                    <div className="space-y-8">
                        {/* Welcome Section */}
                        <div className="text-center">
                            <motion.h1 
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-4xl font-bold mb-2"
                            >
                                Welcome back, {user?.fullName}!
                            </motion.h1>
                            <motion.p 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-lg text-primary-600"
                            >
                                Let's craft the perfect ad script in seconds!
                            </motion.p>
                        </div>

                        {/* Analytics Section */}
                        <div className="p-6 rounded-xl bg-white shadow-lg">
                            <h2 className="text-2xl font-semibold mb-6">Your Analytics</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="text-lg font-medium mb-2">Scripts Generated</h3>
                                    <p className="text-3xl font-bold text-primary-600">{scriptsGenerated}</p>
                                </div>
                                <div>
                                    <h3 className="text-lg font-medium mb-2">Recent History</h3>
                                    <div className="space-y-2">
                                        {scriptHistory.slice(0, 3).map((history) => (
                                            <div 
                                                key={history._id || history.id} 
                                                className="text-sm cursor-pointer hover:text-primary-600 transition-colors duration-200"
                                                onClick={() => {
                                                    setGeneratedScripts(history.scripts);
                                                    setShowScriptModal(true);
                                                }}
                                            >
                                                {new Date(history.createdAt || history.date).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}: {history.productName}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 'generation':
                return (
                    <div className="space-y-8">
                        {/* History Button */}
                        <div className="flex justify-end">
                            <button
                                onClick={() => setActiveSection('history')}
                                className="flex items-center space-x-2 px-4 py-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 text-primary-600 hover:text-primary-700"
                            >
                                <DocumentTextIcon className="w-5 h-5" />
                                <span>View History</span>
                            </button>
                        </div>

                        {/* Script Generator Form */}
                        <div className="p-8 rounded-xl bg-white shadow-lg max-w-4xl mx-auto">
                            <h2 className="text-2xl font-semibold mb-8 text-center">Generate Your Ad Script</h2>
                            {error && (
                                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
                                    {error}
                                </div>
                            )}
                            <div className="space-y-6">
                                {/* Basic Info Section */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className={`block text-sm font-medium`}>
                                            Product Name
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Enter product name"
                                            value={scriptFormData.productName}
                                            onChange={(e) => setScriptFormData(prev => ({
                                                ...prev,
                                                productName: e.target.value
                                            }))}
                                            className="input-field w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className={`block text-sm font-medium`}>
                                            Target Audience
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Who is this ad for?"
                                            value={scriptFormData.targetAudience}
                                            onChange={(e) => setScriptFormData(prev => ({
                                                ...prev,
                                                targetAudience: e.target.value
                                            }))}
                                            className="input-field w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>

                                {/* Style Section */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className={`block text-sm font-medium`}>
                                            Tone
                                        </label>
                                        <select
                                            value={scriptFormData.tone}
                                            onChange={(e) => setScriptFormData(prev => ({
                                                ...prev,
                                                tone: e.target.value
                                            }))}
                                            className="input-field w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                        >
                                            <option value="Professional">Professional</option>
                                            <option value="Playful">Playful</option>
                                            <option value="Persuasive">Persuasive</option>
                                            <option value="Exciting">Exciting</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className={`block text-sm font-medium`}>
                                            Ad Style
                                        </label>
                                        <select
                                            value={scriptFormData.adStyle}
                                            onChange={(e) => setScriptFormData(prev => ({
                                                ...prev,
                                                adStyle: e.target.value
                                            }))}
                                            className="input-field w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                        >
                                            <option value="Short & Catchy">Short & Catchy</option>
                                            <option value="Storytelling">Storytelling</option>
                                            <option value="Problem-Solution">Problem-Solution</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Call to Action Section */}
                                <div>
                                    <div className="space-y-2">
                                        <label className={`block text-sm font-medium`}>
                                            Call to Action
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="e.g., 'Shop Now', 'Sign Up Today'"
                                            value={scriptFormData.callToAction}
                                            onChange={(e) => setScriptFormData(prev => ({
                                                ...prev,
                                                callToAction: e.target.value
                                            }))}
                                            className="input-field w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>

                                {/* Generate Button */}
                                <div className="pt-6">
                                    <button
                                        onClick={handleGenerateScript}
                                        disabled={isGenerating}
                                        className="w-full py-3 px-6 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-primary-500/25"
                                    >
                                        {isGenerating ? (
                                            <>
                                                <ArrowPathIcon className="w-5 h-5 animate-spin" />
                                                <span>Generating...</span>
                                            </>
                                        ) : (
                                            <>
                                                <DocumentTextIcon className="w-5 h-5" />
                                                <span>Generate Script</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Add the GenerationModal */}
                        <GenerationModal
                            isOpen={isModalOpen}
                            onClose={() => setIsModalOpen(false)}
                            isGenerating={isGenerating}
                            onCancel={handleCancelGeneration}
                        >
                            {error ? (
                                <div className="text-red-600 text-center">
                                    {error}
                                </div>
                            ) : (
                                <div className="text-center">
                                    <div className="text-green-600 font-medium mb-2">
                                        Scripts Generated Successfully!
                                    </div>
                                    <p className="text-gray-600">
                                        Your ad scripts are ready to be displayed.
                                    </p>
                                </div>
                            )}
                        </GenerationModal>

                        {/* Add the ScriptDisplayModal */}
                        <ScriptDisplayModal
                            isOpen={showScriptModal}
                            onClose={() => setShowScriptModal(false)}
                            scripts={generatedScripts}
                        />
                    </div>
                );

            case 'history':
                return (
                    <div className="space-y-8">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-semibold">Your Script History</h2>
                            <button
                                onClick={() => setActiveSection('generation')}
                                className="flex items-center space-x-2 px-4 py-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 text-primary-600 hover:text-primary-700"
                            >
                                <DocumentTextIcon className="w-5 h-5" />
                                <span>Back to Generation</span>
                            </button>
                        </div>

                        {scriptHistory.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-gray-600">No scripts generated yet. Start by creating your first ad script!</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-6">
                                {scriptHistory.map((history) => (
                                    <motion.div
                                        key={history._id || history.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="p-6 rounded-xl bg-white shadow-lg cursor-pointer hover:shadow-xl transition-all duration-200"
                                        onClick={() => {
                                            setGeneratedScripts(history.scripts);
                                            setShowScriptModal(true);
                                        }}
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="text-lg font-medium text-primary-600">{history.productName}</h3>
                                                <p className="text-sm text-gray-500">
                                                    Target: {history.targetAudience} | Tone: {history.tone} | Style: {history.adStyle}
                                                </p>
                                            </div>
                                            <span className="text-sm text-gray-500">
                                                {new Date(history.createdAt || history.date).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}
                                            </span>
                                        </div>
                                        
                                        <div className="flex items-center justify-between">
                                            <div className="text-sm text-gray-600">
                                                {history.scripts.length} scripts generated
                                            </div>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    navigator.clipboard.writeText(history.scripts.join('\n\n'));
                                                }}
                                                className="text-primary-600 hover:text-primary-700 flex items-center space-x-1"
                                            >
                                                <ClipboardDocumentIcon className="w-5 h-5" />
                                                <span>Copy All</span>
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}

                        {/* Add the ScriptDisplayModal */}
                        <ScriptDisplayModal
                            isOpen={showScriptModal}
                            onClose={() => setShowScriptModal(false)}
                            scripts={generatedScripts}
                        />
                    </div>
                );

            case 'subscription':
                return (
                    <div className="space-y-8">
                        <div className="text-center">
                            <h2 className="text-3xl font-bold mb-4">Choose Your Plan</h2>
                            <p className="text-gray-600 max-w-2xl mx-auto">
                                {scriptsGenerated >= 5 
                                    ? "You've reached the limit of your free plan. Upgrade to continue generating amazing scripts!"
                                    : "Upgrade to unlock unlimited script generation and premium features."}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
                            {subscriptionPlans.map((plan) => (
                                <motion.div
                                    key={plan.name}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`relative rounded-2xl bg-white p-8 shadow-lg ${
                                        plan.recommended ? 'ring-2 ring-primary-500' : ''
                                    }`}
                                >
                                    {plan.recommended && (
                                        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                            <span className="bg-primary-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                                                Recommended
                                            </span>
                                        </div>
                                    )}

                                    <div className="text-center">
                                        <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                                        <div className="text-4xl font-bold mb-6">{plan.price}<span className="text-sm text-gray-500">/month</span></div>
                                        
                                        <ul className="text-left space-y-4 mb-8">
                                            {plan.features.map((feature, index) => (
                                                <li key={index} className="flex items-center text-gray-600">
                                                    <svg className="w-5 h-5 text-primary-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                    </svg>
                                                    {feature}
                                                </li>
                                            ))}
                                        </ul>

                                        <button
                                            onClick={() => {
                                                if (plan.name !== 'Free') {
                                                    // Add your payment/upgrade logic here
                                                    console.log(`Upgrading to ${plan.name} plan`);
                                                }
                                            }}
                                            className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-200 ${
                                                plan.name === 'Free'
                                                    ? 'bg-gray-100 text-gray-600 cursor-default'
                                                    : 'bg-primary-500 text-white hover:bg-primary-600 shadow-lg hover:shadow-primary-500/25'
                                            }`}
                                        >
                                            {plan.buttonText}
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <div className="text-center mt-8 text-gray-600">
                            <p>All plans include a 14-day money-back guarantee</p>
                        </div>
                    </div>
                );

            case 'support':
                return (
                    <div className="space-y-8">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold mb-4">Support Center</h2>
                            <p className="text-gray-600 max-w-2xl mx-auto">
                                Need help? We're here to assist you with any questions or issues you may have.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* FAQ Section */}
                            <div className="p-6 rounded-xl bg-white shadow-lg">
                                <h3 className="text-xl font-semibold mb-4">Frequently Asked Questions</h3>
                                <div className="space-y-4">
                                    <div className="border-b pb-4">
                                        <h4 className="font-medium mb-2">How do I generate my first script?</h4>
                                        <p className="text-gray-600 text-sm">Go to the "Ad Generation" section, fill in your product details, and click "Generate Script".</p>
                                    </div>
                                    <div className="border-b pb-4">
                                        <h4 className="font-medium mb-2">What's the difference between plans?</h4>
                                        <p className="text-gray-600 text-sm">Free plan allows 5 scripts per month, while Pro and Business plans offer unlimited scripts and additional features.</p>
                                    </div>
                                    <div className="border-b pb-4">
                                        <h4 className="font-medium mb-2">How do I upgrade my plan?</h4>
                                        <p className="text-gray-600 text-sm">Visit the "Subscription" section to view and select your preferred plan.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Support Section */}
                            <div className="p-6 rounded-xl bg-white shadow-lg">
                                <h3 className="text-xl font-semibold mb-4">Contact Support</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Email</label>
                                        <input
                                            type="email"
                                            className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                            placeholder="your@email.com"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Message</label>
                                        <textarea
                                            className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                            rows="4"
                                            placeholder="How can we help you?"
                                        ></textarea>
                                    </div>
                                    <button className="w-full py-2 px-4 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors">
                                        Send Message
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 'analytics':
                return (
                    <div className="space-y-8">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold mb-4">Analytics Dashboard</h2>
                            <p className="text-gray-600 max-w-2xl mx-auto">
                                Track your script generation performance and usage statistics.
                            </p>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="p-6 rounded-xl bg-white shadow-lg">
                                <h3 className="text-lg font-medium mb-2">Total Scripts</h3>
                                <p className="text-3xl font-bold text-primary-600">{scriptsGenerated}</p>
                            </div>
                            <div className="p-6 rounded-xl bg-white shadow-lg">
                                <h3 className="text-lg font-medium mb-2">This Month</h3>
                                <p className="text-3xl font-bold text-primary-600">
                                    {scriptHistory.filter(script => {
                                        const scriptDate = new Date(script.createdAt || script.date);
                                        const now = new Date();
                                        return scriptDate.getMonth() === now.getMonth() &&
                                               scriptDate.getFullYear() === now.getFullYear();
                                    }).length}
                                </p>
                            </div>
                            <div className="p-6 rounded-xl bg-white shadow-lg">
                                <h3 className="text-lg font-medium mb-2">Remaining Free</h3>
                                <p className="text-3xl font-bold text-primary-600">{Math.max(0, 5 - scriptsGenerated)}</p>
                            </div>
                        </div>

                        {/* Usage Chart */}
                        <div className="p-6 rounded-xl bg-white shadow-lg">
                            <h3 className="text-xl font-semibold mb-4">Monthly Usage</h3>
                            <div className="h-64 flex items-center justify-center text-gray-500">
                                Usage chart coming soon...
                            </div>
                        </div>

                        {/* Popular Styles */}
                        <div className="p-6 rounded-xl bg-white shadow-lg">
                            <h3 className="text-xl font-semibold mb-4">Popular Ad Styles</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="p-4 border rounded-lg">
                                    <h4 className="font-medium mb-2">Short & Catchy</h4>
                                    <p className="text-2xl font-bold text-primary-600">
                                        {scriptHistory.filter(script => script.adStyle === 'Short & Catchy').length}
                                    </p>
                                </div>
                                <div className="p-4 border rounded-lg">
                                    <h4 className="font-medium mb-2">Storytelling</h4>
                                    <p className="text-2xl font-bold text-primary-600">
                                        {scriptHistory.filter(script => script.adStyle === 'Storytelling').length}
                                    </p>
                                </div>
                                <div className="p-4 border rounded-lg">
                                    <h4 className="font-medium mb-2">Problem-Solution</h4>
                                    <p className="text-2xl font-bold text-primary-600">
                                        {scriptHistory.filter(script => script.adStyle === 'Problem-Solution').length}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 'studio':
                return (
                    <div className="space-y-8">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold mb-4">Video Studio</h2>
                            <p className="text-gray-600 max-w-2xl mx-auto">
                                Transform your scripts into engaging video content.
                            </p>
                        </div>

                        {/* Video Creation Form */}
                        <div className="p-6 rounded-xl bg-white shadow-lg max-w-4xl mx-auto">
                            <h3 className="text-xl font-semibold mb-6">Create New Video</h3>
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Select Script</label>
                                    <select className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                                        <option value="">Choose a script...</option>
                                        {scriptHistory.map((history) => (
                                            <option key={history._id || history.id} value={history._id || history.id}>
                                                {history.productName} - {new Date(history.createdAt || history.date).toLocaleDateString()}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Video Style</label>
                                    <select className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                                        <option value="modern">Modern & Clean</option>
                                        <option value="dynamic">Dynamic & Energetic</option>
                                        <option value="minimal">Minimal & Elegant</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Background Music</label>
                                    <select className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                                        <option value="upbeat">Upbeat & Energetic</option>
                                        <option value="calm">Calm & Professional</option>
                                        <option value="none">No Music</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Voice Over</label>
                                    <select className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                                        <option value="male">Male Voice</option>
                                        <option value="female">Female Voice</option>
                                        <option value="none">No Voice Over</option>
                                    </select>
                                </div>

                                <button className="w-full py-3 px-6 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors flex items-center justify-center space-x-2">
                                    <VideoCameraIcon className="w-5 h-5" />
                                    <span>Generate Video</span>
                                </button>
                            </div>
                        </div>

                        {/* Recent Videos */}
                        <div className="p-6 rounded-xl bg-white shadow-lg">
                            <h3 className="text-xl font-semibold mb-4">Recent Videos</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="border rounded-lg p-4">
                                    <div className="aspect-video bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                                        <VideoCameraIcon className="w-12 h-12 text-gray-400" />
                                    </div>
                                    <h4 className="font-medium mb-2">No videos yet</h4>
                                    <p className="text-sm text-gray-600">Create your first video to see it here.</p>
                                </div>
                                <div className="border rounded-lg p-4">
                                    <div className="aspect-video bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                                        <VideoCameraIcon className="w-12 h-12 text-gray-400" />
                                    </div>
                                    <h4 className="font-medium mb-2">No videos yet</h4>
                                    <p className="text-sm text-gray-600">Create your first video to see it here.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            default:
                return (
                    <div className="text-center py-12">
                        <h2 className="text-2xl font-semibold mb-4">Coming Soon</h2>
                        <p className="text-gray-600">This feature is under development.</p>
                    </div>
                );
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
            {/* Background with animation */}
            <div className={`fixed inset-0 ${theme === 'dark' ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-primary-50 via-white to-primary-100'}`}>
                <div className="absolute inset-0 overflow-hidden">
                    <motion.div
                        className={`absolute -top-4 -right-4 w-72 h-72 rounded-full mix-blend-multiply filter blur-xl opacity-70 ${theme === 'dark' ? 'bg-gray-800' : 'bg-primary-200'}`}
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
                        className={`absolute -bottom-8 -left-8 w-96 h-96 rounded-full mix-blend-multiply filter blur-xl opacity-70 ${theme === 'dark' ? 'bg-gray-700' : 'bg-primary-300'}`}
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
                    className={`w-64 border-r ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white/80 border-gray-200'}`}
                >
                    <div className="p-6">
                        <div className="flex items-center space-x-3">
                            <UserIcon className={`w-8 h-8 text-primary-600`} />
                            <div>
                                <h2 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : ''}`}>{user?.fullName || 'User'}</h2>
                                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : ''}`}>Free Plan</p>
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
                                        ? theme === 'dark' 
                                            ? 'text-primary-400 bg-gray-700' 
                                            : 'text-primary-600 bg-primary-50'
                                        : theme === 'dark'
                                            ? 'text-gray-400 hover:text-primary-400 hover:bg-gray-700/50'
                                            : 'text-gray-600 hover:text-primary-600 hover:bg-primary-50/50'
                                }`}
                            >
                                <item.icon className="w-5 h-5 mr-3" />
                                {item.name}
                            </button>
                        ))}
                    </nav>
                </motion.div>

                {/* Main Content */}
                <div className="flex-1 p-8">
                    <div className="max-w-7xl mx-auto">
                        {/* Header */}
                        <div className="flex justify-between items-center mb-8">
                            <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : ''}`}>
                                {navigation.find(n => n.id === activeSection)?.name}
                            </h1>
                            <div className="relative" ref={settingsRef}>
                                <button 
                                    onClick={() => setIsSettingsModalOpen(true)}
                                    className={`p-2 transition-colors ${theme === 'dark' ? 'text-gray-400 hover:text-primary-400' : 'text-gray-600 hover:text-primary-600'}`}
                                >
                                    <Cog6ToothIcon className="w-6 h-6" />
                                </button>
                            </div>
                        </div>

                        {/* Content Area */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeSection}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="space-y-8"
                            >
                                {renderSection()}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <ScriptDisplayModal
                isOpen={showScriptModal}
                onClose={() => setShowScriptModal(false)}
                scripts={generatedScripts}
            />

            <SettingsModal
                isOpen={isSettingsModalOpen}
                onClose={() => setIsSettingsModalOpen(false)}
            />
        </div>
    );
};

export default Dashboard; 