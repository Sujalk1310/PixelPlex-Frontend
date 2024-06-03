import axios from 'axios';

const getTokenAndUID = () => {
    const token = localStorage.getItem('token');
    const uid = localStorage.getItem('uid');
    return { token, uid };
};

const instance = axios.create({
    baseURL: 'http://192.168.29.114:8000/',
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