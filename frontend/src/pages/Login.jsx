import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import API from '../api';
import { login } from '../store/auth';

const Login = () => {
    const [values, setValues] = useState({
        username: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const change = (e) => {
        const { name, value } = e.target;
        setValues({ ...values, [name]: value });
    };

    const submit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            
            if (values.username === "" || values.password === "") {
                alert("All fields are required");
                setLoading(false);
                return;
            }

            const response = await API.post("/login", values);
            
            localStorage.setItem("id", response.data.id);
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("role", response.data.role);
            
            dispatch(login({
                role: response.data.role,
                token: response.data.token,
                user: { id: response.data.id }
            }));
            
            navigate("/profile");
        } catch (error) {
            alert(error.response?.data?.msg || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='min-h-screen bg-zinc-900 px-4 md:px-8 lg:px-12 py-6 md:py-8 flex items-center justify-center'>
            <div className='bg-zinc-800 rounded-lg px-4 md:px-6 lg:px-8 py-6 md:py-8 w-full max-w-md md:max-w-lg lg:max-w-xl'>
                <p className='text-zinc-200 text-xl md:text-2xl lg:text-3xl font-semibold text-center'>Login</p>
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
                <div className='mt-6 md:mt-8'>
                    <button
                        className='w-full bg-blue-500 text-white font-semibold py-3 md:py-4 rounded text-sm md:text-base hover:bg-blue-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed'
                        onClick={submit}
                        disabled={loading}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </div>
                <p className='flex mt-4 md:mt-6 items-center justify-center text-zinc-200 font-semibold text-sm md:text-base'>
                    Or
                </p>
                <p className='flex mt-4 items-center justify-center text-zinc-500 font-semibold text-sm md:text-base text-center'>
                    Don't have an account? &nbsp;
                    <Link to="/signup" className='hover:text-blue-500 underline'>
                        SignUp
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login
