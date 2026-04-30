import { SportOption } from '@/types/domain/sports';
import { browserApiFetch } from '@/utils/api/browser';

export async function getSportsOptions(): Promise<SportOption[]> {
  return browserApiFetch<SportOption[]>({
    path: '/api/v2/catalog/sports',
    auth: false,
  });
}
