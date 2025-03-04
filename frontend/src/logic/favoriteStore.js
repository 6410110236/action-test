import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useFavoriteStore = create(
  persist(
    (set) => ({
      favoriteItems: [],
      addToFavorites: (item) => set((state) => ({ favoriteItems: [...state.favoriteItems, item] })),
      removeFromFavorites: (id) =>
        set((state) => ({
          favoriteItems: state.favoriteItems.filter((item) => item.id !== id),
        })),
      clearFavorites: () => set({ favoriteItems: [] }),
    }),
    { name: 'favorite-storage' }
  )
);

export default useFavoriteStore;
