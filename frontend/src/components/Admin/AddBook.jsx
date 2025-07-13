import React, { useState } from 'react';
import API from '../../api';

const AddBook = () => {
    const [formData, setFormData] = useState({
        url: '',
        title: '',
        author: '',
        price: '',
        desc: '',
        language: ''
    });
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validation
        if (!formData.url || !formData.title || !formData.author || !formData.price || !formData.desc || !formData.language) {
            alert('Please fill all fields');
            return;
        }

        try {
            setLoading(true);
            await API.post('/add-book', formData);
            alert('Book added successfully!');
            
            // Reset form
            setFormData({
                url: '',
                title: '',
                author: '',
                price: '',
                desc: '',
                language: ''
            });
        } catch (error) {
            console.error('Error adding book:', error);
            alert(error.response?.data?.msg || 'Failed to add book');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2 className="text-xl md:text-2xl font-bold text-white mb-4 md:mb-6">Add New Book</h2>
            
            <form onSubmit={handleSubmit} className="max-w-4xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div>
                        <label className="block text-zinc-300 mb-2 text-sm md:text-base">Book Title *</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            className="w-full bg-zinc-600 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                            placeholder="Enter book title"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-zinc-300 mb-2 text-sm md:text-base">Author *</label>
                        <input
                            type="text"
                            name="author"
                            value={formData.author}
                            onChange={handleInputChange}
                            className="w-full bg-zinc-600 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                            placeholder="Enter author name"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-zinc-300 mb-2 text-sm md:text-base">Price (₹) *</label>
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleInputChange}
                            step="0.01"
                            min="0"
                            className="w-full bg-zinc-600 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                            placeholder="0.00"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-zinc-300 mb-2 text-sm md:text-base">Language *</label>
                        <input
                            type="text"
                            name="language"
                            value={formData.language}
                            onChange={handleInputChange}
                            className="w-full bg-zinc-600 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                            placeholder="e.g., English, Spanish, French"
                            required
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-zinc-300 mb-2 text-sm md:text-base">Book Cover Image URL *</label>
                        <input
                            type="url"
                            name="url"
                            value={formData.url}
                            onChange={handleInputChange}
                            className="w-full bg-zinc-600 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                            placeholder="https://example.com/book-cover.jpg"
                            required
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-zinc-300 mb-2 text-sm md:text-base">Description *</label>
                        <textarea
                            name="desc"
                            value={formData.desc}
                            onChange={handleInputChange}
                            rows="4"
                            className="w-full bg-zinc-600 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base resize-none"
                            placeholder="Enter book description..."
                            required
                        />
                    </div>
                </div>

                {/* Preview */}
                {formData.url && (
                    <div className="mt-4 md:mt-6 p-4 bg-zinc-700 rounded-lg">
                        <h3 className="text-base md:text-lg font-semibold text-white mb-3">Preview</h3>
                        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                            <img
                                src={formData.url}
                                alt="Book preview"
                                className="w-20 h-28 sm:w-24 sm:h-32 object-cover rounded mx-auto sm:mx-0"
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                }}
                            />
                            <div className="text-center sm:text-left">
                                <h4 className="text-white font-semibold text-sm md:text-base">{formData.title || 'Book Title'}</h4>
                                <p className="text-zinc-300 text-sm">by {formData.author || 'Author Name'}</p>
                                <p className="text-green-400 font-semibold text-sm md:text-base">₹{formData.price || '0.00'}</p>
                                <p className="text-zinc-300 text-sm">Language: {formData.language || 'Language'}</p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="mt-4 md:mt-6 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-3 rounded-lg font-semibold transition-colors text-sm md:text-base"
                    >
                        {loading ? 'Adding Book...' : 'Add Book'}
                    </button>
                    
                    <button
                        type="button"
                        onClick={() => setFormData({
                            url: '',
                            title: '',
                            author: '',
                            price: '',
                            desc: '',
                            language: ''
                        })}
                        className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors text-sm md:text-base"
                    >
                        Clear Form
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddBook;
