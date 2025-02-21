import axios from "axios";
import conf from './main';

export const axData = {
    jwt: localStorage.getItem('jwt') || ""
};

const ax = axios.create({
    baseURL: conf.apiUrlPrefix,
    withCredentials: false, // Change to false if CORS is an issue
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add request interceptor for debugging
ax.interceptors.request.use(function (config) {
    if (axData.jwt && config.url !== conf.loginEndpoint) {
        config.headers['Authorization'] = `Bearer ${axData.jwt}`;
    }
    console.log('Request URL:', `${config.baseURL}${config.url}`);
    return config;
}, function (error) {
    return Promise.reject(error);
});

// Add response interceptor
ax.interceptors.response.use(function (response) {
    console.log('Received response:', response);
    return response;
}, function (error) {
    console.error('Response error:', error);
    return Promise.reject(error);
});

export default ax;