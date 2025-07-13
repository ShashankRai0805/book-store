import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaCheck } from "react-icons/fa";
import API from '../api';
import Loader from '../components/Loader/Loader';

const AllOrders = () => {
    const [allOrders, setAllOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [options, setOptions] = useState(-1);
    const [values, setValues] = useState({ status: "" });

    useEffect(() => {
        const fetch = async () => {
            try {
                setLoading(true);
                const response = await API.get("/get-all-orders");
                setAllOrders(response.data.data);
            } catch (error) {
                console.error("Error fetching orders:", error);
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, []);

    const change = (e) => {
        const { value } = e.target;
        setValues({ status: value });
    };

    const submitChanges = async (i) => {
        try {
            const id = allOrders[i]._id;
            const response = await API.put(`/update-status/${id}`, values);
            alert(response.data.msg);
            setOptions(-1);
            // Refresh orders
            const ordersResponse = await API.get("/get-all-orders");
            setAllOrders(ordersResponse.data.data);
        } catch (error) {
            console.error("Error updating status:", error);
            alert("Failed to update status");
        }
    };

    return (
        <>
            {loading && (
                <div className="h-[100%] flex items-center justify-center">
                    <Loader />
                </div>
            )}
            {!loading && (
                <div className='text-zinc-100 w-full rounded py-2 px-4 mt-4'>
                    <h1 className='text-3xl md:text-5xl font-semibold text-zinc-500 mb-8'>
                        All Orders
                    </h1>
                    <div className='mt-4 w-full'>
                        <div className='w-full rounded py-2 px-4 bg-zinc-800 flex gap-2 md:gap-4'>
                            <div className='w-[3%]'>
                                <h1 className='text-center'>Sr.</h1>
                            </div>
                            <div className='w-[22%]'>
                                <h1 className=''>Books</h1>
                            </div>
                            <div className='w-[45%] hidden md:block'>
                                <h1 className=''>Description</h1>
                            </div>
                            <div className='w-[9%]'>
                                <h1 className=''>Price</h1>
                            </div>
                            <div className='w-[16%]'>
                                <h1 className=''>Status</h1>
                            </div>
                            <div className='w-[5%]'>
                                <h1 className=''>User</h1>
                            </div>
                        </div>
                        {allOrders && allOrders.map((items, i) => (
                            <div className='w-full rounded py-2 px-4 bg-zinc-900 flex gap-4 hover:bg-zinc-800 hover:cursor-pointer' key={i}>
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
                                    <h1 className='font-semibold'>
                                        <button 
                                            className='hover:scale-105 transition-all duration-300'
                                            onClick={() => setOptions(i)}
                                        >
                                            {items.status === "Order Placed" ? (
                                                <div className='text-yellow-500'>{items.status}</div>
                                            ) : items.status === "Canceled" ? (
                                                <div className='text-red-500'>{items.status}</div>
                                            ) : (
                                                <div className='text-green-500'>{items.status}</div>
                                            )}
                                        </button>
                                        <div className={`${options === i ? "block" : "hidden"}`}>
                                            <select
                                                name="status"
                                                className='bg-gray-800'
                                                onChange={change}
                                                value={values.status}
                                            >
                                                {[
                                                    "Order Placed",
                                                    "Out for delivery",
                                                    "Delivered",
                                                    "Canceled",
                                                ].map((items2, ind) => (
                                                    <option value={items2} key={ind}>
                                                        {items2}
                                                    </option>
                                                ))}
                                            </select>
                                            <button
                                                className='text-green-500 hover:text-pink-600 mx-2'
                                                onClick={() => {
                                                    setOptions(-1);
                                                    submitChanges(i);
                                                }}
                                            >
                                                <FaCheck />
                                            </button>
                                        </div>
                                    </h1>
                                </div>
                                <div className='w-[10%] md:w-[5%]'>
                                    <h1 className='text-sm'>{items.user.username}</h1>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
};

export default AllOrders;
