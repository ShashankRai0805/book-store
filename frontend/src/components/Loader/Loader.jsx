import React from 'react';

const Loader = () => {
    return (
        <div className="flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-zinc-800 border-t-white rounded-full animate-spin"></div>
        </div>
    );
};

export default Loader;
