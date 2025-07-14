import React, { useEffect, useState } from 'react';
import { AiFillDelete } from "react-icons/ai";
import API from '../api';
import Loader from '../components/Loader/Loader';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Cart = () => {
    const navigate = useNavigate();
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [error, setError] = useState(null);
    const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

    useEffect(() => {
        // Check both Redux state and localStorage for authentication
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("id");
        
        if (!isLoggedIn && (!token || !userId)) {
            navigate("/login");
            return;
        }

        const fetch = async () => {
            try {
                setLoading(true);
                setError(null);
                
                const response = await API.get("/get-user-cart");
                setCart(response.data.data || []);
            } catch (error) {
                console.error("Error fetching cart:", error);
                setError("Failed to load cart. Please try again.");
                setCart([]);
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, [isLoggedIn, navigate]);

    const deleteItem = async (bookid) => {
        try {
            const response = await API.put(`/remove-from-cart/${bookid}`);
            alert(response.data.msg);
            // Refresh cart after deletion
            const cartResponse = await API.get("/get-user-cart");
            setCart(cartResponse.data.data);
        } catch (error) {
            console.error("Error removing item from cart:", error);
            alert("Failed to remove item from cart");
        }
    };

    useEffect(() => {
        if (cart && cart.length > 0) {
            let totalAmount = 0;
            cart.map((items) => {
                totalAmount += items.price;
            });
            setTotal(totalAmount);
        }
    }, [cart]);

    const placeOrder = async () => {
        try {
            const orderData = cart.map(book => ({_id: book._id}));
            const response = await API.post("/place-order", {order: orderData});
            alert(response.data.msg);
            navigate("/profile/order-history");
        } catch (error) {
            console.error("Error placing order:", error);
            alert("Failed to place order");
        }
    };

    const shouldRedirect = !isLoggedIn && (!localStorage.getItem("token") || !localStorage.getItem("id"));
    
    if (shouldRedirect) {
        return null;
    }

    return (
        <div className='bg-zinc-900 px-4 md:px-8 lg:px-12 min-h-screen py-4 md:py-8'>
            {loading && (
                <div className="w-full h-[70vh] flex items-center justify-center">
                    <Loader />
                </div>
            )}
            {error && (
                <div className="min-h-[70vh]">
                    <div className="h-full flex items-center justify-center flex-col px-4">
                        <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-red-400 mb-4 text-center">
                            {error}
                        </h1>
                        <button
                            onClick={() => window.location.reload()}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                            Retry
                        </button>
                    </div>
                </div>
            )}
            {!loading && !error && cart.length === 0 && (
                <div className="min-h-[70vh]">
                    <div className="h-full flex items-center justify-center flex-col px-4">
                        <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-semibold text-zinc-400 text-center">
                            Empty Cart
                        </h1>
                        <img src="./empty-cart.png" alt="empty cart" className="max-h-[40vh] lg:max-h-[50vh] mt-4" />
                    </div>
                </div>
            )}
            {!loading && !error && cart.length > 0 && (
                <>
                    <h1 className='text-3xl md:text-4xl lg:text-5xl font-semibold text-zinc-500 mb-6 md:mb-8'>
                        Your Cart
                    </h1>
                    <div className="space-y-4">
                        {cart.map((items, i) => (
                            <div
                                className='w-full rounded flex flex-col md:flex-row p-4 bg-zinc-800 items-center gap-4'
                                key={i}
                            >
                                <div className="flex-shrink-0">
                                    <img
                                        src={items.url}
                                        alt="/"
                                        className="h-[20vh] md:h-[12vh] lg:h-[10vh] object-cover rounded"
                                    />
                                </div>
                                <div className='flex-1 text-center md:text-left min-w-0'>
                                    <h1 className='text-xl md:text-2xl text-zinc-100 font-semibold mb-2'>
                                        {items.title}
                                    </h1>
                                    <p className='text-sm md:text-base text-zinc-300 mb-2 hidden sm:block'>
                                        {items.desc.slice(0, 100)}...
                                    </p>
                                    <p className='text-sm text-zinc-300 mb-2 block sm:hidden'>
                                        {items.desc.slice(0, 65)}...
                                    </p>
                                    <p className='text-2xl md:text-3xl text-zinc-100 font-semibold'>
                                        ₹ {items.price}
                                    </p>
                                </div>
                                <div className='flex items-center justify-center md:justify-end'>
                                    <button
                                        className='bg-red-100 text-red-700 border border-red-700 rounded p-2 hover:bg-red-200 transition-colors'
                                        onClick={() => deleteItem(items._id)}
                                    >
                                        <AiFillDelete />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
            {!loading && !error && cart.length > 0 && (
                <div className='mt-6 md:mt-8 w-full flex justify-center md:justify-end'>
                    <div className='p-4 bg-zinc-800 rounded w-full max-w-md'>
                        <h1 className='text-2xl md:text-3xl text-zinc-200 font-semibold mb-3'>
                            Total Amount
                        </h1>
                        <div className='flex items-center justify-between text-lg md:text-xl text-zinc-200 mb-3'>
                            <h2>{cart.length} books</h2> 
                            <h2>₹ {total}</h2>
                        </div>
                        <button
                            className='bg-zinc-100 rounded px-4 py-3 flex items-center justify-center w-full text-zinc-800 font-semibold hover:bg-zinc-200 transition-colors'
                            onClick={placeOrder}
                        >
                            Place your order
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart
