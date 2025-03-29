import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, ClipboardDocumentIcon } from '@heroicons/react/24/outline';

const ScriptDisplayModal = ({ isOpen, onClose, scripts }) => {
    const modalRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    // Format script text
    const formatScript = (script) => {
        let formattedScript = script.replace(/^\d+[\.:]\s*/, '');
        formattedScript = formattedScript.charAt(0).toUpperCase() + formattedScript.slice(1);
        formattedScript = formattedScript.replace(/^"(.*)"$/, '$1');
        formattedScript = formattedScript.replace(/--+$/, '');
        formattedScript = formattedScript.replace(/^\*\*[^*]+\*\*\s*/, '');
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
                                        <div className="text-center mb-6">
                                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Generated Scripts</h2>
                                            <p className="text-gray-600">Here are your AI-generated advertising scripts</p>
                                        </div>

                                        {/* Scripts List */}
                                        <div className="space-y-4">
                                            {scripts.map((script, index) => (
                                                <motion.div
                                                    key={index}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: index * 0.1 }}
                                                    className="p-6 bg-gray-50 rounded-lg border border-gray-200 hover:border-primary-500 hover:shadow-md transition-all cursor-pointer group relative"
                                                >
                                                    <div className="prose prose-sm max-w-none">
                                                        <p className="whitespace-pre-wrap text-gray-700">
                                                            {formatScript(script)}
                                                        </p>
                                                    </div>
                                                    
                                                    {/* Copy Button */}
                                                    <motion.button
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => navigator.clipboard.writeText(formatScript(script))}
                                                        className="absolute top-4 right-4 p-2 text-primary-600 hover:text-primary-700 bg-white rounded-lg hover:bg-primary-50 transition-colors shadow-sm opacity-0 group-hover:opacity-100"
                                                    >
                                                        <ClipboardDocumentIcon className="w-5 h-5" />
                                                    </motion.button>
                                                </motion.div>
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