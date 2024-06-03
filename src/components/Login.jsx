import { useState, useEffect, useContext } from 'react';
import FlipWords from "./ui/flip-words";
import Marquee from "react-fast-marquee";
import { ThreeDots } from "react-loader-spinner";
import { AuthContext } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import { postAPI } from "../axiosUrls";
import toast from "react-hot-toast";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [sender, setSender] = useState(false);

    const { setToken } = useContext(AuthContext);

    const navigate = useNavigate();

    useEffect(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('uid');
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!username || !password) {
            toast("Please fill the fields correctly.", {
                icon: '⚠️'
            });
            return;
        }

        if (sender) return;
        else setSender(true);

        try {
            const response = await postAPI("/login", {
                username,
                password,
            });

            setToken(response.token);
            localStorage.setItem("token", response.token);
            localStorage.setItem("uid", response.uid);
            localStorage.setItem("id", response.id);

            toast.success(response.message);
            navigate("/dashboard");

        } catch (error) {
            toast.error(error.message);
            setSender(false);
            setUsername("");
            setPassword("");
        }
    }

    const handleSwitch = (e) => {
        e.preventDefault();
        navigate("/register");
    }

    const words = ["ACTION", "DRAMA", "COMEDY", "HORROR"];
    const posters = [
        "https://www.washingtonpost.com/graphics/2019/entertainment/oscar-nominees-movie-poster-design/img/black-panther-web.jpg",
        "https://i.etsystatic.com/18242346/r/il/fd61f8/2933715225/il_570xN.2933715225_a913.jpg",
        "https://images-cdn.ubuy.co.in/634eff3dd353f87b78610b7d-black-widow-marvel-movie-poster.jpg",
        "https://images-cdn.ubuy.co.in/63ef0a397f1d781bea0a2464-star-wars-rogue-one-movie-poster.jpg",
        "https://www.tallengestore.com/cdn/shop/products/WALL_E-HollywoodAnimationClassicMoviePoster_a662ea32-fb06-436a-b19f-5da4dc7c1d69.jpg?v=1591603123",
        "https://rukminim2.flixcart.com/image/850/1000/jf8khow0/poster/a/u/h/small-hollywood-movie-poster-blade-runner-2049-ridley-scott-original-imaf3qvx88xenydd.jpeg?q=20&crop=false"
    ]

    return (
        <>
            <div className="absolute px-12 flex top-44 z-10">
                <div className="h-[40rem] px-4 flex w-screen justify-between">
                    <div className="flex flex-col" style={{ width: "700px" }}>
                        <div className="text-4xl p-5 border rounded-3xl shadow-2xl backdrop-blur-3xl flex flex-col text-white font-normal">
                            <p className="px-5 pt-3">WELCOME BACK!</p>
                            <p className="flex px-5 pb-2">WHAT'S THE MOOD? <FlipWords words={words} /></p>
                        </div>
                        <div className="text-4xl p-5 mt-5 border rounded-3xl shadow-2xl backdrop-blur-3xl flex flex-col text-white font-normal px-5 rounded">
                            <Marquee style={{ borderRadius: "10px" }}>
                                {posters.map((url, index) => (
                                    <div key={index} className="w-44 pr-5 drop-shadow-lg rounded">
                                        <img className="rounded-md" loading="lazy" src={url} alt={`Image ${index + 1}`} />
                                    </div>
                                ))}
                            </Marquee>
                        </div>
                    </div>
                    <div className="flex flex-col mx-auto" style={{ width: "500px" }}>
                        <div className="justify-center items-center w-full text-4xl p-5 border rounded-3xl shadow-2xl backdrop-blur-3xl flex flex-col text-white font-normal">
                            <h1>Login</h1>
                        </div>
                        <div className="justify-center mt-5 items-center w-full text-4xl p-5 border rounded-3xl shadow-2xl backdrop-blur-3xl flex flex-col text-white font-normal">
                            <form className="flex flex-col items-center gap-y-5" onSubmit={handleSubmit}>
                                <div className='px-10'>
                                    <label htmlFor="username" style={{ fontSize: "26px" }} className="self-start">Username</label>
                                    <input name="username" value={username} id="username" onChange={(e) => setUsername(e.target.value)} type="text" placeholder="Enter username" className="border-b-2 w-full bg-transparent" />
                                </div>
                                <div className='px-10'>
                                    <label htmlFor="password" style={{ fontSize: "26px" }} className="self-start">Password</label>
                                    <input name="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Enter password" className="border-b-2 w-full bg-transparent" />
                                </div>
                                <button style={{ fontSize: "26px" }} disabled={sender} className={`hover:scale-110 active:scale-90 flex items-center justify-center gap-x-4 px-5 duration-200 py-2 rounded-xl border shadow-lg ${sender ? 'bg-gray-500 text-gray-300 cursor-not-allowed' : 'hover:bg-white hover:text-black bg-transparent text-white'}`}>
                                    Submit
                                    {sender && <ThreeDots color="white" width="20" height="20" />}
                                </button>
                                <p className='text-sm'>New User? <button onClick={handleSwitch} className='underline'>Register</button></p>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Login;
