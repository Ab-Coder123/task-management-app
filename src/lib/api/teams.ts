import { apiFetch } from './base';
import { Team } from '../types';

export interface CreateTeamPayload {
  name: string;
  departmentId: string;
  departmentName?: string;
  description?: string;
  leaderId?: string | null;
  assignAsMyTeam?: boolean;
}

export const teamsApi = {
  getTeams: async (departmentId?: string): Promise<Team[]> => {
    const query = departmentId ? `?departmentId=${encodeURIComponent(departmentId)}` : '';
    const res = await apiFetch<Team[] | { teams: Team[] }>(`/api/teams${query}`, {
      method: 'GET',
    });
    return Array.isArray(res) ? res : res.teams || [];
  },

  createTeam: async (payload: CreateTeamPayload): Promise<Team> => {
    const res = await apiFetch<{ team: Team; message?: string } | Team>('/api/teams', {
      method: 'POST',
      bodyData: payload,
    });
    return (res as any).team || (res as Team);
  },

  updateTeam: async (
    id: string,
    payload: Partial<Pick<Team, 'name' | 'description' | 'leaderId'>>
  ): Promise<Team> => {
    const res = await apiFetch<{ team: Team }>(`/api/teams/${id}`, {
      method: 'PUT',
      bodyData: payload,
    });
    return res.team;
  },

  deleteTeam: async (id: string): Promise<{ message: string }> => {
    return apiFetch<{ message: string }>(`/api/teams/${id}`, {
      method: 'DELETE',
    });
  },
};
