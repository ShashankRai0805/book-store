import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaHeart, FaShoppingCart } from 'react-icons/fa';
import API from '../../api';

const BookCard = ({ data, favourite, onFavouriteRemove }) => {
    const [isLoadingFav, setIsLoadingFav] = useState(false);
    const [isLoadingCart, setIsLoadingCart] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [isFavAnimating, setIsFavAnimating] = useState(false);
    
    const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
    const role = useSelector((state) => state.auth.role);
    
    const headers = {
        id: localStorage.getItem("id"),
        authorization: `Bearer ${localStorage.getItem("token")}`,
        bookid: data._id,
    };

    const handleFavourite = async () => {
        try {
            setIsLoadingFav(true);
            setIsFavAnimating(true);
            
            const endpoint = favourite ? "/remove-book-from-favourite" : "/add-book-to-favourite";
            const response = await API.put(endpoint, {}, {
                headers: headers
            });
            alert(response.data.msg);
            
            // If this is a favourite page and we're removing, trigger a refresh
            if (favourite && onFavouriteRemove) {
                onFavouriteRemove(data._id);
            }
            
            // Reset animation after a delay
            setTimeout(() => setIsFavAnimating(false), 600);
        } catch (error) {
            console.error("Error updating favourites:", error);
            alert(favourite ? "Failed to remove from favourites" : "Failed to add to favourites");
            setIsFavAnimating(false);
        } finally {
            setIsLoadingFav(false);
        }
    };

    const handleCart = async () => {
        try {
            setIsLoadingCart(true);
            const response = await API.put("/add-to-cart", {}, {
                headers: headers
            });
            alert(response.data.msg);
        } catch (error) {
            console.error("Error adding to cart:", error);
            alert("Failed to add to cart");
        } finally {
            setIsLoadingCart(false);
        }
    };

    return (
        <div className='bg-zinc-800 rounded p-3 md:p-4 flex flex-col h-full max-w-xs mx-auto transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20 group'>
            <Link to={`/book-details/${data._id}`} className="flex-shrink-0">
                <div className='bg-zinc-900 rounded flex items-center justify-center overflow-hidden h-48 sm:h-56 md:h-60 lg:h-64 relative'>
                    {!imageLoaded && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
                        </div>
                    )}
                    <img 
                        src={data.url} 
                        alt={data.title} 
                        className={`w-full h-full object-contain transition-all duration-500 group-hover:scale-110 ${
                            imageLoaded ? 'opacity-100' : 'opacity-0'
                        }`}
                        onLoad={() => setImageLoaded(true)}
                    />
                </div>
            </Link>
            
            {/* Content Section with Fixed Heights */}
            <div className="flex flex-col flex-grow mt-3 justify-between min-h-[100px]">
                <div className="flex-grow">
                    <h2 className='text-sm sm:text-base md:text-lg text-zinc-200 font-semibold leading-tight line-clamp-2 min-h-[2.5rem] flex items-start group-hover:text-blue-300 transition-colors duration-300'>
                        <span className="block">{data.title}</span>
                    </h2>
                    <p className='mt-2 text-xs sm:text-sm text-zinc-400 font-medium truncate group-hover:text-zinc-300 transition-colors duration-300'>
                        by {data.author}
                    </p>
                </div>
                
                <div className="mt-2 pt-2 border-t border-zinc-700 group-hover:border-zinc-600 transition-colors duration-300">
                    <p className='text-zinc-200 font-bold text-base sm:text-lg group-hover:text-blue-300 transition-colors duration-300'>₹ {data.price}</p>
                </div>
                
                {/* Action Buttons - Only show for logged in users and not admin */}
                {isLoggedIn && role !== "admin" && (
                    <div className="flex gap-2 mt-3">
                        <button
                            onClick={handleFavourite}
                            disabled={isLoadingFav}
                            className={`flex-1 ${favourite ? 'bg-red-600 hover:bg-red-700' : 'bg-zinc-700 hover:bg-red-600'} text-zinc-300 hover:text-white p-2 rounded flex items-center justify-center gap-2 transition-all duration-300 text-sm transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
                                isFavAnimating ? 'animate-pulse' : ''
                            }`}
                        >
                            {isLoadingFav ? (
                                <div className="animate-spin rounded-full h-3 w-3 border border-current border-t-transparent"></div>
                            ) : (
                                <FaHeart className={`text-xs transition-transform duration-300 ${isFavAnimating ? 'animate-bounce' : ''}`} />
                            )}
                            <span>{favourite ? 'Remove' : 'Fav'}</span>
                        </button>
                        <button
                            onClick={handleCart}
                            disabled={isLoadingCart}
                            className="flex-1 bg-blue-600 hover:bg-blue-500 text-white p-2 rounded flex items-center justify-center gap-2 transition-all duration-300 text-sm transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoadingCart ? (
                                <div className="animate-spin rounded-full h-3 w-3 border border-current border-t-transparent"></div>
                            ) : (
                                <FaShoppingCart className="text-xs" />
                            )}
                            <span>Cart</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookCard;
