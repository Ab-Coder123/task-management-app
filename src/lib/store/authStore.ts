import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User } from '../types';
import { normalizeRole } from '../auth/permissions';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (user: User, token: string) => void;
  updateUserStatus: (status: User['status']) => void;
  updateUser: (updatedUser: Partial<User>) => void;
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
        if (!user) return;
        const effectiveStatus = user.status || (user.isVerified ? 'approved' : 'pending');
        const canonicalRole = normalizeRole(user.role);
        const normalizedUser = {
          ...user,
          _id: user._id || (user as any).id,
          role: canonicalRole,
          status: effectiveStatus,
        };
        set({ user: normalizedUser, token, isAuthenticated: true, isLoading: false });
        if (typeof window !== 'undefined') {
          document.cookie = `auth-token=${token || ''}; path=/; max-age=604800; SameSite=Lax`;
          document.cookie = `user-role=${canonicalRole}; path=/; max-age=604800; SameSite=Lax`;
          document.cookie = `user-status=${effectiveStatus}; path=/; max-age=604800; SameSite=Lax`;
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
      updateUser: (updatedUser) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updatedUser, _id: updatedUser._id || (updatedUser as any).id || state.user._id } : null,
        })),
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

// Rehydrate store on the client side immediately to restore login session on refresh
if (typeof window !== 'undefined') {
  useAuthStore.persist.rehydrate();
  const state = useAuthStore.getState();
  if (state.token && state.user && !document.cookie.split('; ').some((c) => c.startsWith('auth-token='))) {
    const effectiveStatus = state.user.status || (state.user.isVerified ? 'approved' : 'pending');
    const canonicalRole = normalizeRole(state.user.role);
    document.cookie = `auth-token=${state.token}; path=/; max-age=604800; SameSite=Lax`;
    document.cookie = `user-role=${canonicalRole}; path=/; max-age=604800; SameSite=Lax`;
    document.cookie = `user-status=${effectiveStatus}; path=/; max-age=604800; SameSite=Lax`;
  }
}
