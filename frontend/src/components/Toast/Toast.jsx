import React, { useState, useEffect } from 'react';
import { FaCheck, FaTimes, FaExclamationTriangle, FaInfo } from 'react-icons/fa';

const Toast = ({ message, type = 'info', isVisible, onClose, duration = 3000, isDark = true }) => {
    useEffect(() => {
        if (isVisible && duration > 0) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);
            
            return () => clearTimeout(timer);
        }
    }, [isVisible, duration, onClose]);

    if (!isVisible) return null;

    const getIcon = () => {
        const iconColor = isDark ? 'text-current' : '';
        switch (type) {
            case 'success':
                return <FaCheck className={`${isDark ? 'text-green-400' : 'text-green-600'} text-lg`} />;
            case 'error':
                return <FaTimes className={`${isDark ? 'text-red-400' : 'text-red-600'} text-lg`} />;
            case 'warning':
                return <FaExclamationTriangle className={`${isDark ? 'text-yellow-400' : 'text-yellow-600'} text-lg`} />;
            case 'info':
            default:
                return <FaInfo className={`${isDark ? 'text-blue-400' : 'text-blue-600'} text-lg`} />;
        }
    };

    const getToastStyles = () => {
        if (isDark) {
            // Dark theme variants
            switch (type) {
                case 'success':
                    return 'bg-green-900/90 border-green-500 text-green-100 shadow-green-900/50 backdrop-blur-sm';
                case 'error':
                    return 'bg-red-900/90 border-red-500 text-red-100 shadow-red-900/50 backdrop-blur-sm';
                case 'warning':
                    return 'bg-yellow-900/90 border-yellow-500 text-yellow-100 shadow-yellow-900/50 backdrop-blur-sm';
                case 'info':
                default:
                    return 'bg-blue-900/90 border-blue-500 text-blue-100 shadow-blue-900/50 backdrop-blur-sm';
            }
        } else {
            // Light theme variants
            switch (type) {
                case 'success':
                    return 'bg-green-100 border-green-300 text-green-800 shadow-green-200';
                case 'error':
                    return 'bg-red-100 border-red-300 text-red-800 shadow-red-200';
                case 'warning':
                    return 'bg-yellow-100 border-yellow-300 text-yellow-800 shadow-yellow-200';
                case 'info':
                default:
                    return 'bg-blue-100 border-blue-300 text-blue-800 shadow-blue-200';
            }
        }
    };

    return (
        <div className={`fixed top-4 right-4 z-50 transform transition-all duration-300 ${
            isVisible ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0'
        }`}>
            <div className={`flex items-start gap-3 px-4 py-3 rounded-lg border-2 shadow-xl min-w-[320px] max-w-[480px] ${getToastStyles()}`}>
                <div className="flex-shrink-0 mt-0.5">
                    {getIcon()}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium leading-relaxed break-words">{message}</p>
                </div>
                <button
                    onClick={onClose}
                    className={`flex-shrink-0 hover:opacity-70 transition-opacity ml-2 ${isDark ? 'text-zinc-400 hover:text-zinc-200' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    <FaTimes className="w-3 h-3" />
                </button>
            </div>
        </div>
    );
};

export default Toast;
