import axios from 'axios';

const getTokenAndUID = () => {
    const token = localStorage.getItem('token');
    const uid = localStorage.getItem('uid');
    return { token, uid };
};

const instance = axios.create({
    baseURL: 'https://pixelplex-backend-production.up.railway.app/',
    withCredentials: true,
});

instance.interceptors.request.use(
    (config) => {
        const { token, uid } = getTokenAndUID();
        if (token && uid) {
            config.headers['Authorization'] = token;
            config.headers['UID'] = uid;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
  
export default instance; 
