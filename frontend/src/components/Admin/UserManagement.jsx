import React, { useState, useEffect } from 'react';
import API from '../../api';
import { FaEdit, FaEye } from 'react-icons/fa';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingUser, setEditingUser] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await API.get('/get-all-users');
            setUsers(response.data.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRoleChange = async (userId, newRole) => {
        try {
            await API.put(`/update-role/${userId}`, { role: newRole });
            setUsers(users.map(user => 
                user._id === userId ? { ...user, role: newRole } : user
            ));
            setEditingUser(null);
            alert('User role updated successfully!');
        } catch (error) {
            console.error('Error updating user role:', error);
            alert('Failed to update user role');
        }
    };

    const fetchUserOrders = async (userId) => {
        try {
            console.log("Fetching orders for user ID:", userId);
            const response = await API.get(`/get-order-history/${userId}`);
            console.log("Orders response:", response.data);
            setSelectedUser({
                ...users.find(u => u._id === userId),
                orders: response.data.data
            });
        } catch (error) {
            console.error('Error fetching user orders:', error);
            console.error('Error response:', error.response?.data);
            alert('Failed to fetch user orders: ' + (error.response?.data?.msg || error.message));
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-white">Loading users...</div>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-6">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-4 md:mb-6">User Management</h2>
            
            {/* User List - Responsive Table */}
            <div className="bg-zinc-700 rounded-lg overflow-hidden">
                {/* Desktop Table */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full min-w-full">
                        <thead className="bg-zinc-600">
                            <tr>
                                <th className="p-3 text-left text-white">Username</th>
                                <th className="p-3 text-left text-white">Email</th>
                                <th className="p-3 text-left text-white">Role</th>
                                <th className="p-3 text-left text-white">Joined</th>
                                <th className="p-3 text-left text-white">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user._id} className="border-b border-zinc-600">
                                    <td className="p-3 text-zinc-200">{user.username}</td>
                                    <td className="p-3 text-zinc-200 truncate max-w-xs">{user.email}</td>
                                    <td className="p-3">
                                        {editingUser === user._id ? (
                                            <select
                                                value={user.role}
                                                onChange={(e) => handleRoleChange(user._id, e.target.value)}
                                                className="bg-zinc-600 text-white p-1 rounded text-sm"
                                            >
                                                <option value="user">User</option>
                                                <option value="admin">Admin</option>
                                            </select>
                                        ) : (
                                            <span className={`px-2 py-1 rounded text-xs ${
                                                user.role === 'admin' 
                                                    ? 'bg-red-600 text-white' 
                                                    : 'bg-green-600 text-white'
                                            }`}>
                                                {user.role}
                                            </span>
                                        )}
                                    </td>
                                    <td className="p-3 text-zinc-200 text-sm">
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="p-3">
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => setEditingUser(user._id)}
                                                className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded text-sm"
                                                title="Edit Role"
                                            >
                                                <FaEdit />
                                            </button>
                                            <button
                                                onClick={() => fetchUserOrders(user._id)}
                                                className="bg-green-600 hover:bg-green-700 text-white p-2 rounded text-sm"
                                                title="View Orders"
                                            >
                                                <FaEye />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden space-y-4 p-4">
                    {users.map((user) => (
                        <div key={user._id} className="bg-zinc-600 p-4 rounded-lg">
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-white font-semibold text-lg truncate">{user.username}</h3>
                                    <p className="text-zinc-300 text-sm truncate">{user.email}</p>
                                    <p className="text-zinc-400 text-xs mt-1">
                                        Joined: {new Date(user.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="ml-4">
                                    {editingUser === user._id ? (
                                        <select
                                            value={user.role}
                                            onChange={(e) => handleRoleChange(user._id, e.target.value)}
                                            className="bg-zinc-700 text-white p-2 rounded text-sm"
                                        >
                                            <option value="user">User</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    ) : (
                                        <span className={`px-3 py-1 rounded text-xs font-medium ${
                                            user.role === 'admin' 
                                                ? 'bg-red-600 text-white' 
                                                : 'bg-green-600 text-white'
                                        }`}>
                                            {user.role}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="flex justify-end space-x-2">
                                <button
                                    onClick={() => setEditingUser(user._id)}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm flex items-center"
                                    title="Edit Role"
                                >
                                    <FaEdit className="mr-1" /> Edit
                                </button>
                                <button
                                    onClick={() => fetchUserOrders(user._id)}
                                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded text-sm flex items-center"
                                    title="View Orders"
                                >
                                    <FaEye className="mr-1" /> Orders
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* User Orders Modal - Responsive */}
            {selectedUser && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-zinc-800 p-4 md:p-6 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg md:text-xl font-bold text-white truncate">
                                Orders for {selectedUser.username}
                            </h3>
                            <button
                                onClick={() => setSelectedUser(null)}
                                className="text-white hover:text-red-400 text-xl ml-2"
                            >
                                ✕
                            </button>
                        </div>
                        
                        {selectedUser.orders && selectedUser.orders.length > 0 ? (
                            <div className="space-y-4">
                                {selectedUser.orders.map((order) => (
                                    <div key={order._id} className="bg-zinc-700 p-3 md:p-4 rounded">
                                        <div className="flex flex-col md:flex-row md:justify-between md:items-start space-y-2 md:space-y-0">
                                            <div className="flex-1 min-w-0">
                                                <p className="text-white font-semibold text-sm md:text-base truncate">
                                                    Order ID: {order._id}
                                                </p>
                                                <p className="text-zinc-300 text-sm">
                                                    Status: {order.status}
                                                </p>
                                                <p className="text-zinc-300 text-sm">
                                                    Date: {new Date(order.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div className="md:text-right md:ml-4">
                                                <p className="text-white font-semibold text-sm md:text-base truncate">
                                                    Book: {order.book?.title || 'N/A'}
                                                </p>
                                                <p className="text-zinc-300 text-sm">
                                                    Price: ₹{order.book?.price || 0}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-zinc-300 text-center py-8">No orders found for this user.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManagement;
