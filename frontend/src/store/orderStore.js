import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useOrderStore = create(
  persist(
    (set) => ({
      orders: [], // เก็บข้อมูลการขายรถ
      addOrder: (order) => set((state) => ({ orders: [...state.orders, order] })),
      removeOrder: (id) =>
        set((state) => ({ orders: state.orders.filter((order) => order.id !== id) })),
      clearOrders: () => set({ orders: [] }),
    }),
    { name: 'order-storage' } // เก็บข้อมูลใน LocalStorage
  )
);

export default useOrderStore;
