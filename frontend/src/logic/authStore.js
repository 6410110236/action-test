import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { loginAPI, fetchUserData, updateJwt } from './authLogic';

const useAuthStore = create(
  persist(
    (set, get) => ({
      isLoggedIn: false,
      user: null,
      jwt: null,
      role: null,
      loginError: null,
      isLoginPending: false,

      login: async (username, password, rememberMe) => {
        set({ isLoginPending: true, loginError: null });
        try {
            const data = await loginAPI(username, password);
            const fullUserData = await fetchUserData(data.jwt);
            updateJwt(data.jwt, fullUserData.role?.name, rememberMe);  // เก็บ role ตาม API ที่ส่งมา
          set({
            isLoggedIn: true,
            user: fullUserData,
            jwt: data.jwt,
            role: fullUserData.role?.name,  // ต้องเป็นชื่อ Role ตาม API
            isLoginPending: false,
          });

          return { success: true };
        } catch (error) {
          set({ loginError: error.message, isLoginPending: false });
          return { success: false, error };
        }
      },

      logout: () => {
        updateJwt(null, null, false);
        set({ isLoggedIn: false, user: null, jwt: null, role: null });  // ล้าง role ออกด้วย
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        isLoggedIn: state.isLoggedIn,
        user: state.user,
        jwt: state.jwt,
        role: state.role,
        loginError: state.loginError,
        isLoginPending: state.isLoginPending,
      }),
    }
  )
);

export default useAuthStore;
