import { SportOption } from '@/types/domain/sports';
import { serverApiFetch } from '@/utils/api/server';

export async function getServerSportsOptions(): Promise<SportOption[]> {
  try {
    return await serverApiFetch<SportOption[]>({
      path: '/api/v2/catalog/sports',
      auth: false,
    });
  } catch (error) {
    console.error('Error fetching server sports from backend:', error);
    return [];
  }
}
