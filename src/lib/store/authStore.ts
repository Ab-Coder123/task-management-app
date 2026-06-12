import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (user: User, token: string) => void;
  updateUserStatus: (status: User['status']) => void;
  logout: () => void;
  setLoading: (isLoading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      setAuth: (user, token) => {
        set({ user, token, isAuthenticated: true, isLoading: false });
        if (typeof window !== 'undefined') {
          document.cookie = `auth-token=${token}; path=/; max-age=604800; SameSite=Lax`;
          document.cookie = `user-role=${user.role}; path=/; max-age=604800; SameSite=Lax`;
          document.cookie = `user-status=${user.status}; path=/; max-age=604800; SameSite=Lax`;
        }
      },
      updateUserStatus: (status) =>
        set((state) => {
          if (typeof window !== 'undefined') {
            document.cookie = `user-status=${status}; path=/; max-age=604800; SameSite=Lax`;
          }
          return {
            user: state.user ? { ...state.user, status } : null,
          };
        }),
      logout: () => {
        set({ user: null, token: null, isAuthenticated: false, isLoading: false });
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth-storage');
          document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
          document.cookie = 'user-role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
          document.cookie = 'user-status=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        }
      },
      setLoading: (isLoading) => set({ isLoading }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      // Skip hydration during SSR to prevent hydration errors in Next.js
      skipHydration: true,
    }
  )
);
