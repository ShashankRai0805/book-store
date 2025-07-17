import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaHeart, FaShoppingCart } from 'react-icons/fa';
import API from '../../api';

const BookCard = ({ data, favourite, onFavouriteRemove }) => {
    const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
    const role = useSelector((state) => state.auth.role);
    
    const headers = {
        id: localStorage.getItem("id"),
        authorization: `Bearer ${localStorage.getItem("token")}`,
        bookid: data._id,
    };

    const handleFavourite = async () => {
        try {
            const endpoint = favourite ? "/remove-book-from-favourite" : "/add-book-to-favourite";
            const response = await API.put(endpoint, {}, {
                headers: headers
            });
            alert(response.data.msg);
            
            // If this is a favourite page and we're removing, trigger a refresh
            if (favourite && onFavouriteRemove) {
                onFavouriteRemove(data._id);
            }
        } catch (error) {
            console.error("Error updating favourites:", error);
            alert(favourite ? "Failed to remove from favourites" : "Failed to add to favourites");
        }
    };

    const handleCart = async () => {
        try {
            const response = await API.put("/add-to-cart", {}, {
                headers: headers
            });
            alert(response.data.msg);
        } catch (error) {
            console.error("Error adding to cart:", error);
            alert("Failed to add to cart");
        }
    };

    return (
        <div className='bg-zinc-800 rounded p-3 md:p-4 flex flex-col h-full max-w-xs mx-auto'>
            <Link to={`/book-details/${data._id}`} className="flex-shrink-0">
                <div className='bg-zinc-900 rounded flex items-center justify-center overflow-hidden h-48 sm:h-56 md:h-60 lg:h-64'>
                    <img 
                        src={data.url} 
                        alt={data.title} 
                        className="w-full h-full object-contain transition-transform duration-300 hover:scale-105" 
                    />
                </div>
            </Link>
            
            {/* Content Section with Fixed Heights */}
            <div className="flex flex-col flex-grow mt-3 justify-between min-h-[100px]">
                <div className="flex-grow">
                    <h2 className='text-sm sm:text-base md:text-lg text-zinc-200 font-semibold leading-tight line-clamp-2 min-h-[2.5rem] flex items-start'>
                        <span className="block">{data.title}</span>
                    </h2>
                    <p className='mt-2 text-xs sm:text-sm text-zinc-400 font-medium truncate'>
                        by {data.author}
                    </p>
                </div>
                
                <div className="mt-2 pt-2 border-t border-zinc-700">
                    <p className='text-zinc-200 font-bold text-base sm:text-lg'>₹ {data.price}</p>
                </div>
                
                {/* Action Buttons - Only show for logged in users and not admin */}
                {isLoggedIn && role !== "admin" && (
                    <div className="flex gap-2 mt-3">
                        <button
                            onClick={handleFavourite}
                            className={`flex-1 ${favourite ? 'bg-red-600 hover:bg-red-700' : 'bg-zinc-700 hover:bg-red-600'} text-zinc-300 hover:text-white p-2 rounded flex items-center justify-center gap-2 transition-all duration-300 text-sm`}
                        >
                            <FaHeart className="text-xs" />
                            <span>{favourite ? 'Remove' : 'Fav'}</span>
                        </button>
                        <button
                            onClick={handleCart}
                            className="flex-1 bg-blue-600 hover:bg-blue-500 text-white p-2 rounded flex items-center justify-center gap-2 transition-all duration-300 text-sm"
                        >
                            <FaShoppingCart className="text-xs" />
                            <span>Cart</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookCard;
