import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import API from '../api';
import Loader from '../components/Loader/Loader';
import Sidebar from '../components/Profile/Sidebar';
import MobileNav from '../components/Profile/MobileNav';

const Profile = () => {
    const [profile, setProfile] = useState({});
    const [loading, setLoading] = useState(true);
    const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

    useEffect(() => {
        const fetch = async () => {
            try {
                setLoading(true);
                const response = await API.get("/get-user-information");
                setProfile(response.data);
            } catch (error) {
                console.error("Error fetching user information:", error);
            } finally {
                setLoading(false);
            }
        };
        
        if (isLoggedIn) {
            fetch();
        }
    }, [isLoggedIn]);

    return (
        <div className='bg-zinc-900 px-4 md:px-8 lg:px-12 flex flex-col md:flex-row py-4 md:py-6 lg:py-8 text-white min-h-screen'>
            {loading ? (
                <div className="w-full h-[70vh] flex items-center justify-center">
                    <Loader />
                </div>
            ) : (
                <>
                    <div className='w-full md:w-1/6 h-auto lg:h-screen mb-4 md:mb-0'>
                        <Sidebar data={profile} />
                        <MobileNav />
                    </div>
                    <div className='w-full md:w-5/6 md:pl-4 lg:pl-6'>
                        <Outlet />
                    </div>
                </>
            )}
        </div>
    );
};

export default Profile
