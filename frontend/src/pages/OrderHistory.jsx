import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../api';
import Loader from '../components/Loader/Loader';

const OrderHistory = () => {
    const [orderHistory, setOrderHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            try {
                setLoading(true);
                console.log("=== FETCHING ORDER HISTORY ===");
                console.log("User token:", localStorage.getItem("token"));
                console.log("User ID:", localStorage.getItem("id"));
                
                const response = await API.get("/get-order-history");
                console.log("Order history response:", response.data);
                console.log("Order data:", response.data.data);
                console.log("Number of orders:", response.data.data?.length || 0);
                
                setOrderHistory(response.data.data || []);
            } catch (error) {
                console.error("Error fetching order history:", error);
                console.error("Error details:", error.response?.data);
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, []);

    return (
        <>
            {loading && (
                <div className="flex items-center justify-center h-[100%]">
                    <Loader />
                </div>
            )}
            {!loading && orderHistory.length === 0 && (
                <div className="text-5xl font-semibold text-zinc-500 flex items-center justify-center w-full h-[100%]">
                    No Order History
                </div>
            )}
            {!loading && orderHistory.length > 0 && (
                <div className='text-zinc-100 w-full rounded py-2 px-4 mt-4'>
                    <h1 className='text-3xl md:text-5xl font-semibold text-zinc-500 mb-8'>
                        Your Order History
                    </h1>
                    <div className='mt-4 w-full'>
                        <div className='w-full rounded py-2 px-4 bg-zinc-800 flex gap-2 md:gap-4'>
                            <div className='w-[3%]'>
                                <h1 className='text-center'>Sr.</h1>
                            </div>
                            <div className='w-[40%] md:w-[22%]'>
                                <h1 className=''>Books</h1>
                            </div>
                            <div className='w-0 md:w-[45%] hidden md:block'>
                                <h1 className=''>Description</h1>
                            </div>
                            <div className='w-[17%] md:w-[9%]'>
                                <h1 className=''>Price</h1>
                            </div>
                            <div className='w-[30%] md:w-[16%]'>
                                <h1 className=''>Status</h1>
                            </div>
                            <div className='w-[10%] md:w-[5%]'>
                                <h1 className=''>COD</h1>
                            </div>
                        </div>
                        {orderHistory.map((items, i) => (
                            <div
                                className='w-full rounded py-2 px-4 bg-zinc-900 flex gap-4 hover:bg-zinc-800 hover:cursor-pointer'
                                key={i}
                            >
                                <div className='w-[3%]'>
                                    <h1 className='text-center'>{i + 1}</h1>
                                </div>
                                <div className='w-[40%] md:w-[22%]'>
                                    <Link
                                        to={`/book-details/${items.book._id}`}
                                        className='hover:text-blue-300'
                                    >
                                        {items.book.title}
                                    </Link>
                                </div>
                                <div className='w-0 md:w-[45%] hidden md:block'>
                                    <h1 className=''>{items.book.desc.slice(0, 50)} ...</h1>
                                </div>
                                <div className='w-[17%] md:w-[9%]'>
                                    <h1 className=''>₹ {items.book.price}</h1>
                                </div>
                                <div className='w-[30%] md:w-[16%]'>
                                    <h1 className='font-semibold text-green-500'>
                                        {items.status === "Order Placed" ? (
                                            <div className='text-yellow-500'>{items.status}</div>
                                        ) : items.status === "Canceled" ? (
                                            <div className='text-red-500'>{items.status}</div>
                                        ) : (
                                            items.status
                                        )}
                                    </h1>
                                </div>
                                <div className='w-[10%] md:w-[5%]'>
                                    <h1 className='text-sm'>COD</h1>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
};

export default OrderHistory;
