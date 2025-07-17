import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api';
import { useToast } from '../context/ToastContext';
import { LoadingOverlay } from '../components/Loading/Loading';

const SignUp = () => {
    const [values, setValues] = useState({
        username: "",
        email: "",
        password: "",
        address: "",
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { showSuccess, showError } = useToast();

    const change = (e) => {
        const { name, value } = e.target;
        setValues({ ...values, [name]: value });
    };

    const submit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            
            if (values.username === "" || values.email === "" || values.password === "" || values.address === "") {
                showError("All fields are required");
                setLoading(false);
                return;
            }

            const response = await API.post("/signup", values);
            showSuccess(response.data.msg);
            navigate("/login");
        } catch (error) {
            showError(error.response?.data?.msg || "Signup failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='min-h-screen bg-zinc-900 px-4 md:px-8 lg:px-12 py-6 md:py-8 flex flex-col'>
            {/* Simple Header */}
            <div className='mb-6 md:mb-8'>
                <Link to="/" className='flex items-center justify-center'>
                    <img className='h-8 md:h-10 me-2 md:me-4' src="https://cdn-icons-png.flaticon.com/128/10433/10433049.png" alt="logo" />
                    <h1 className='text-lg md:text-2xl font-semibold text-white'>BookHeaven</h1>
                </Link>
            </div>
            
            <div className='flex-1 flex items-center justify-center'>
                <div className='bg-zinc-800 rounded-lg px-4 md:px-6 lg:px-8 py-6 md:py-8 w-full max-w-md md:max-w-lg lg:max-w-xl'>
                <p className='text-zinc-200 text-xl md:text-2xl lg:text-3xl font-semibold text-center'>Sign Up</p>
                <div className='mt-4 md:mt-6'>
                    <label htmlFor="username" className='text-zinc-400 text-sm md:text-base'>
                        Username
                    </label>
                    <input
                        type="text"
                        className='w-full mt-2 bg-zinc-900 text-zinc-100 p-3 md:p-4 outline-none rounded text-sm md:text-base'
                        placeholder='Enter your username'
                        name='username'
                        required
                        value={values.username}
                        onChange={change}
                    />
                </div>
                <div className='mt-4 md:mt-6'>
                    <label htmlFor="email" className='text-zinc-400 text-sm md:text-base'>
                        Email
                    </label>
                    <input
                        type="email"
                        className='w-full mt-2 bg-zinc-900 text-zinc-100 p-3 md:p-4 outline-none rounded text-sm md:text-base'
                        placeholder='xyz@example.com'
                        name='email'
                        required
                        value={values.email}
                        onChange={change}
                    />
                </div>
                <div className='mt-4 md:mt-6'>
                    <label htmlFor="password" className='text-zinc-400 text-sm md:text-base'>
                        Password
                    </label>
                    <input
                        type="password"
                        className='w-full mt-2 bg-zinc-900 text-zinc-100 p-3 md:p-4 outline-none rounded text-sm md:text-base'
                        placeholder='Enter your password'
                        name='password'
                        required
                        value={values.password}
                        onChange={change}
                    />
                </div>
                <div className='mt-4 md:mt-6'>
                    <label htmlFor="address" className='text-zinc-400 text-sm md:text-base'>
                        Address
                    </label>
                    <textarea
                        className='w-full mt-2 bg-zinc-900 text-zinc-100 p-3 md:p-4 outline-none rounded text-sm md:text-base resize-none'
                        rows="4"
                        placeholder='Enter your address'
                        name='address'
                        required
                        value={values.address}
                        onChange={change}
                    />
                </div>
                <div className='mt-6 md:mt-8'>
                    <button
                        className='w-full bg-blue-500 text-white font-semibold py-3 md:py-4 rounded text-sm md:text-base hover:bg-blue-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed'
                        onClick={submit}
                        disabled={loading}
                    >
                        {loading ? "Signing up..." : "SignUp"}
                    </button>
                </div>
                <p className='flex mt-4 md:mt-6 items-center justify-center text-zinc-200 font-semibold text-sm md:text-base'>
                    Or
                </p>
                <p className='flex mt-4 items-center justify-center text-zinc-500 font-semibold text-sm md:text-base text-center'>
                    Already have an account? &nbsp;
                    <Link to="/login" className='hover:text-blue-500 underline'>
                        Login
                    </Link>
                </p>
                </div>
            </div>
        </div>
    );
};

export default SignUp
