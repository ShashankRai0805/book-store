import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { GrLanguage } from "react-icons/gr";
import { FaHeart, FaShoppingCart, FaEdit } from "react-icons/fa";
import { MdOutlineDelete } from "react-icons/md";
import API from '../api';
import Loader from '../components/Loader/Loader';

const BookDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [editData, setEditData] = useState({});
    const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
    const role = useSelector((state) => state.auth.role);

    useEffect(() => {
        const fetch = async () => {
            try {
                setLoading(true);
                const response = await API.get(`/get-book-by-id/${id}`);
                setData(response.data.data);
                setEditData(response.data.data);
            } catch (error) {
                console.error("Error fetching book details:", error);
                navigate("/all-books");
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, [id, navigate]);

    const handleFavourite = async () => {
        try {
            const response = await API.put("/add-book-to-favourite", {}, {
                headers: {
                    id: localStorage.getItem("id"),
                    authorization: `Bearer ${localStorage.getItem("token")}`,
                    bookid: id,
                }
            });
            alert(response.data.msg);
        } catch (error) {
            console.error("Error adding to favourites:", error);
            alert("Failed to add to favourites");
        }
    };    const handleCart = async () => {
        try {
            const userId = localStorage.getItem("id");
            const token = localStorage.getItem("token");
            const bookId = id;
            
            console.log("=== FRONTEND ADD TO CART DEBUG ===");
            console.log("User ID:", userId);
            console.log("Token:", token);
            console.log("Book ID:", bookId);
            console.log("==================================");
            
            if (!userId || !token) {
                alert("Please login first");
                return;
            }
            
            // Use the same approach as favorites - manually add all headers
            const response = await API.put("/add-to-cart", {}, {
                headers: {
                    id: userId,
                    authorization: `Bearer ${token}`,
                    bookid: bookId,
                }
            });
            alert(response.data.msg);
        } catch (error) {
            console.error("Error adding to cart:", error);
            console.error("Error details:", error.response?.data || error.message);
            
            // If it's an authentication error, clear localStorage and redirect to login
            if (error.response?.status === 401) {
                alert("Session expired. Please login again.");
                localStorage.removeItem("id");
                localStorage.removeItem("token");
                localStorage.removeItem("role");
                navigate("/login");
                return;
            }
            
            alert("Failed to add to cart");
        }
    };

    const deleteBook = async () => {
        if (window.confirm('Are you sure you want to delete this book?')) {
            try {
                const response = await API.delete(`/delete-book/${id}`);
                alert(response.data.msg);
                navigate("/all-books");
            } catch (error) {
                console.error("Error deleting book:", error);
                alert("Failed to delete book");
            }
        }
    };

    const handleEdit = () => {
        setEditing(true);
    };

    const handleSaveEdit = async () => {
        try {
            const response = await API.put(`/update-book/${id}`, editData);
            setData(editData);
            setEditing(false);
            alert(response.data.msg);
        } catch (error) {
            console.error("Error updating book:", error);
            alert("Failed to update book");
        }
    };

    const handleEditInputChange = (e) => {
        setEditData({
            ...editData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className='bg-zinc-900 px-4 md:px-8 lg:px-12 py-4 md:py-8 min-h-screen'>
            {loading ? (
                <div className="flex items-center justify-center min-h-[70vh]">
                    <Loader />
                </div>
            ) : (
                <div className='flex flex-col lg:flex-row gap-6 lg:gap-8'>
                    {/* Image Section */}
                    <div className='w-full lg:w-2/5'>
                        <div className='bg-zinc-800 rounded p-4 h-[50vh] md:h-[60vh] lg:h-[70vh] flex items-center justify-center'>
                            <img src={data.url} alt={data.title} className="max-h-full max-w-full object-contain" />
                        </div>
                    </div>
                    
                    {/* Content Section */}
                    <div className='w-full lg:w-3/5 flex flex-col justify-between'>
                                {editing && role === "admin" ? (
                                    // Edit Mode for Admin
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-zinc-300 mb-2">Title</label>
                                            <input
                                                type="text"
                                                name="title"
                                                value={editData.title || ''}
                                                onChange={handleEditInputChange}
                                                className="w-full bg-zinc-700 text-white p-2 rounded"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-zinc-300 mb-2">Author</label>
                                            <input
                                                type="text"
                                                name="author"
                                                value={editData.author || ''}
                                                onChange={handleEditInputChange}
                                                className="w-full bg-zinc-700 text-white p-2 rounded"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-zinc-300 mb-2">Price</label>
                                            <input
                                                type="number"
                                                name="price"
                                                value={editData.price || ''}
                                                onChange={handleEditInputChange}
                                                className="w-full bg-zinc-700 text-white p-2 rounded"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-zinc-300 mb-2">Language</label>
                                            <input
                                                type="text"
                                                name="language"
                                                value={editData.language || ''}
                                                onChange={handleEditInputChange}
                                                className="w-full bg-zinc-700 text-white p-2 rounded"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-zinc-300 mb-2">Description</label>
                                            <textarea
                                                name="desc"
                                                value={editData.desc || ''}
                                                onChange={handleEditInputChange}
                                                rows="4"
                                                className="w-full bg-zinc-700 text-white p-2 rounded"
                                            />
                                        </div>
                                        <div className="flex gap-4">
                                            <button
                                                onClick={handleSaveEdit}
                                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                                            >
                                                Save Changes
                                            </button>
                                            <button
                                                onClick={() => setEditing(false)}
                                                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    // View Mode
                                    <div>
                                        <h1 className='text-4xl text-zinc-300 font-semibold'>{data.title}</h1>
                                        <p className='text-zinc-400 mt-1'>by {data.author}</p>
                                        <p className='text-zinc-300 mt-4 text-lg leading-relaxed'>{data.desc}</p>
                                        <p className='flex mt-4 items-center justify-start text-zinc-400'>
                                            <GrLanguage className="me-3" /> {data.language}
                                        </p>
                                        <p className='mt-4 text-zinc-100 text-3xl font-semibold'>
                                            Price: ₹ {data.price}
                                        </p>
                                    </div>
                                )}

                                {!editing && isLoggedIn && (
                                    <div className='flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-3 lg:gap-4 mt-4'>
                                        {/* Cart and Favorites for all logged-in users */}
                                        <button
                                            className='bg-zinc-700 rounded lg:rounded-full text-zinc-300 hover:bg-red-600 hover:text-white text-xl lg:text-2xl xl:text-3xl p-3 flex items-center justify-center transition-all duration-300'
                                            onClick={handleFavourite}
                                        >
                                            <FaHeart />
                                            <span className="ms-2 lg:ms-4 block lg:hidden xl:block text-sm lg:text-base">Add to Favourites</span>
                                        </button>
                                        <button
                                            className='bg-blue-600 rounded lg:rounded-full text-white hover:bg-blue-500 text-xl lg:text-2xl xl:text-3xl p-3 flex items-center justify-center transition-all duration-300'
                                            onClick={handleCart}
                                        >
                                            <FaShoppingCart />
                                            <span className="ms-2 lg:ms-4 block lg:hidden xl:block text-sm lg:text-base">Add to Cart</span>
                                        </button>
                                        
                                        {/* Admin-only buttons */}
                                        {role === "admin" && (
                                            <>
                                                <button 
                                                    className='bg-blue-500 rounded text-white text-xl lg:text-2xl p-3 flex items-center justify-center hover:bg-blue-600 transition-all duration-300'
                                                    onClick={handleEdit}
                                                >
                                                    <FaEdit />
                                                    <span className="ms-2 lg:ms-4 block lg:hidden xl:block text-sm lg:text-base">Edit</span>
                                                </button>
                                                <button
                                                    className='bg-red-500 rounded text-white text-xl lg:text-2xl p-3 flex items-center justify-center hover:bg-red-600 transition-all duration-300'
                                                    onClick={deleteBook}
                                                >
                                                    <MdOutlineDelete />
                                                    <span className="ms-2 lg:ms-4 block lg:hidden xl:block text-sm lg:text-base">Delete Book</span>
                                                </button>
                                            </>
                                        )}
                                    </div>
                                )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookDetails;
