import React from 'react';
import { FaUsers, FaBook, FaShoppingCart, FaPlus } from 'react-icons/fa';

const AdminSidebar = ({ activeTab, setActiveTab }) => {
    const menuItems = [
        { id: 'users', label: 'User Management', icon: FaUsers },
        { id: 'books', label: 'Book Management', icon: FaBook },
        { id: 'orders', label: 'Order Management', icon: FaShoppingCart },
        { id: 'addBook', label: 'Add Book', icon: FaPlus },
    ];

    return (
        <div className="w-full lg:w-64 bg-zinc-800 lg:h-screen p-4">
            <div className="mb-4 lg:mb-8">
                <h2 className="text-lg lg:text-xl font-bold text-white text-center lg:text-left">Admin Panel</h2>
            </div>
            <nav className="flex lg:flex-col overflow-x-auto lg:overflow-x-visible gap-2 lg:gap-0">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`flex items-center justify-center lg:justify-start space-x-0 lg:space-x-3 p-3 rounded-lg lg:mb-2 transition-colors whitespace-nowrap min-w-max lg:min-w-full ${
                                activeTab === item.id
                                    ? 'bg-blue-600 text-white'
                                    : 'text-zinc-300 hover:bg-zinc-700 hover:text-white'
                            }`}
                        >
                            <Icon className="w-5 h-5" />
                            <span className="hidden lg:block ml-3">{item.label}</span>
                            <span className="block lg:hidden text-xs mt-1">{item.label.split(' ')[0]}</span>
                        </button>
                    );
                })}
            </nav>
        </div>
    );
};

export default AdminSidebar;
