import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import Skeletons from './Skeletons';
import { useNavigate } from 'react-router-dom';
import { getAPI, postAPI } from '../axiosUrls';

const Playlist = () => {
    const [title, setTitle] = useState('');
    const [playlists, setPlaylists] = useState([]);
    const [loading, setLoading] = useState(false);
    const [global, setGlobal] = useState(false);

    const navigate = useNavigate();

    const fetchPlaylist = async () => {
        setLoading(true);
        try {
            const response = await getAPI(`/playlist?name=${title}&g=${global}`);
            setPlaylists(response.playlists);
        } catch (error) {
            toast.error("Error fetching data: " + error.message);
            if (error.statusCode === 401) navigate('/login');
        }
        setLoading(false);
    };

    const handleDelete = async (puid) => {
        if (!puid || puid === '') {
            toast("Please provide a playlist imdbID", {
                icon: '⚠️'
              });
            return;
        }
        try {
            const response = await postAPI("/delete", { puid });
            toast.success(response.message);
            fetchPlaylist();
        } catch (error) {
            toast.error(error.message);
            if (error.statusCode === 401) navigate('/login');
        }
    }

    const handleImageError = (e) => {
        try {
            e.target.src = 'https://via.placeholder.com/200x300?text=No+Image';
        } catch (error) {
            toast.error(error.message);
        }
    };

    useEffect(() => {
        fetchPlaylist();
    }, [])

    return (
        <>
        <div className="px-4 mt-5 flex flex-col items-center justify-center">
            {(playlists.length > 5) ? <div className="scroll absolute bg-white bottom-5 right-20"></div> : <></>}
            <div className="flex justify-center gap-x-5 backdrop-blur-3xl border p-5 rounded-3xl">
                <div className="px-5 py-3 border rounded-3xl bg-white shadow-2xl">
                    <input 
                        type="text" 
                        name="title" 
                        placeholder="Enter title, name, genre" 
                        className="bg-white text-3xl" 
                        style={{ width: "600px" }} 
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required 
                    />
                </div>
                <div onClick={() => {setGlobal(!global)}} className='hover:cursor-pointer flex px-3 hover:scale-105 active:scale-90 bg-white duration-200 rounded-3xl border shadow-2xl flex-col justify-center items-center'>   
                    <p>Global</p>
                    <input
                        type="checkbox"
                        className="checkbox"
                        checked={global}
                    />
                </div>
                <div>
                    <button 
                        style={{ fontSize: "26px" }} 
                        className="hover:cursor-pointer hover:scale-105 active:scale-90 flex items-center justify-center gap-x-4 px-3 bg-white duration-200 py-2 rounded-3xl border shadow-2xl"
                        onClick={fetchPlaylist}
                    >
                        <lord-icon
                            src="https://cdn.lordicon.com/unukghxb.json"
                            trigger="hover"
                            stroke="bold"
                            style={{ height: "42px", width: "50px" }}
                        >   
                        </lord-icon>
                    </button>
                </div>
            </div>
            <div style={{ width: "1200px", height: "300px" }} className="relative gap-8 flex flex-wrap overflow-y-auto py-8 mt-5 bg-white/80 rounded-3xl items-center shadow-3xl justify-center">
                {loading ? (
                    <Skeletons />
                ) : (
                    playlists.length === 0 ? (
                        <p className='text-3xl'>No playlist found.</p>
                    ) : (
                        playlists.map(playlist => (
                            <div key={playlist.puid} className='hover:scale-105 hover:cursor-pointer duration-200 container w-48 mb-5 h-56'>
                                <img src={playlist.image} alt={playlist.name} className="image w-48 h-56 rounded-xl object-cover" onError={handleImageError} />
                                <div className="middle gap-y-5 justify-center items-center flex flex-col">
                                    <lord-icon
                                        src="https://cdn.lordicon.com/ipnwkgdy.json"
                                        trigger="hover"
                                        colors="primary:#ffffff"
                                        onClick={() => navigate(`/dashboard/${playlist.puid}`)}
                                    >
                                    </lord-icon>
                                    {(playlist.user === localStorage.getItem("id")) ?
                                    (<lord-icon
                                        src="https://cdn.lordicon.com/skkahier.json"
                                        trigger="hover"
                                        colors="primary:#e83a30"
                                        onClick={() => handleDelete(playlist.puid)}
                                    >
                                    </lord-icon>) : <></>}
                                </div>
                                <p className='pt-2 text-lg truncate text-center'>{playlist.name}</p>
                              </div>
                        ))
                    )
                )}
            </div>
        </div>
        </>
    );
}

export default Playlist;