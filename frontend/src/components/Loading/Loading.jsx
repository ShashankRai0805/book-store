import React from 'react';

const LoadingSpinner = ({ size = 'medium', color = 'blue' }) => {
    const getSizeClass = () => {
        switch (size) {
            case 'small':
                return 'h-4 w-4';
            case 'large':
                return 'h-8 w-8';
            case 'xl':
                return 'h-12 w-12';
            case 'medium':
            default:
                return 'h-6 w-6';
        }
    };

    const getColorClass = () => {
        switch (color) {
            case 'white':
                return 'border-white border-t-transparent';
            case 'red':
                return 'border-red-500 border-t-transparent';
            case 'green':
                return 'border-green-500 border-t-transparent';
            case 'blue':
            default:
                return 'border-blue-500 border-t-transparent';
        }
    };

    return (
        <div className={`animate-spin rounded-full border-2 ${getSizeClass()} ${getColorClass()}`}></div>
    );
};

const LoadingOverlay = ({ isLoading, children, message = "Loading..." }) => {
    return (
        <div className="relative">
            {children}
            {isLoading && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center z-10 rounded">
                    <LoadingSpinner size="large" color="white" />
                    <p className="text-white mt-2 text-sm">{message}</p>
                </div>
            )}
        </div>
    );
};

const LoadingButton = ({ 
    isLoading, 
    children, 
    loadingText = "Loading...", 
    className = "", 
    disabled = false,
    ...props 
}) => {
    return (
        <button 
            {...props}
            disabled={isLoading || disabled}
            className={`${className} ${(isLoading || disabled) ? 'opacity-75 cursor-not-allowed' : ''}`}
        >
            {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                    <LoadingSpinner size="small" color="white" />
                    <span>{loadingText}</span>
                </div>
            ) : (
                children
            )}
        </button>
    );
};

export { LoadingSpinner, LoadingOverlay, LoadingButton };
export default LoadingSpinner;
