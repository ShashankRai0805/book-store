import React, { useState } from 'react';
import API from '../api';

const AddBook = () => {
    const [data, setData] = useState({
        url: "",
        title: "",
        author: "",
        price: "",
        desc: "",
        language: "",
    });

    const change = (e) => {
        const { name, value } = e.target;
        setData({ ...data, [name]: value });
    };

    const submit = async () => {
        try {
            if (data.url === "" || data.title === "" || data.author === "" || data.price === "" || data.desc === "" || data.language === "") {
                alert("All fields are required");
                return;
            }

            const response = await API.post("/add-book", data);
            setData({
                url: "",
                title: "",
                author: "",
                price: "",
                desc: "",
                language: "",
            });
            alert(response.data.msg);
        } catch (error) {
            alert(error.response?.data?.msg || "Failed to add book");
        }
    };

    return (
        <div className='h-[100%] p-0 md:p-4'>
            <h1 className='text-3xl md:text-5xl font-semibold text-zinc-500 mb-8'>
                Add Book
            </h1>
            <div className='p-4 bg-zinc-800 rounded'>
                <div className=''>
                    <label htmlFor="" className='text-zinc-400'>
                        Image URL
                    </label>
                    <input
                        type="text"
                        className='w-full mt-2 bg-zinc-900 text-zinc-100 p-2 outline-none'
                        placeholder='URL of image'
                        name='url'
                        required
                        value={data.url}
                        onChange={change}
                    />
                </div>
                <div className='mt-4'>
                    <label htmlFor="" className='text-zinc-400'>
                        Title of book
                    </label>
                    <input
                        type="text"
                        className='w-full mt-2 bg-zinc-900 text-zinc-100 p-2 outline-none'
                        placeholder='title of book'
                        name='title'
                        required
                        value={data.title}
                        onChange={change}
                    />
                </div>
                <div className='mt-4'>
                    <label htmlFor="" className='text-zinc-400'>
                        Author of book
                    </label>
                    <input
                        type="text"
                        className='w-full mt-2 bg-zinc-900 text-zinc-100 p-2 outline-none'
                        placeholder='author of book'
                        name='author'
                        required
                        value={data.author}
                        onChange={change}
                    />
                </div>
                <div className='mt-4 flex gap-4'>
                    <div className='w-3/6'>
                        <label htmlFor="" className='text-zinc-400'>
                            Language
                        </label>
                        <input
                            type="text"
                            className='w-full mt-2 bg-zinc-900 text-zinc-100 p-2 outline-none'
                            placeholder='language of book'
                            name='language'
                            required
                            value={data.language}
                            onChange={change}
                        />
                    </div>
                    <div className='w-3/6'>
                        <label htmlFor="" className='text-zinc-400'>
                            Price
                        </label>
                        <input
                            type="number"
                            className='w-full mt-2 bg-zinc-900 text-zinc-100 p-2 outline-none'
                            placeholder='price of book'
                            name='price'
                            required
                            value={data.price}
                            onChange={change}
                        />
                    </div>
                </div>
                <div className='mt-4'>
                    <label htmlFor="" className='text-zinc-400'>
                        Description of book
                    </label>
                    <textarea
                        className='w-full mt-2 bg-zinc-900 text-zinc-100 p-2 outline-none'
                        rows="5"
                        placeholder='description of book'
                        name='desc'
                        required
                        value={data.desc}
                        onChange={change}
                    />
                </div>
                <button
                    className='mt-4 px-3 bg-blue-500 text-white font-semibold py-2 rounded hover:bg-blue-600 transition-all duration-300'
                    onClick={submit}
                >
                    Add Book
                </button>
            </div>
        </div>
    );
};

export default AddBook;
