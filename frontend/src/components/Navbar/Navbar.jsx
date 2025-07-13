import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaGripLines, FaSearch, FaTimes } from "react-icons/fa";
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/auth';
import { performSearch, clearSearch, setAllBooks } from '../../store/search';
import API from '../../api';

const Navbar = () => {
    const [MobileNav, setMobileNav] = useState("hidden");
    const [searchValue, setSearchValue] = useState("");
    
    const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
    const role = useSelector((state) => state.auth.role);
    const { query } = useSelector((state) => state.search);
    
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Handle search input change (just update local state, don't filter yet)
    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchValue(value);
    };

    // Handle search submit (Enter key or search icon)
    const handleSearchSubmit = () => {
        if (searchValue.trim()) {
            console.log('Performing search for:', searchValue.trim());
            // Ensure we have books before searching
            dispatch(performSearch(searchValue.trim()));
            setMobileNav("hidden"); // Close mobile nav if open
            navigate('/all-books');
        }
    };

    // Handle Enter key press
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearchSubmit();
        }
    };

    // Clear search
    const handleClearSearch = () => {
        console.log('Clearing search...');
        setSearchValue("");
        dispatch(clearSearch());
        // If we're on the all-books page, it will automatically show all books
        // because isSearching will be false
    };

    const links = [
        {
            title: "Home",
            link: "/"
        },
        {
            title: "All Books",
            link: "/all-books"
        },
        {
            title: "Cart",
            link: "/cart"
        },
        {
            title: "Profile",
            link: "/profile"
        },
    ];

    // Add admin link if user is admin
    if (isLoggedIn && role === "admin") {
        links.push({
            title: "Admin Dashboard",
            link: "/admin"
        });
    }

    const handleLogout = () => {
        dispatch(logout());
        localStorage.removeItem("id");
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        navigate("/");
    };

    if (isLoggedIn === false) {
        links.splice(2, 2);
    }

    return (
        <>
            <nav className='z-50 relative flex items-center justify-between bg-zinc-800 text-white px-4 md:px-8 py-4'>
                <Link to="/" className='flex items-center'>
                    <img className='h-8 md:h-10 me-2 md:me-4' src="https://cdn-icons-png.flaticon.com/128/10433/10433049.png" alt="logo" />
                    <h1 className='text-lg md:text-2xl font-semibold'>BookHeaven</h1>
                </Link>
                
                {/* Search Bar - Desktop */}
                <div className='hidden md:block relative mx-4 flex-1 max-w-md'>
                    <div className='relative'>
                        <input
                            type="text"
                            placeholder="Search books, authors..."
                            value={searchValue}
                            onChange={handleSearchChange}
                            onKeyPress={handleKeyPress}
                            className='w-full bg-zinc-700 text-white px-4 py-2 pr-20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all'
                        />
                        <div className='absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1'>
                            {searchValue && (
                                <button
                                    onClick={handleClearSearch}
                                    className='text-zinc-400 hover:text-white transition-colors p-1'
                                    title="Clear search"
                                >
                                    <FaTimes className='text-sm' />
                                </button>
                            )}
                            <button
                                onClick={handleSearchSubmit}
                                className='text-zinc-400 hover:text-white transition-colors p-1'
                                title="Search"
                            >
                                <FaSearch className='text-sm' />
                            </button>
                        </div>
                    </div>
                </div>
                
                <div className='nav-links-bookStore flex items-center gap-4'>
                    <div className='hidden md:flex gap-4'>
                        {links.map((items, i) => (
                            <Link to={items.link} className="hover:text-blue-500 transition-all duration-300" key={i}>
                                {items.title}
                            </Link>
                        ))}
                    </div>
                    
                    <div className='hidden md:flex gap-2 lg:gap-4'>
                        {!isLoggedIn && (
                            <>
                                <Link to="/login" className='px-2 lg:px-4 py-1 border border-blue-500 rounded hover:bg-white hover:text-zinc-800 transition-all duration-300 text-sm lg:text-base'>
                                    LogIn
                                </Link>
                                <Link to="/signup" className='px-2 lg:px-4 py-1 bg-blue-500 rounded hover:bg-white hover:text-zinc-800 transition-all duration-300 text-sm lg:text-base'>
                                    SignUp
                                </Link>
                            </>
                        )}
                        {isLoggedIn && (
                            <button onClick={handleLogout} className='px-2 lg:px-4 py-1 bg-red-500 rounded hover:bg-white hover:text-zinc-800 transition-all duration-300 text-sm lg:text-base'>
                                LogOut
                            </button>
                        )}
                    </div>
                    
                    <button className='text-white text-xl md:text-2xl hover:text-zinc-400 md:hidden' onClick={() => setMobileNav(MobileNav === "hidden" ? "block" : "hidden")}>
                        <FaGripLines />
                    </button>
                </div>
            </nav>
            
            <div className={`${MobileNav} bg-zinc-800 h-screen absolute top-0 left-0 w-full z-40 flex flex-col items-center justify-center`}>
                <div className='w-full flex items-center justify-between px-4 md:px-8 py-4'>
                    <Link to="/" className='flex items-center'>
                        <img className='h-8 md:h-10 me-2 md:me-4' src="https://cdn-icons-png.flaticon.com/128/10433/10433049.png" alt="logo" />
                        <h1 className='text-lg md:text-2xl font-semibold text-white'>BookHeaven</h1>
                    </Link>
                    <button className='text-white text-xl md:text-2xl hover:text-zinc-400' onClick={() => setMobileNav("hidden")}>
                        <FaTimes />
                    </button>
                </div>
                
                {/* Mobile Search Bar */}
                <div className='w-full px-4 mb-6'>
                    <div className='relative'>
                        <input
                            type="text"
                            placeholder="Search books, authors..."
                            value={searchValue}
                            onChange={handleSearchChange}
                            onKeyPress={handleKeyPress}
                            className='w-full bg-zinc-700 text-white px-4 py-3 pr-20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                        />
                        <div className='absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2'>
                            {searchValue && (
                                <button
                                    onClick={handleClearSearch}
                                    className='text-zinc-400 hover:text-white transition-colors'
                                    title="Clear search"
                                >
                                    <FaTimes />
                                </button>
                            )}
                            <button
                                onClick={handleSearchSubmit}
                                className='text-zinc-400 hover:text-white transition-colors'
                                title="Search"
                            >
                                <FaSearch />
                            </button>
                        </div>
                    </div>
                </div>
                
                <div className='flex flex-col gap-4 mt-4 px-4'>
                    {links.map((items, i) => (
                        <Link 
                            to={items.link} 
                            className="hover:text-blue-500 transition-all duration-300 text-white text-lg md:text-xl font-semibold text-center" 
                            key={i}
                            onClick={() => setMobileNav("hidden")}
                        >
                            {items.title}
                        </Link>
                    ))}
                </div>
                
                <div className='flex flex-col gap-4 mt-8 px-4 w-full max-w-xs'>
                    {!isLoggedIn && (
                        <>
                            <Link 
                                to="/login" 
                                className='px-6 py-2 border border-blue-500 rounded hover:bg-white hover:text-zinc-800 transition-all duration-300 text-white text-lg font-semibold text-center'
                                onClick={() => setMobileNav("hidden")}
                            >
                                LogIn
                            </Link>
                            <Link 
                                to="/signup" 
                                className='px-6 py-2 bg-blue-500 rounded hover:bg-white hover:text-zinc-800 transition-all duration-300 text-white text-lg font-semibold text-center'
                                onClick={() => setMobileNav("hidden")}
                            >
                                SignUp
                            </Link>
                        </>
                    )}
                    {isLoggedIn && (
                        <button 
                            onClick={() => {
                                handleLogout();
                                setMobileNav("hidden");
                            }} 
                            className='px-6 py-2 bg-red-500 rounded hover:bg-white hover:text-zinc-800 transition-all duration-300 text-white text-lg font-semibold'
                        >
                            LogOut
                        </button>
                    )}
                </div>
            </div>
        </>
    )
}

export default Navbar
