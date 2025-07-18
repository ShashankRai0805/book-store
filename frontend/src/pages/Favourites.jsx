import React, { useEffect, useState } from 'react';
import API from '../api';
import BookCard from '../components/BookCard/BookCard';
import { FaHeart } from "react-icons/fa";

const Favourites = () => {
    const [favouriteBooks, setFavouriteBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const fetch = async () => {
            try {
                setLoading(true);
                const response = await API.get("/get-favourite-books");
                setFavouriteBooks(response.data.data);
                // Trigger animation after data loads
                setTimeout(() => setIsVisible(true), 100);
            } catch (error) {
                console.error("Error fetching favourite books:", error);
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, []);

    const handleFavouriteRemove = (bookId) => {
        // Add exit animation before removing
        const cardElement = document.querySelector(`[data-book-id="${bookId}"]`);
        if (cardElement) {
            cardElement.style.animation = 'fadeOut 0.3s ease-out forwards';
            setTimeout(() => {
                setFavouriteBooks(prevBooks => prevBooks.filter(book => book._id !== bookId));
            }, 300);
        } else {
            setFavouriteBooks(prevBooks => prevBooks.filter(book => book._id !== bookId));
        }
    };

    return (
        <>
            {loading ? (
                <div className="text-zinc-500 flex items-center justify-center w-full h-[100%]">
                    Loading favourites...
                </div>
            ) : favouriteBooks.length === 0 ? (
                <div className="text-5xl font-semibold text-zinc-500 flex flex-col items-center justify-center w-full h-[100%]">
                    <FaHeart className="mb-4" />
                    No Favourite Books
                </div>
            ) : (
                <div className='grid grid-cols-3 gap-4'>
                    {favouriteBooks.map((items, i) => (
                        <div key={i}>
                            <BookCard 
                                data={items} 
                                favourite={true} 
                                onFavouriteRemove={handleFavouriteRemove}
                            />
                        </div>
                    ))}
                </div>
            )}
        </>
    );
};

export default Favourites;
