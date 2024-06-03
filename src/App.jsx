import './App.css';
import BackgroundGradientAnimation from './components/ui/background-gradient-animation';
import { useEffect, useState } from 'react';
import { Route, BrowserRouter as Router, Routes, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Registration from './components/Registration';
import Preloader from './components/Preloader';
import List from './components/List';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

function App() {
  const [loader, setLoader] = useState(true);
  
  useEffect(() => {
    const timeout = setTimeout(() => setLoader(false), 5000);
    return (() => clearTimeout(timeout));
  }, []);

  return (
    <>
      { loader ? <Preloader /> : <></> }
      <Toaster position="top-right" reverseOrder={true} />
        <BackgroundGradientAnimation>
          <Router>
            <div className="absolute z-40 inset-0 flex items-start justify-center ml-7 mt-7 text-white font-bold px-4 pointer-events-none text-3xl text-center md:text-4xl lg:text-7xl">
              <p className="brand p-5 text-white drop-shadow-2xl">
                PixelPlex
              </p>
            </div>
            <Routes>
              <Route element={<Registration />} path="/register" />
              <Route element={<Login />} path="/login" />
              <Route element={<Dashboard />} path="/dashboard" />
              <Route element={<List />} path="/dashboard/:puid" />
              <Route element={<Navigate to="/dashboard" />} path="/dashboard/*" />
              <Route element={<Navigate to="/login" />} path="/" />
              <Route element={<Navigate to="/dashboard" />} path="*" />
            </Routes>
          </Router>
        </BackgroundGradientAnimation>
    </>
  );
}

export default App;
