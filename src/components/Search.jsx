import React, { useState } from 'react';
import Skeletons from "./Skeletons";
import axios from 'axios';
import toast from 'react-hot-toast';
import Details from './Details';

const Search = () => {
    const [title, setTitle] = useState('');
    const [year, setYear] = useState('');
    const [showDetails, setShowDetails] = useState(false);
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [scroller, setScroller] = useState(false);
    const [searched, setSearched] = useState(false);

    const handleOpen = (movieId) => {  
        setSelectedId(movieId);
        setShowDetails(true);
    }

    const handleClose = () => {  
        setShowDetails(false);
        setSelectedId(null);
    }

    const fetchMovies = async () => {
        if (!title) {
            toast("Please provide a movie title", {
                icon: '⚠️'
              });
            return;
        }
        setLoading(true);
        setSearched(true);
        try {
            const response = await axios.get(`https://www.omdbapi.com/?apikey=463854ee&s=${title}&y=${year}`);
            if (response.data.Response === "True") {
                setMovies(response.data.Search);
                setScroller(true);
            } else {
                setMovies([]);
            }
        } catch (error) {
            toast.error("Error fetching data: " + error.message);
        }
        setLoading(false);
    };

    const handleImageError = (e) => {
        try {
            e.target.src = 'https://via.placeholder.com/200x300?text=No+Image';
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <>  
        {showDetails ? <Details movieId={selectedId} onClose={handleClose} /> : <></>}
        <div className="px-4 mt-5 flex flex-col items-center justify-center">
            {scroller ? <div className="scroll absolute bg-white bottom-5 right-20"></div> : <></>}
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
                <div className="px-5 py-3 border rounded-3xl bg-white shadow-2xl">
                    <input 
                        type="number" 
                        name="year" 
                        placeholder="Year" 
                        pattern="[0-9]{4}" 
                        className="text-center bg-white text-3xl" 
                        style={{ width: "150px" }}
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                    />
                </div>
                <div>
                    <button 
                        style={{ fontSize: "26px" }} 
                        className="hover:cursor-pointer flex items-center justify-center gap-x-4 px-3 bg-white duration-200 py-2 rounded-3xl border shadow-2xl"
                        onClick={fetchMovies}
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
                    movies.length === 0 ? (
                        <p className='text-3xl'>{ searched ? 'No movies found.' : 'Search for a movie.' }</p>
                    ) : (
                        movies.map(movie => (
                            <div key={movie.imdbID} className='hover:scale-105 hover:cursor-pointer duration-200 container w-48 mb-5 h-56' onClick={() => handleOpen(movie.imdbID)}>
                                <img src={movie.Poster} alt={movie.Title} className="image w-48 h-56 rounded-xl" onError={handleImageError} />
                                <div className="middle">
                                    <lord-icon
                                        src="https://cdn.lordicon.com/ipnwkgdy.json"
                                        trigger="hover"
                                        colors="primary:#ffffff"
                                    >
                                    </lord-icon>
                                </div>
                                <p className='pt-2 text-lg truncate text-center'>{movie.Title}</p>
                              </div>
                        ))
                    )
                )}
            </div>
        </div>
        </>
    );
}

export default Search;
