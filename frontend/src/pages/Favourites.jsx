import React, { useEffect, useState } from 'react';
import API from '../api';
import BookCard from '../components/BookCard/BookCard';
import { FaHeart } from "react-icons/fa";

const Favourites = () => {
    const [favouriteBooks, setFavouriteBooks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            try {
                setLoading(true);
                const response = await API.get("/get-favourite-books");
                setFavouriteBooks(response.data.data);
            } catch (error) {
                console.error("Error fetching favourite books:", error);
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, []);

    return (
        <>
            {favouriteBooks.length === 0 && (
                <div className="text-5xl font-semibold text-zinc-500 flex flex-col items-center justify-center w-full h-[100%]">
                    <FaHeart className="mb-4" />
                    No Favourite Books
                </div>
            )}
            <div className='grid grid-cols-3 gap-4'>
                {favouriteBooks &&
                    favouriteBooks.map((items, i) => (
                        <div key={i}>
                            <BookCard data={items} favourite={true} />
                        </div>
                    ))}
            </div>
        </>
    );
};

export default Favourites;
