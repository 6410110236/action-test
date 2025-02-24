import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCarStore = create(
  persist(
    (set) => ({
      cars: [], // เก็บข้อมูลรถทั้งหมด
      setCars: (data) => set({ cars: data }), // ฟังก์ชันสำหรับตั้งค่า cars
    }),
    { name: 'car-storage' } // เก็บข้อมูลใน LocalStorage
  )
);

export default useCarStore;
