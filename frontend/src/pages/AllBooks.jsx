import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import API from '../api';
import BookCard from '../components/BookCard/BookCard';
import Loader from '../components/Loader/Loader';
import { setAllBooks, clearSearch } from '../store/search';

const AllBooks = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const dispatch = useDispatch();
    const { query, filteredBooks, isSearching } = useSelector((state) => state.search);
    
    // Determine what books to display
    const booksToDisplay = isSearching ? filteredBooks : data;
    
    console.log('AllBooks - isSearching:', isSearching, 'query:', query, 'filteredBooks:', filteredBooks.length, 'data:', data.length);

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                setLoading(true);
                const response = await API.get("/get-all-books");
                console.log('Fetched books in AllBooks:', response.data.data);
                setData(response.data.data);
                dispatch(setAllBooks(response.data.data));
                console.log('Books set in Redux store from AllBooks');
            } catch (error) {
                console.error("Error fetching books:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBooks();
    }, [dispatch]);

    return (
        <div className='bg-zinc-900 px-4 md:px-8 lg:px-12 min-h-screen py-4 md:py-8'>
            <div className="flex items-center justify-between mb-6">
                <h4 className='text-2xl md:text-3xl text-yellow-100'>
                    {isSearching ? (
                        <>Search Results for "{query}" ({booksToDisplay.length} found)</>
                    ) : (
                        'All Books'
                    )}
                </h4>
                {isSearching && (
                    <button
                        onClick={() => dispatch(clearSearch())}
                        className='text-blue-400 hover:text-blue-300 text-sm md:text-base underline'
                    >
                        Clear Search
                    </button>
                )}
            </div>
            
            {loading ? (
                <div className="flex items-center justify-center my-8 min-h-[50vh]">
                    <Loader />
                </div>
            ) : (
                <div className='my-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 auto-rows-fr'>
                    {booksToDisplay && booksToDisplay.length > 0 ? (
                        booksToDisplay.map((items, i) => (
                            <div key={items._id || i} className="w-full h-full">
                                <BookCard data={items} />
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center text-zinc-400 py-12">
                            {isSearching ? (
                                <div>
                                    <p className="text-xl md:text-2xl mb-4">No books found for "{query}"</p>
                                    <p className="text-lg mb-4">Try searching with different keywords</p>
                                    <button
                                        onClick={() => dispatch(clearSearch())}
                                        className='bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors'
                                    >
                                        View All Books
                                    </button>
                                </div>
                            ) : (
                                <p className="text-xl md:text-2xl">No books available</p>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AllBooks
