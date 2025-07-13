import React, { useState, useEffect } from 'react';
import API from '../../api';
import { FaEdit, FaTrash, FaEye } from 'react-icons/fa';

const BookManagement = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingBook, setEditingBook] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        author: '',
        price: '',
        desc: '',
        language: ''
    });

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        try {
            setLoading(true);
            const response = await API.get('/get-all-books');
            setBooks(response.data.data);
        } catch (error) {
            console.error('Error fetching books:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (book) => {
        setEditingBook(book._id);
        setFormData({
            title: book.title,
            author: book.author,
            price: book.price,
            desc: book.desc,
            language: book.language
        });
    };

    const handleUpdate = async (bookId) => {
        try {
            await API.put(`/update-book/${bookId}`, formData);
            setBooks(books.map(book => 
                book._id === bookId ? { ...book, ...formData } : book
            ));
            setEditingBook(null);
            alert('Book updated successfully!');
        } catch (error) {
            console.error('Error updating book:', error);
            alert('Failed to update book');
        }
    };

    const handleDelete = async (bookId) => {
        if (window.confirm('Are you sure you want to delete this book?')) {
            try {
                await API.delete(`/delete-book/${bookId}`);
                setBooks(books.filter(book => book._id !== bookId));
                alert('Book deleted successfully!');
            } catch (error) {
                console.error('Error deleting book:', error);
                alert('Failed to delete book');
            }
        }
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-white">Loading books...</div>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-6">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-4 md:mb-6">Book Management</h2>
            
            <div className="grid gap-4 md:gap-6">
                {books.map((book) => (
                    <div key={book._id} className="bg-zinc-700 rounded-lg p-4 md:p-6">
                        {editingBook === book._id ? (
                            // Edit Mode
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-zinc-300 mb-2 text-sm font-medium">Title</label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        className="w-full bg-zinc-600 text-white p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-zinc-300 mb-2 text-sm font-medium">Author</label>
                                    <input
                                        type="text"
                                        name="author"
                                        value={formData.author}
                                        onChange={handleInputChange}
                                        className="w-full bg-zinc-600 text-white p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-zinc-300 mb-2 text-sm font-medium">Price</label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleInputChange}
                                        className="w-full bg-zinc-600 text-white p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-zinc-300 mb-2 text-sm font-medium">Language</label>
                                    <input
                                        type="text"
                                        name="language"
                                        value={formData.language}
                                        onChange={handleInputChange}
                                        className="w-full bg-zinc-600 text-white p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-zinc-300 mb-2 text-sm font-medium">Description</label>
                                    <textarea
                                        name="desc"
                                        value={formData.desc}
                                        onChange={handleInputChange}
                                        rows="4"
                                        className="w-full bg-zinc-600 text-white p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical leading-relaxed"
                                        placeholder="Enter detailed book description..."
                                        style={{ wordWrap: 'break-word', overflowWrap: 'break-word' }}
                                    />
                                    <p className="text-zinc-500 text-xs mt-1">
                                        {formData.desc?.length || 0} characters
                                    </p>
                                </div>
                                <div className="md:col-span-2 flex flex-col sm:flex-row gap-3 sm:gap-4">
                                    <button
                                        onClick={() => handleUpdate(book._id)}
                                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded transition-colors duration-200 font-medium"
                                    >
                                        Save Changes
                                    </button>
                                    <button
                                        onClick={() => setEditingBook(null)}
                                        className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded transition-colors duration-200 font-medium"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            // View Mode - Fixed Layout Structure
                            <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                                {/* Main Content Area */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex flex-col sm:flex-row gap-4">
                                        {/* Book Image */}
                                        <div className="flex-shrink-0">
                                            <img
                                                src={book.url}
                                                alt={book.title}
                                                className="w-20 h-28 sm:w-24 sm:h-32 object-cover rounded shadow-md mx-auto sm:mx-0"
                                            />
                                        </div>
                                        
                                        {/* Book Details */}
                                        <div className="flex-1 min-w-0 space-y-2">
                                            <h3 className="text-lg sm:text-xl font-bold text-white break-words">
                                                {book.title}
                                            </h3>
                                            <p className="text-zinc-300 text-sm sm:text-base">
                                                by <span className="font-medium">{book.author}</span>
                                            </p>
                                            <p className="text-green-400 font-semibold text-lg">
                                                ₹{book.price}
                                            </p>
                                            <p className="text-zinc-300 text-sm">
                                                Language: <span className="font-medium">{book.language}</span>
                                            </p>
                                        </div>
                                    </div>
                                    
                                    {/* Description - Full Width Usage */}
                                    <div className="mt-4 pt-3 border-t border-zinc-600">
                                        <h4 className="text-zinc-300 font-medium mb-2 text-sm">Description:</h4>
                                        <div className="text-zinc-400 text-sm leading-relaxed">
                                            <p className="break-words whitespace-pre-wrap overflow-hidden">
                                                {book.desc && book.desc.length > 200 
                                                    ? `${book.desc.substring(0, 200)}...` 
                                                    : book.desc
                                                }
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Action Buttons - Fixed Position */}
                                <div className="flex lg:flex-col gap-2 flex-shrink-0 lg:ml-4">
                                    <button
                                        onClick={() => handleEdit(book)}
                                        className="bg-blue-600 hover:bg-blue-700 text-white p-2 lg:p-3 rounded transition-colors duration-200 flex items-center justify-center min-w-[40px] min-h-[40px]"
                                        title="Edit Book"
                                    >
                                        <FaEdit className="text-sm lg:text-base" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(book._id)}
                                        className="bg-red-600 hover:bg-red-700 text-white p-2 lg:p-3 rounded transition-colors duration-200 flex items-center justify-center min-w-[40px] min-h-[40px]"
                                        title="Delete Book"
                                    >
                                        <FaTrash className="text-sm lg:text-base" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )                )}
                
                {books.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-zinc-400 text-lg">No books found</p>
                        <p className="text-zinc-500 text-sm mt-2">Add some books to get started</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookManagement;
