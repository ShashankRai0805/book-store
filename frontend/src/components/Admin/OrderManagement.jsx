import React, { useState, useEffect } from 'react';
import API from '../../api';
import { FaCheck, FaTimes, FaEye } from 'react-icons/fa';

const OrderManagement = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);

    useEffect(() => {
        fetchAllOrders();
    }, []);

    const fetchAllOrders = async () => {
        try {
            setLoading(true);
            const response = await API.get('/get-all-orders');
            setOrders(response.data.data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateOrderStatus = async (orderId, status) => {
        try {
            await API.put(`/update-status/${orderId}`, { status });
            setOrders(orders.map(order => 
                order._id === orderId ? { ...order, status } : order
            ));
            alert(`Order ${status} successfully!`);
        } catch (error) {
            console.error('Error updating order status:', error);
            alert('Failed to update order status');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Order placed':
                return 'bg-yellow-600';
            case 'Out for delivery':
                return 'bg-blue-600';
            case 'Delivered':
                return 'bg-green-600';
            case 'Cancelled':
                return 'bg-red-600';
            default:
                return 'bg-gray-600';
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-white">Loading orders...</div>
            </div>
        );
    }

    return (
        <div>
            <h2 className="text-2xl font-bold text-white mb-6">Order Management</h2>
            
            <div className="bg-zinc-700 rounded-lg overflow-hidden">
                <table className="w-full">
                    <thead className="bg-zinc-600">
                        <tr>
                            <th className="p-3 text-left text-white">Order ID</th>
                            <th className="p-3 text-left text-white">User</th>
                            <th className="p-3 text-left text-white">Book</th>
                            <th className="p-3 text-left text-white">Status</th>
                            <th className="p-3 text-left text-white">Date</th>
                            <th className="p-3 text-left text-white">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order._id} className="border-b border-zinc-600">
                                <td className="p-3 text-zinc-200">
                                    {order._id.substring(0, 8)}...
                                </td>
                                <td className="p-3 text-zinc-200">
                                    {order.user?.username || 'N/A'}
                                </td>
                                <td className="p-3 text-zinc-200">
                                    {order.book?.title || 'N/A'}
                                </td>
                                <td className="p-3">
                                    <span className={`px-2 py-1 rounded text-xs text-white ${getStatusColor(order.status)}`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="p-3 text-zinc-200">
                                    {new Date(order.createdAt).toLocaleDateString()}
                                </td>
                                <td className="p-3">
                                    <div className="flex space-x-2">
                                        {order.status === 'Order placed' && (
                                            <>
                                                <button
                                                    onClick={() => updateOrderStatus(order._id, 'Out for delivery')}
                                                    className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded text-xs"
                                                    title="Mark as Out for Delivery"
                                                >
                                                    Ship
                                                </button>
                                                <button
                                                    onClick={() => updateOrderStatus(order._id, 'Cancelled')}
                                                    className="bg-red-600 hover:bg-red-700 text-white p-2 rounded"
                                                    title="Cancel Order"
                                                >
                                                    <FaTimes />
                                                </button>
                                            </>
                                        )}
                                        {order.status === 'Out for delivery' && (
                                            <button
                                                onClick={() => updateOrderStatus(order._id, 'Delivered')}
                                                className="bg-green-600 hover:bg-green-700 text-white p-2 rounded"
                                                title="Mark as Delivered"
                                            >
                                                <FaCheck />
                                            </button>
                                        )}
                                        <button
                                            onClick={() => setSelectedOrder(order)}
                                            className="bg-gray-600 hover:bg-gray-700 text-white p-2 rounded"
                                            title="View Details"
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

            {/* Order Details Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-zinc-800 p-6 rounded-lg max-w-2xl w-full">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-white">Order Details</h3>
                            <button
                                onClick={() => setSelectedOrder(null)}
                                className="text-white hover:text-red-400"
                            >
                                ✕
                            </button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h4 className="text-lg font-semibold text-white mb-3">Order Information</h4>
                                <div className="space-y-2">
                                    <p className="text-zinc-300">
                                        <span className="font-semibold">Order ID:</span> {selectedOrder._id}
                                    </p>
                                    <p className="text-zinc-300">
                                        <span className="font-semibold">Status:</span> 
                                        <span className={`ml-2 px-2 py-1 rounded text-xs text-white ${getStatusColor(selectedOrder.status)}`}>
                                            {selectedOrder.status}
                                        </span>
                                    </p>
                                    <p className="text-zinc-300">
                                        <span className="font-semibold">Order Date:</span> {new Date(selectedOrder.createdAt).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                            
                            <div>
                                <h4 className="text-lg font-semibold text-white mb-3">Customer Information</h4>
                                <div className="space-y-2">
                                    <p className="text-zinc-300">
                                        <span className="font-semibold">Name:</span> {selectedOrder.user?.username || 'N/A'}
                                    </p>
                                    <p className="text-zinc-300">
                                        <span className="font-semibold">Email:</span> {selectedOrder.user?.email || 'N/A'}
                                    </p>
                                    <p className="text-zinc-300">
                                        <span className="font-semibold">Address:</span> {selectedOrder.user?.address || 'N/A'}
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="mt-6">
                            <h4 className="text-lg font-semibold text-white mb-3">Book Information</h4>
                            <div className="flex space-x-4 bg-zinc-700 p-4 rounded">
                                <img
                                    src={selectedOrder.book?.url}
                                    alt={selectedOrder.book?.title}
                                    className="w-16 h-20 object-cover rounded"
                                />
                                <div>
                                    <h5 className="text-white font-semibold">{selectedOrder.book?.title}</h5>
                                    <p className="text-zinc-300">by {selectedOrder.book?.author}</p>
                                    <p className="text-green-400 font-semibold">${selectedOrder.book?.price}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderManagement;
