import { useEffect, useState } from "react";
import Skeletons from './Skeletons';
import axios from "axios";
import { getAPI, postAPI } from "../axiosUrls";
import DetailsSub from './DetailsSub';    
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

const List = () => {
    const [loader, setLoader] = useState(true);
    const [movies, setMovies] = useState([]);
    const [showDetails, setShowDetails] = useState(false);
    const [selected, setSelected] = useState(null);
    const [playlistDetails, setPlaylistsDetails] = useState(null);
    const [change, setChange] = useState(false);

    const navigate = useNavigate();
    const { puid } = useParams();

    const fetchPlaylistDetails = async () => {
        try {
            const response = await getAPI(`/info/${puid}`);
            setPlaylistsDetails(response);
        } catch (error) {
            toast.error("Invalid Playlist ID.");
            if (error.statusCode === 401) navigate('/login');
            navigate('/dashboard');
        }
    }

    const handleImageError = (e) => {
        try {
            e.target.src = 'https://via.placeholder.com/300x400?text=No+Image';
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleDelete = async (imdbID) => {
        if (!puid || puid === '' || !imdbID || imdbID === '') {
            toast("Please provide a PlaylistID and imdbID", {
                icon: '⚠️'
              });
            return;
        }
        try {
            const response = await postAPI("/remove", { puid, imdbID });
            toast.success(response.message);
            fetchMovies();
        } catch (error) {
            toast.error(error.message);
            if (error.statusCode === 401) navigate('/login');
        }
    }

    const handleOpen = (movieId) => {  
        setSelected(movieId);
        setShowDetails(true);
    }

    const handleClose = () => {  
        setShowDetails(false);
        setSelected(null);
    }

    const changePrivate = async () => {
        if (!change) {
            setChange(true);
        } else return;
        if (!puid || puid === '') {
            toast("Please provide a playlist imdbID", {
                icon: '⚠️'
              });
            return;
        }
        try {
            const response = await postAPI(`/change`, { puid });
            toast.success(response.message);
            setChange(false);
            fetchPlaylistDetails();
        } catch (error) {
            toast.error("Error fetching data: " + error.message);
            if (error.statusCode === 401) navigate('/login');
        }
    }

    const fetchMovies = async () => {
        setLoader(true);
        try {
            const response = await getAPI(`/list/${puid}`);
            if (!response.allow) {
                toast.error("This playlist is private.")
                navigate('/dashboard');
                return;
            }
            const imdbIDs = response.movies;
            if (imdbIDs) {
                const moviePromises = imdbIDs.map(imdb =>
                    axios.get(`https://www.omdbapi.com/?i=${imdb.imdbID}&apikey=463854ee`)
                );
                const movieResponses = await Promise.all(moviePromises);
                const moviesData = movieResponses.map(res => res.data);
                setMovies(moviesData);
            }
            setLoader(false);
        } catch (error) {
            toast.error("Error fetching data: " + error.message);
            if (error.statusCode === 401) navigate('/login');
        }
    }

    const handleShare = () => {
        navigator.clipboard.writeText(location.href);
        toast.success("Copied to clipboard");
    }

    useEffect(() => {
        fetchPlaylistDetails();
        fetchMovies();
    }, [])

    return (
        <>
        {showDetails ? <DetailsSub movieId={selected} onClose={handleClose} /> : <></>}
        <div className="absolute flex justify-center pt-[30px] text-white bg-black/40 p-5 w-screen z-20 h-[1000px] left-0 top-[-10px]">
            <div className="shadow-2xl rounded-2xl w-[1200px] h-[650px] bg-zinc-800 bg-dot-white/[0.4] relative flex items-end justify-center">
                <div className="absolute top-10 shadow-xl flex bg-white p-2 rounded-xl right-10 z-10" onClick={() => navigate(-1)}>
                    <lord-icon
                        src="https://cdn.lordicon.com/zxvuvcnc.json"
                        trigger="hover"
                        state="hover-cross-2"
                    >
                    </lord-icon>
                </div>
                {playlistDetails ? <div className="absolute top-12 z-10 max-w-72 truncate left-16 text-6xl">{playlistDetails.pname}</div> : <></>}
                {(playlistDetails && playlistDetails.user === localStorage.getItem("id")) ? (<div onClick={() => changePrivate(puid)} className='absolute top-8 z-10 right-28 hover:cursor-pointer flex px-2 py-2 hover:scale-110 active:scale-90 bg-white duration-200 rounded-3xl border shadow-2xl flex-col justify-center items-center'>   
                    <p className="text-black">Private</p>
                    <input
                        type="checkbox"
                        className="checkbox"
                        checked={playlistDetails.private}
                    />
                </div>) : <></>}
                {(playlistDetails && !playlistDetails.private && playlistDetails.user === localStorage.getItem("id")) ? (<div onClick={() => handleShare()} className='absolute top-[38px] z-10 right-[200px] hover:cursor-pointer flex px-2 py-2 hover:scale-110 active:scale-90 bg-white duration-200 rounded-xl border shadow-2xl flex-col justify-center items-center'>   
                <lord-icon
                    src="https://cdn.lordicon.com/boyoxams.json"
                    trigger="hover"
                >   
                </lord-icon>
                </div>) : <></>}
                <div className="absolute rounded-2xl pointer-events-none inset-0 flex items-center justify-center bg-zinc-800 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
                <div style={{ width: "1200px", height: "500px" }} className="relative gap-8 flex flex-wrap overflow-y-auto rounded-3xl items-start shadow-3xl px-10">
                {loader ? (
                    <div className="flex gap-x-5 flex-wrap">    
                        <Skeletons />
                    </div>
                    ) : (
                        movies.length === 0 ? (
                            <p className='text-3xl self-center mx-auto'>'No movies found.'</p>
                        ) : (
                            movies.map(movie => (
                                <div key={movie.imdbID} className='hover:scale-105 hover:cursor-pointer duration-200 container w-48 mb-5 h-56'>
                                    <img src={movie.Poster} alt={movie.Title} className="image w-48 h-56 rounded-xl" onError={handleImageError} />
                                    <div className="middle gap-y-5 justify-center items-center flex flex-col">
                                        <lord-icon
                                            src="https://cdn.lordicon.com/ipnwkgdy.json"
                                            trigger="hover"
                                            colors="primary:#ffffff"
                                            onClick={() => handleOpen(movie.imdbID)}
                                        >
                                        </lord-icon>
                                        {(playlistDetails.user === localStorage.getItem("id")) ?
                                        (<lord-icon
                                            src="https://cdn.lordicon.com/skkahier.json"
                                            trigger="hover"
                                            colors="primary:#e83a30"
                                            onClick={() => handleDelete(movie.imdbID)}
                                        >
                                        </lord-icon>) : <></>}
                                    </div>
                                    <p className='pt-2 text-lg truncate text-center'>{movie.Title}</p>
                                </div>
                            ))
                        )
                    )}
                </div>
            </div>
        </div>
        </>
    )
}

export default List;