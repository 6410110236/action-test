import axios from "axios";
import conf from './main';

export const axData = {
    jwt: localStorage.getItem('jwt') || ""
};

const ax = axios.create({
    baseURL: conf.apiUrlPrefix, // ใช้ค่า apiUrlPrefix จาก conf
    withCredentials: true,
});

// Add request interceptor
ax.interceptors.request.use(function (config) {
    if (axData.jwt && config.url !== conf.loginEndpoint) {
        config.headers['Authorization'] = `Bearer ${axData.jwt}`;
        console.log('Adding Authorization header:', config.headers['Authorization'],'BaseURL is: ',ax);
    }
    console.log('Sending request to:', config.url);
    console.log('Request config:', config);
    return config;
}, function (error) {
    console.error('Request error:', error);
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