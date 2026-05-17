import { PredictionsClient } from '@/components/predictions/PredictionsClient';
import { getServerCurrentUser } from '@/services/server/auth.service';
import { getServerPredictionsFeed } from '@/services/server/predictions.service';
import { SearchParams } from '@/types/domain/search-params';
import {
  getStatusBucket,
  groupBySportAndLeague,
} from '@/utils/domain/events';
import {
  parsePredictionsFilters,
} from '@/utils/domain/filterParams';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Quinisindic | Predicciones',
  description: 'Explora predicciones de la comunidad separadas por deporte y liga.',
};

type Props = {
  searchParams: SearchParams;
};

export default async function PredictionsPage({ searchParams }: Props) {
  const filters = parsePredictionsFilters(await searchParams);
  const [user, rows] = await Promise.all([
    getServerCurrentUser(),
    getServerPredictionsFeed(),
  ]);

  const canShowMine = !!user?.id;

  let filteredRows = rows;
  if (filters.view === 'mine') {
    filteredRows = user?.id ? rows.filter((row) => row.userId === user.id) : [];
  } else if (user?.id) {
    filteredRows = rows.filter((row) => row.userId !== user.id);
  }

  if (filters.status !== 'all') {
    filteredRows = filteredRows.filter(
      (row) => getStatusBucket(row.matchStatus) === filters.status,
    );
  }

  const groups = groupBySportAndLeague(filteredRows, filters.sort);

  return (
    <PredictionsClient
      groups={groups}
      filters={filters}
      canShowMine={canShowMine}
    />
  );
}
