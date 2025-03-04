import axios from "axios";
import conf from "./main";
import useAuthStore from "../logic/authStore"; // เปลี่ยนจาก useStore เป็น authStore โดยตรง

// สร้างอินสแตนซ์ axios พร้อมการตั้งค่าเริ่มต้น
const ax = axios.create({
    baseURL: conf.apiUrlPrefix,
    withCredentials: true, // ถ้า API ต้องการ credentials
    headers: {
        "Content-Type": "application/json",
    },
});

// เพิ่ม request interceptor
ax.interceptors.request.use(
    (config) => {
        try {
            const jwt = useAuthStore.getState()?.jwt; // ตรวจสอบก่อนดึงค่า jwt
            if (jwt && config.url !== conf.loginEndpoint) {
                config.headers.Authorization = `Bearer ${jwt}`;
            }
            console.log("🔹 Request URL:", `${config.baseURL}${config.url}`);
        } catch (error) {
            console.error("❌ Axios Interceptor Error (Request):", error);
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// เพิ่ม response interceptor
ax.interceptors.response.use(
    (response) => {
        console.log("✅ Received response:", response);
        return response;
    },
    (error) => {
        console.error("❌ Response error:", error);

        // ถ้า Token หมดอายุ ให้ทำการ Logout
        if (error.response?.status === 401) {
            console.warn("🔄 JWT Expired, Logging out...");
            useAuthStore.getState()?.logout(); // ใช้ logout จาก Zustand
        }

        return Promise.reject(error);
    }
);

export default ax;
