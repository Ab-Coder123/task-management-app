import { apiFetch } from './base';
import { User } from '../types';

export interface AuthResponse {
  user: User;
  token: string;
}

export const authApi = {
  register: (userData: Partial<User> & { password?: string }) => {
    return apiFetch<AuthResponse>('/api/auth/register', {
      method: 'POST',
      bodyData: userData,
    });
  },

  login: (credentials: { email?: string; username?: string; password?: string }) => {
    return apiFetch<AuthResponse>('/api/auth/login', {
      method: 'POST',
      bodyData: credentials,
    });
  },

  getAllUsers: () => {
    return apiFetch<User[]>('/api/auth/getusers', {
      method: 'GET',
    });
  },

  // Note: Backend has 'deleteusers_id=' naming bug for GetUser
  getUser: (id: string) => {
    return apiFetch<User>(`/api/auth/deleteusers_id=${id}`, {
      method: 'GET',
    });
  },

  updateUser: (id: string, userData: Partial<User>) => {
    return apiFetch<User>(`/api/auth/updateusers_id=${id}`, {
      method: 'PUT',
      bodyData: userData,
    });
  },

  deleteUser: (id: string) => {
    return apiFetch<{ message: string }>(`/api/auth/deleteusers_id=${id}`, {
      method: 'DELETE',
    });
  },
};
