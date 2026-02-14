import { getUserUsernamesV2 } from '@/services/users.service';
import { useQuery } from '@tanstack/react-query';

export const useGetUsersUsernames = (userIds: string[]) => {
  return useQuery({
    queryKey: ['usersUsernames', userIds],
    queryFn: () => getUserUsernamesV2(userIds),
    enabled: userIds.length > 0,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
