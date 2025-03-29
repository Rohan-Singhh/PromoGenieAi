import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, ArrowPathIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const GenerationModal = ({ isOpen, onClose, isGenerating, onCancel, children }) => {
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);

    const handleClose = () => {
        if (isGenerating) {
            setShowConfirmDialog(true);
        } else {
            onClose();
        }
    };

    const handleConfirmCancel = () => {
        setShowConfirmDialog(false);
        onCancel();
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
                        onClick={handleClose}
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    >
                        <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden">
                            {/* Glow Effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-primary-600/10" />
                            
                            {/* Close Button */}
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleClose}
                                className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white shadow-lg transition-colors"
                            >
                                <XMarkIcon className="w-5 h-5 text-gray-600" />
                            </motion.button>

                            {/* Content */}
                            <div className="relative p-6">
                                {/* Header */}
                                <div className="text-center mb-6">
                                    <motion.h2
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-2xl font-bold text-gray-900"
                                    >
                                        Generating Your Scripts
                                    </motion.h2>
                                    <motion.p
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.1 }}
                                        className="text-gray-600 mt-2"
                                    >
                                        Please wait while we craft your perfect ad scripts...
                                    </motion.p>
                                </div>

                                {/* Loading Animation */}
                                <div className="flex justify-center mb-6">
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                        className="w-16 h-16 rounded-full border-4 border-primary-500 border-t-transparent"
                                    />
                                </div>

                                {/* Progress Message */}
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                    className="text-center text-gray-600"
                                >
                                    {isGenerating ? (
                                        <div className="flex items-center justify-center space-x-2">
                                            <ArrowPathIcon className="w-5 h-5 animate-spin text-primary-500" />
                                            <span>Processing your request...</span>
                                        </div>
                                    ) : (
                                        children
                                    )}
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default GenerationModal; 