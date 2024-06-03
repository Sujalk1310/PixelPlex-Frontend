import { useEffect, useState } from "react";
import { Skeleton } from 'primereact/skeleton';
import axios from "axios";
import { getAPI, postAPI } from "../axiosUrls";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Details = ({ movieId, onClose }) => {
    const [loader, setLoader] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const [playlists, setPlaylists] = useState([]);
    const [movie, setMovie] = useState(null);
    const [resp, setResp] = useState(true);
    const [newPlaylist, setNewPlaylist] = useState(false);
    const [newPlaylistName, setNewPlaylistName] = useState('');
    const [selected, setSelected] = useState('Select Playlist');

    const navigate = useNavigate();

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleImageError = (e) => {
        try {
            e.target.src = 'https://via.placeholder.com/300x400?text=No+Image';
        } catch (error) {
            toast.error(error.message);
        }
    };

    const selectHandler = (pname) => {
        setSelected(pname);
        setNewPlaylist(false);
        setIsOpen(false);
    };

    const addPlaylist = async () => {
        if (!newPlaylistName || newPlaylistName === '') {
            toast("Please provide a playlist name", {
                icon: '⚠️'
              });
            return;
        }
        try {
            const response = await postAPI("/playlist", { name: newPlaylistName });
            toast.success(response.message);
            setNewPlaylist(false);
            fetchPlaylist();
        } catch (error) {
            toast.error(error.message);
            if (error.statusCode === 401) navigate('/login');
        }
    }

    const addMovie = async () => {
        if (!selected || selected === 'Select Playlist' || selected === '') {
            toast("Please select a playlist", {
                icon: '⚠️'
              });
            return;
        }
        if (!movieId || movieId === '') {
            toast("Please select a movie", {
                icon: '⚠️'
              });
            return;
        }
        try {
            const response = await postAPI("/movie", { imdbID: movieId, playlistName: selected });
            toast.success(response.message);
        } catch (error) {
            toast.error(error.message);
            if (error.statusCode === 401) navigate('/login');
        }
    }

    const fetchPlaylist = async () => {
        try {
            const response = await getAPI("/playlist");
            setPlaylists(response.playlists);
            setResp(false); 
        } catch (error) {
            toast.error("Error fetching data: " + error.message);
            if (error.statusCode === 401) navigate('/login');
        }
    }

    const fetchMovie = async () => {
        if (!movieId) {
            toast("Please provide a movie imdbId", {
                icon: '⚠️'
              });
            return;
        }
        try {
            const response = await axios.get(`http://www.omdbapi.com/?apikey=463854ee&i=${movieId}`);
            if (response.data.Response === "True") {
                setMovie(response.data);
                setLoader(false);
            } else {
                setMovie(null);
            }
        } catch (error) {
            toast.error("Error fetching data: " + error.message);
        }
    };

    useEffect(() => {
        fetchMovie();
        fetchPlaylist();
    }, [])

    return (
        <div className="absolute flex justify-center pt-[30px] text-white bg-black/40 p-5 w-screen z-30 h-[1000px] left-0 top-[-150px]">
            <div className="shadow-2xl rounded-2xl w-[1200px] h-[650px] bg-zinc-800 bg-dot-white/[0.4] relative flex items-center justify-center">
            {resp ? (<div className="absolute w-[300px] top-2 left-10 z-10 flex gap-x-2 mt-5 justify-center items-center">
                    <div className="select-container flex flex-col items-center">
                        <Skeleton className="shadow-2xl bg-gray-300 mb-2" animation='wave' width="80%" borderRadius='10px' height="24px" />
                        <div className={`dropdown ${isOpen ? 'active' : ''}`}>
                            <Skeleton className="shadow-2xl bg-gray-300" animation='wave' borderRadius="2px" width="100%" height="40px" />
                        </div>
                    </div>
                    <div className="self-end">
                        <Skeleton className="shadow-2xl bg-gray-300" animation='wave' borderRadius="10px" width="40px" height="40px" />
                    </div>
                </div>) :
                (<div className="absolute w-[300px] z-20 top-2 left-10 z-10 flex gap-x-2 mt-5 justify-center items-center">
                    <div className="select-container">
                        <span className="choose">Add to playlist</span>
                        <div title="Select playlist" className={`dropdown ${isOpen ? 'active' : ''}`}>
                           <div className="select flex h-10 justify-between items-center" onClick={toggleDropdown}>
                                <span>{selected}</span>
                                <lord-icon
                                    src="https://cdn.lordicon.com/vduvxizq.json"
                                    trigger="hover"
                                    state="hover-ternd-flat-3"
                                    style={{ transform: "rotate(90deg)", width: "25px"}}
                                >
                                </lord-icon>
                            </div>
                            <input type="hidden" name="playlist" value={selected} />
                            {isOpen && (
                                <ul className="dropdown-menu overflow-y-auto">
                                    <li className="flex items-center">
                                        {newPlaylist ? (
                                            <div className="flex items-center w-full gap-x-2">
                                                <input type="text" onChange={(e) => setNewPlaylistName(e.target.value)} className="w-11/12 bg-transparent text-xl" />
                                                <lord-icon
                                                    src="https://cdn.lordicon.com/ktcdipjm.json"
                                                    trigger="hover"
                                                    stroke="bold"
                                                    style={{ width: "40px" }}
                                                    title="Create playlist"
                                                    onClick={() => {addPlaylist()}}
                                                >
                                                </lord-icon>
                                            </div>
                                        ) :
                                        (<div className="flex items-center gap-x-2 w-full"  onClick={() => {setNewPlaylist(true)}}>
                                            <lord-icon
                                                src="https://cdn.lordicon.com/zrkkrrpl.json"
                                                trigger="hover"
                                                stroke="bold"
                                                colors="primary:#121331,secondary:#000000"
                                            >
                                            </lord-icon>
                                            <p className="pt-1">Create Playlist</p>
                                        </div>)}
                                    </li>
                                    <hr className="w-[90%] mx-auto"/>
                                    {playlists.map(playlist => (
                                        <li key={playlist.id} onClick={() => selectHandler(playlist.name)}>
                                            {playlist.name}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                    <div className="self-end mb-[-5px] duration-200 hover:scale-125 active:scale-90" title="Add movie to playlist" onClick={() => addMovie()}>
                        <lord-icon
                            src="https://cdn.lordicon.com/jgnvfzqg.json"
                            trigger="hover"
                            colors="primary:#ffffff"
                        >
                        </lord-icon>
                    </div>
                </div>)}
                <div className="absolute top-10 shadow-xl flex bg-white p-2 rounded-xl right-10 z-10" onClick={onClose}>
                    <lord-icon
                        src="https://cdn.lordicon.com/zxvuvcnc.json"
                        trigger="hover"
                        state="hover-cross-2"
                    >
                    </lord-icon>
                </div>
                <div className="absolute rounded-2xl pointer-events-none inset-0 flex items-center justify-center bg-zinc-800 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
                <div className="flex flex-col w-full px-10 h-[500px] mt-[150px] pb-5 overflow-y-auto">
                    {loader ? (<div className="flex w-full gap-x-10">
                        <div>
                            <Skeleton className="shadow-2xl bg-gray-300" animation='wave' borderRadius='10px' width="300px" height="400px" />
                        </div>
                        <div className="flex flex-col gap-y-2 grow z-10">
                            <Skeleton className="shadow-2xl bg-gray-300" animation='wave' width="600px" borderRadius='10px' height="50px" />
                            <div className="text-lg gap-y-2 flex flex-col">
                                <div className="flex gap-x-4">
                                    <Skeleton className="shadow-2xl bg-gray-300" animation='wave' width="500px" borderRadius='10px' height="24px" />
                                </div>
                                <Skeleton className="shadow-2xl bg-gray-300" animation='wave' width="150px" borderRadius='10px' height="24px" />
                                <Skeleton className="shadow-2xl bg-gray-300" animation='wave' width="300px" borderRadius='10px' height="24px" />
                                <Skeleton className="shadow-2xl bg-gray-300" animation='wave' width="400px" borderRadius='10px' height="24px" />
                                <Skeleton className="shadow-2xl bg-gray-300" animation='wave' width="180px" borderRadius='10px' height="24px" />
                                <Skeleton className="shadow-2xl bg-gray-300 mt-4" animation='wave' width="100%" borderRadius='10px' height="24px" />
                                <Skeleton className="shadow-2xl bg-gray-300" animation='wave' width="300px" borderRadius='10px' height="24px" />
                                <Skeleton className="shadow-2xl bg-gray-300 mt-4" animation='wave' width="300px" borderRadius='10px' height="24px" />
                                <Skeleton className="shadow-2xl bg-gray-300" animation='wave' width="400px" borderRadius='10px' height="24px" />
                                <Skeleton className="shadow-2xl bg-gray-300" animation='wave' width="300px" borderRadius='10px' height="24px" />
                            </div>
                        </div>
                    </div>) :
                    (<div className="flex w-full gap-x-10">
                        <div className="z-10">
                            <img src={movie.Poster} alt="Hello" className="image min-w-[300px] h-[400px] rounded-xl" onError={handleImageError} />
                        </div>
                        <div className="flex flex-col grow w-[780px] z-10">
                            <p className="text-6xl font-bold truncate">{movie.Title}</p>
                            <div className="ml-1 text-lg flex flex-col">
                                <div className="flex gap-x-4">
                                    <p>{movie.Year}</p>
                                    <p>I</p>
                                    <p>{movie.Rated}</p>
                                    <p>I</p>
                                    <p>{movie.Runtime}</p>
                                    <p>I</p>
                                    <p>{movie.Type}</p>
                                    <p>I</p>
                                    <p>IMDB Rating: {movie.imdbRating}/10</p>
                                </div>
                                <p>{movie.Released}</p>
                                <p>Genre: {movie.Genre}</p>
                                <p>Language: {movie.Language}</p>
                                <p>{movie.Plot}</p>
                                <p className="mt-10">Director: {movie.Director}</p>
                                <p>Writer: {movie.Writer}</p>
                                <p>Actors: {movie.Actors}</p>
                                <p>Country: {movie.Country}</p>
                                <p>Awards: {movie.Awards}</p>
                            </div>
                        </div>
                    </div>)}
                </div>
            </div>
        </div>
    )
}

export default Details;