import useAuthStore from './authStore';
import useFavoriteStore from './favoriteStore';
import useOrderStore from './orderStore';

const useStore = () => ({
  auth: useAuthStore(),  // ต้องเรียกฟังก์ชัน () เพื่อให้ Zustand store ทำงาน
  favorite: useFavoriteStore(),
  orders: useOrderStore(),
});

export default useStore;
