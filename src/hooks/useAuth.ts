import { getMeV2 } from '@/services/auth.service';
import { useQuery } from '@tanstack/react-query';

export const useAuth = () => {
  return useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const response = await getMeV2();

      if (!response.ok) {
        console.error('Error al obtener el usuario:', response.error);
        return null;
      }

      const data = response.data;

      if (data === null) {
        console.warn('No user data found');
        return null;
      }

      return data;
    },
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
};
