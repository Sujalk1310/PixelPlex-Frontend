import TypewriterEffectSmooth from "./ui/typewriter-effect";
import { Grid } from "react-loader-spinner";

const Preloader = () => {
    const words = [
        { text: "Your" },
        { text: "Movie" },
        { text: "Playlist" },
        { text: "Maker" }
    ];

    return (
        <div id="preloader" className="absolute w-screen h-screen z-40">
            <div className="h-[50rem] w-full bg-transparent bg-dot-white/[0.5] relative flex items-center justify-center">
                <div style={{ backgroundColor: "rgb(0, 17, 82)" }} className="absolute pointer-events-none inset-0 flex items-center justify-center [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
                <div className="flex items-center flex-col justify-center px-2 md:px-10 py-4 w-full h-full">
                    <div className="flex flex-col sm:flex-row items-center gap-4 mt-6">
                        <Grid color="white" />
                    </div>
                    <p className="text-white text-sm md:text-2xl max-w-xl mt-6 text-center">
                        <TypewriterEffectSmooth words={words} />
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Preloader;
