// Users API placeholder

import { apiFetch } from './base';
import { User } from '../types';

export const usersApi = {
    getUsers: () => {
        return apiFetch<User[]>('/api/auth/getusers', {
            method: 'GET',
        });
    },

    getUser: (id: string) => {
        return apiFetch<User>(`/api/auth/getusers_id=${id}`, {
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

