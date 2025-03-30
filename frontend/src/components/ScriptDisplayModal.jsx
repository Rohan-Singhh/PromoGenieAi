import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, ClipboardDocumentIcon, CheckIcon } from '@heroicons/react/24/outline';

const ScriptDisplayModal = ({ isOpen, onClose, scripts }) => {
    const modalRef = useRef(null);
    const [copiedIndex, setCopiedIndex] = useState(null);

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
        // Remove all variations of "Script X:" from the content
        let formattedScript = script
            .replace(/^Script \d+:?\s*/gim, '')  // Remove "Script X:" at start
            .replace(/\n\s*Script \d+:?\s*/gim, '')  // Remove "Script X:" after newlines
            .replace(/["""]/g, '')  // Remove all types of quotation marks
            .replace(/\*/g, '')  // Remove all asterisks
            .replace(/--+$/, '')  // Remove trailing dashes
            .replace(/###/g, '')  // Remove hash symbols
            .trim();

        // Split into sections and preserve proper spacing
        const sections = formattedScript.split(/\n(?=(?:Opening Hook|Problem Statement|Solution\/Product|Key Benefits|Social Proof|Call to Action))/g);
        
        // Process each section to ensure proper formatting
        formattedScript = sections
            .map(section => section.trim())
            .filter(section => section)
            .join('\n\n');

        return formattedScript;
    };

    const handleCopyScript = async (script, index) => {
        try {
            await navigator.clipboard.writeText(formatScript(script));
            setCopiedIndex(index);
            setTimeout(() => setCopiedIndex(null), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
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
                                    className="relative w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden"
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
                                            <p className="text-gray-600">Click on any script to edit or select text. Use the copy button to copy the entire script.</p>
                                        </div>

                                        {/* Scripts List */}
                                        <div className="space-y-6">
                                            {scripts.map((script, index) => (
                                                <motion.div
                                                    key={index}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: index * 0.1 }}
                                                    className="group relative"
                                                >
                                                    <div className="p-6 bg-gray-50 rounded-lg border border-gray-200 hover:border-primary-500 hover:shadow-lg transition-all">
                                                        <div className="flex justify-between items-center mb-4">
                                                            <div className="w-20"> {/* Space for left side */}
                                                            </div>
                                                            <h3 className="text-lg font-semibold text-gray-900 flex-grow text-center">
                                                                AI Generated Script
                                                            </h3>
                                                            <div className="w-20"> {/* Container for copy button, same width as left space */}
                                                                <motion.button
                                                                    whileHover={{ scale: 1.05 }}
                                                                    whileTap={{ scale: 0.95 }}
                                                                    onClick={() => handleCopyScript(script, index)}
                                                                    className="p-2 rounded-lg bg-white shadow-sm hover:shadow-md transition-all flex items-center space-x-2"
                                                                >
                                                                    {copiedIndex === index ? (
                                                                        <>
                                                                            <CheckIcon className="w-5 h-5 text-green-500" />
                                                                            <span className="text-sm text-green-500">Copied!</span>
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <ClipboardDocumentIcon className="w-5 h-5 text-primary-600" />
                                                                            <span className="text-sm text-primary-600">Copy</span>
                                                                        </>
                                                                    )}
                                                                </motion.button>
                                                            </div>
                                                        </div>
                                                        <div 
                                                            className="prose prose-sm max-w-none select-text cursor-text"
                                                            style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}
                                                        >
                                                            {formatScript(script)}
                                                        </div>
                                                    </div>
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