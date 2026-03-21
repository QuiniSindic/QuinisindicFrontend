import { SportOption } from '@/types/domain/sports';
import { createClient } from '@/utils/supabase/server';
import { toSpanishSportName } from '@/utils/ui/sportName';

const toSportSlug = (name: string) => name.trim().toLowerCase().replace(/\s+/g, '-');

export async function getServerSportsOptions(): Promise<SportOption[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('sports')
    .select('id, name')
    .order('id', { ascending: true });

  if (error) {
    console.error('Error fetching server sports:', error);
    return [];
  }

  return ((data ?? []) as Array<{ id: number; name: string }>).map((sport) => ({
    id: sport.id,
    name: sport.name,
    slug: toSportSlug(sport.name),
    displayName: toSpanishSportName(sport.name),
  }));
}
