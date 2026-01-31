import { getUserUsernames } from '@/services/users.service';
import { useQuery } from '@tanstack/react-query';

export const useGetUsersUsernames = (userIds: string[]) => {
  return useQuery({
    queryKey: ['usersUsernames', userIds],
    queryFn: () => getUserUsernames(userIds),
    enabled: userIds.length > 0,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
