import React, { createContext, useContext, useState, useCallback } from 'react';
import Toast from '../components/Toast/Toast';

const ToastContext = createContext();

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = 'info', duration = 3000) => {
        const id = Date.now() + Math.random();
        const newToast = {
            id,
            message,
            type,
            duration,
            isVisible: true
        };
        
        setToasts(prev => [...prev, newToast]);
        
        // Auto remove toast after duration
        if (duration > 0) {
            setTimeout(() => {
                removeToast(id);
            }, duration);
        }
        
        return id;
    }, []);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    }, []);

    const showSuccess = useCallback((message, duration = 3000) => {
        return addToast(message, 'success', duration);
    }, [addToast]);

    const showError = useCallback((message, duration = 4000) => {
        return addToast(message, 'error', duration);
    }, [addToast]);

    const showWarning = useCallback((message, duration = 3500) => {
        return addToast(message, 'warning', duration);
    }, [addToast]);

    const showInfo = useCallback((message, duration = 3000) => {
        return addToast(message, 'info', duration);
    }, [addToast]);

    const value = {
        addToast,
        removeToast,
        showSuccess,
        showError,
        showWarning,
        showInfo
    };

    return (
        <ToastContext.Provider value={value}>
            {children}
            
            {/* Render all toasts */}
            <div className="fixed top-4 right-4 z-50 space-y-3 max-w-[480px]">
                {toasts.map((toast, index) => (
                    <div 
                        key={toast.id}
                        style={{ 
                            transform: `translateY(${index * 4}px) scale(${1 - index * 0.02})`,
                            zIndex: 50 - index,
                            opacity: 1 - index * 0.1
                        }}
                        className="transform transition-all duration-300"
                    >
                        <Toast
                            message={toast.message}
                            type={toast.type}
                            isVisible={toast.isVisible}
                            onClose={() => removeToast(toast.id)}
                            duration={0} // We handle duration in the context
                            isDark={true} // Dark theme for our book store
                        />
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};

export default ToastContext;
