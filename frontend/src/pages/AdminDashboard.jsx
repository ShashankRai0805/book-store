import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Admin/AdminSidebar';
import UserManagement from '../components/Admin/UserManagement';
import BookManagement from '../components/Admin/BookManagement';
import OrderManagement from '../components/Admin/OrderManagement';
import AddBook from '../components/Admin/AddBook';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('users');
    const { isLoggedIn, role } = useSelector((state) => state.auth);
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoggedIn || role !== 'admin') {
            navigate('/');
        }
    }, [isLoggedIn, role, navigate]);

    const renderContent = () => {
        switch (activeTab) {
            case 'users':
                return <UserManagement />;
            case 'books':
                return <BookManagement />;
            case 'orders':
                return <OrderManagement />;
            case 'addBook':
                return <AddBook />;
            default:
                return <UserManagement />;
        }
    };

    if (!isLoggedIn || role !== 'admin') {
        return null;
    }

    return (
        <div className="bg-zinc-900 min-h-screen flex flex-col lg:flex-row">
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            <div className="flex-1 p-4 md:p-6">
                <div className="bg-zinc-800 rounded-lg p-4 md:p-6">
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4 md:mb-6">
                        Admin Dashboard
                    </h1>
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
