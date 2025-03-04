import { persist } from 'zustand/middleware';

/**
 * ฟังก์ชันสำหรับเพิ่ม persist ให้กับ Zustand Store
 * @param {Function} store - Zustand Store ที่ต้องการให้มี Persist
 * @param {string} name - ชื่อ key ที่จะใช้เก็บใน LocalStorage
 * @returns Zustand Store ที่มี Persist Middleware
 */
const persistMiddleware = (store, name) => {
  return persist(store, {
    name, // Key ที่ใช้ใน LocalStorage
    getStorage: () => localStorage, // ใช้ LocalStorage (หรือจะเปลี่ยนเป็น sessionStorage ก็ได้)
  });
};

export default persistMiddleware;
