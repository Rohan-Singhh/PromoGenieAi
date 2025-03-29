import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, ClipboardDocumentIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const ScriptDisplayModal = ({ isOpen, onClose, scripts }) => {
    const [currentScriptIndex, setCurrentScriptIndex] = useState(0);
    const modalRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            // Prevent body scroll when modal is open
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            // Restore body scroll when modal is closed
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    const handleNext = () => {
        setCurrentScriptIndex((prev) => (prev + 1) % scripts.length);
    };

    const handlePrevious = () => {
        setCurrentScriptIndex((prev) => (prev - 1 + scripts.length) % scripts.length);
    };

    // Format script text
    const formatScript = (script) => {
        // Remove any existing numbering
        let formattedScript = script.replace(/^\d+[\.:]\s*/, '');
        // Ensure first letter is capitalized
        formattedScript = formattedScript.charAt(0).toUpperCase() + formattedScript.slice(1);
        // Remove double quotes at start and end
        formattedScript = formattedScript.replace(/^"(.*)"$/, '$1');
        // Remove double hyphens at the end
        formattedScript = formattedScript.replace(/--+$/, '');
        // Remove any category labels if present
        formattedScript = formattedScript.replace(/^\*\*[^*]+\*\*\s*/, '');
        // Clean up any extra whitespace
        formattedScript = formattedScript.trim();
        return formattedScript;
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
                    />

                    {/* Modal Container */}
                    <div className="fixed inset-0 z-50 overflow-y-auto">
                        <div className="min-h-screen px-4 text-center">
                            {/* This element is to trick the browser into centering the modal contents. */}
                            <span
                                className="inline-block h-screen align-middle"
                                aria-hidden="true"
                            >
                                &#8203;
                            </span>

                            {/* Modal */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                transition={{ duration: 0.3, ease: "easeOut" }}
                                className="inline-block w-full align-middle"
                            >
                                <div 
                                    ref={modalRef} 
                                    className="relative w-full max-w-3xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden"
                                    style={{ maxHeight: '90vh' }}
                                >
                                    {/* Glow Effect */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-primary-600/10" />
                                    
                                    {/* Close Button */}
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={onClose}
                                        className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white shadow-lg transition-colors z-10"
                                    >
                                        <XMarkIcon className="w-5 h-5 text-gray-600" />
                                    </motion.button>

                                    {/* Content */}
                                    <div className="relative p-4 sm:p-6 md:p-8 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 2rem)' }}>
                                        {/* Header */}
                                        <div className="text-center mb-4 sm:mb-6">
                                            <motion.div
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="inline-block px-4 py-2 bg-primary-100 text-primary-600 rounded-full font-medium"
                                            >
                                                {currentScriptIndex + 1}
                                            </motion.div>
                                        </div>

                                        {/* Script Content */}
                                        <div className="relative">
                                            <AnimatePresence mode="wait">
                                                <motion.div
                                                    key={currentScriptIndex}
                                                    initial={{ opacity: 0, x: 20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    exit={{ opacity: 0, x: -20 }}
                                                    className="bg-gray-50 rounded-xl p-4 sm:p-6 shadow-inner"
                                                >
                                                    <div className="prose prose-sm sm:prose-base lg:prose-lg max-w-none">
                                                        <p className="whitespace-pre-wrap text-gray-700">
                                                            {formatScript(scripts[currentScriptIndex])}
                                                        </p>
                                                    </div>
                                                    
                                                    {/* Copy Button */}
                                                    <motion.button
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => navigator.clipboard.writeText(formatScript(scripts[currentScriptIndex]))}
                                                        className="absolute top-4 right-4 p-2 text-primary-600 hover:text-primary-700 bg-white rounded-lg hover:bg-primary-50 transition-colors shadow-sm"
                                                    >
                                                        <ClipboardDocumentIcon className="w-5 h-5" />
                                                    </motion.button>
                                                </motion.div>
                                            </AnimatePresence>

                                            {/* Navigation Buttons */}
                                            <div className="flex justify-between items-center mt-4 sm:mt-6">
                                                <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={handlePrevious}
                                                    className="p-2 rounded-full bg-white shadow-lg hover:bg-primary-50 text-primary-600"
                                                >
                                                    <ChevronLeftIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                                                </motion.button>

                                                <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={handleNext}
                                                    className="p-2 rounded-full bg-white shadow-lg hover:bg-primary-50 text-primary-600"
                                                >
                                                    <ChevronRightIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                                                </motion.button>
                                            </div>
                                        </div>

                                        {/* Script Indicators */}
                                        <div className="flex justify-center space-x-1 sm:space-x-2 mt-4 sm:mt-6">
                                            {scripts.map((_, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => setCurrentScriptIndex(index)}
                                                    className={`w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
                                                        index === currentScriptIndex
                                                            ? 'bg-primary-600 w-3 sm:w-4'
                                                            : 'bg-gray-300 hover:bg-gray-400'
                                                    }`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
};

export default ScriptDisplayModal; 