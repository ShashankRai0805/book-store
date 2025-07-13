import React, { useEffect, useState } from 'react';
import API from '../api';
import Loader from '../components/Loader/Loader';

const Settings = () => {
    const [value, setValue] = useState({ address: "" });
    const [profileData, setProfileData] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            try {
                setLoading(true);
                const response = await API.get("/get-user-information");
                setProfileData(response.data);
                setValue({ address: response.data.address });
            } catch (error) {
                console.error("Error fetching user information:", error);
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, []);

    const change = (e) => {
        const { name, value: val } = e.target;
        setValue({ ...value, [name]: val });
    };

    const submitAddress = async () => {
        try {
            const response = await API.put("/update-address", value);
            alert(response.data.msg);
        } catch (error) {
            console.error("Error updating address:", error);
            alert("Failed to update address");
        }
    };

    return (
        <>
            {loading && (
                <div className="w-full h-[100%] flex items-center justify-center">
                    <Loader />
                </div>
            )}
            {!loading && (
                <div className='h-[100%] p-0 md:p-4 text-zinc-100'>
                    <h1 className='text-3xl md:text-5xl font-semibold text-zinc-500 mb-8'>
                        Settings
                    </h1>
                    <div className='flex gap-12'>
                        <div className=''>
                            <label htmlFor="">Username</label>
                            <p className='p-2 rounded bg-zinc-800 mt-2 font-semibold'>
                                {profileData.username}
                            </p>
                        </div>
                        <div className=''>
                            <label htmlFor="">Email</label>
                            <p className='p-2 rounded bg-zinc-800 mt-2 font-semibold'>
                                {profileData.email}
                            </p>
                        </div>
                    </div>
                    <div className='mt-4 flex flex-col'>
                        <label htmlFor="">Address</label>
                        <textarea
                            className='p-2 rounded bg-zinc-800 mt-2 font-semibold'
                            rows="5"
                            placeholder='Address'
                            name='address'
                            value={value.address}
                            onChange={change}
                        />
                    </div>
                    <div className='mt-4 flex justify-end'>
                        <button
                            className='bg-yellow-500 text-zinc-900 font-semibold px-3 py-2 rounded hover:bg-yellow-400 transition-all duration-300'
                            onClick={submitAddress}
                        >
                            Update
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default Settings;
