import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { teamsApi, CreateTeamPayload } from '../api/teams';
import { Team } from '../types';

export function useTeams(departmentId?: string) {
  const queryClient = useQueryClient();

  const teamsQuery = useQuery({
    queryKey: ['teams', departmentId || 'all'],
    queryFn: () => teamsApi.getTeams(departmentId),
    staleTime: 30000,
    refetchOnWindowFocus: true,
  });

  const createTeamMutation = useMutation({
    mutationFn: (payload: CreateTeamPayload) => teamsApi.createTeam(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  const updateTeamMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Pick<Team, 'name' | 'description' | 'leaderId'>> }) =>
      teamsApi.updateTeam(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  const deleteTeamMutation = useMutation({
    mutationFn: (id: string) => teamsApi.deleteTeam(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  return {
    teams: teamsQuery.data || [],
    isLoading: teamsQuery.isLoading,
    isError: teamsQuery.isError,
    createTeam: createTeamMutation.mutateAsync,
    isCreatingTeam: createTeamMutation.isPending,
    updateTeam: updateTeamMutation.mutateAsync,
    isUpdatingTeam: updateTeamMutation.isPending,
    deleteTeam: deleteTeamMutation.mutateAsync,
    isDeletingTeam: deleteTeamMutation.isPending,
  };
}
