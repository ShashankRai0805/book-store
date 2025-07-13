import React, { useEffect, useState } from 'react';
import API from '../../api';
import BookCard from '../BookCard/BookCard';
import Loader from '../Loader/Loader';

const RecentlyAdded = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            try {
                setLoading(true);
                const response = await API.get("/get-recent-books");
                setData(response.data.data);
            } catch (error) {
                console.error("Error fetching recent books:", error);
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, []);

    return (
        <div className='mt-8 px-4'>
            <h4 className='text-3xl text-yellow-100'>Recently Added Books</h4>
            {loading ? (
                <div className="flex items-center justify-center my-8">
                    <Loader />
                </div>
            ) : (
                <div className='my-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
                    {data && data.map((items, i) => (
                        <div key={i}>
                            <BookCard data={items} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default RecentlyAdded;
