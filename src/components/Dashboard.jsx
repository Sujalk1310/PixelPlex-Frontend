import { useState, useContext, useEffect } from 'react';
import Search from './Search';
import Playlist from './Playlist';
import { AuthContext } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import { getAPI, postAPI } from '../axiosUrls';
import toast from 'react-hot-toast';

const Dashboard = () => {
    const { token, loading } = useContext(AuthContext);
    const [tab, setTab] = useState('s');
    const [username, setUsername] = useState('');

    const navigate = useNavigate();

    const fetchName = async () => {
        try {
            const response = await getAPI("/name");
            setUsername(response.username);
        } catch (error) {
            toast.error("Error fetching data: " + error.message);
            if (error.statusCode === 401) navigate('/login');
        }
    }

    const handleLogout = async () => {
        try {
            const response = await postAPI("/logout");
            toast.success(response.message);
        } catch (error) {
            toast.error("Error fetching data: " + error.message);
        }
        navigate('/login');
    }

    useEffect(() => {
        fetchName();
    }, [])

    if (loading) return null;
    if (!token) navigate('/login');

    return ( 
        <>
            {(token && username && username !== '') ? 
            <div className='flex absolute items-center gap-x-2 top-10 w-full left-10 z-10'>
                <div className='border-4 max-w-[300px] shadow-xl border-black bg-white rounded-2xl'>
                    <p className='py-1 pl-2 pr-3 flex items-center text-3xl'>
                    <lord-icon
                        src="https://cdn.lordicon.com/bjbmvfnr.json"
                        trigger="hover"
                        stroke="bold"
                        style={{ borderRadius: "10px", border: "2px solid black", minWidth: "32px" }}
                    >
                    </lord-icon>
                        <p className='ml-2 mt-1 truncate'>{username}</p>
                    </p>
                </div>
                <div title="Logout" onClick={() => handleLogout()} className='hover:scale-110 active:scale-90 duration-100 border-4 max-w-[300px] shadow-xl bg-red-500 rounded-2xl'>
                    <p className='py-2 px-2 flex items-center text-3xl'>
                        <img loading='lazy' width="32px" src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/OOjs_UI_icon_logOut-ltr-invert.svg/1200px-OOjs_UI_icon_logOut-ltr-invert.svg.png" />
                    </p>
                </div>
                <div title="Project repo link" onClick={() => location.href="https://github.com/Sujalk1310/PixelPlex"} className='w-[65px] h-[60px] hover:scale-110 active:scale-90 duration-100 border-4 max-w-[300px] shadow-xl border-black bg-white rounded-2xl'>
                    <p className='py-1 px-2 flex items-center text-3xl'>
                        <img loading='lazy' width="45px" src="https://www.pngmart.com/files/23/Github-Logo-PNG-File.png" />
                    </p>
                </div>
                <div className='arrow-box px-4 py-2 ml-5 duration-200 shadow-xl border-black bg-white'>
                    Project Repo!
                </div>
            </div> : <></>}
            <div className="absolute px-12 flex flex-col top-36 z-10 w-full">
                <div className="flex gap-x-8 text-3xl justify-center text-white">
                    <button onClick={() => setTab('s')} className={`${(tab == 's') ? 'underline underline-offset-8' : ''} hover:backdrop-blur-3xl hover:shadow-2xl hover:border-white border-2 border-transparent px-5 py-3 rounded-3xl duration-200`}>Search</button>
                    <button onClick={() => setTab('p')} className={`${(tab == 'p') ? 'underline underline-offset-8' : ''} hover:backdrop-blur-3xl hover:shadow-2xl hover:border-white border-2 border-transparent px-5 py-3 rounded-3xl duration-200`}>Playlists</button>
                </div>
                {(tab == 's') ? <Search /> : <Playlist />}
            </div>
        </>
    )
}

export default Dashboard;   
