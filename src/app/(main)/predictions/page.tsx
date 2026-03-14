import {
  getServerCurrentUser,
  getServerPredictionsFeed,
} from '@/services/server/pageData.service';
import { SearchParams } from '@/types/domain/search-params';
import { formatKickoff } from '@/utils/common/date';
import {
  getResultDisplay,
  getStatusBucket,
  getStatusLabel,
  groupBySportAndLeague,
} from '@/utils/domain/events';
import {
  buildPredictionsSearchParams,
  parsePredictionsFilters,
} from '@/utils/domain/filterParams';
import { ChevronDown } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';

// TODO: Learn SEO
export const metadata: Metadata = {
  title: 'Quinisindic | Predicciones',
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

  const withFilters = (
    patch: Partial<typeof filters>,
    fallbackPath = '/predictions',
  ) => {
    const query = buildPredictionsSearchParams({
      ...filters,
      ...patch,
    }).toString();

    return query ? `${fallbackPath}?${query}` : fallbackPath;
  };

  return (
    <div className="min-h-screen pb-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="flex flex-col gap-3">
          <h1 className="text-3xl font-bold text-text">Predicciones</h1>
          <p className="text-sm text-muted">
            Explora predicciones separadas por deporte y liga.
          </p>
        </div>

        <div className="mt-4 flex w-full p-1 rounded-lg border border-border bg-surface">
          <Link
            href={canShowMine ? withFilters({ view: 'mine' }) : '/login'}
            className={`flex-1 px-4 py-2 rounded-md text-sm transition-colors text-center ${
              filters.view === 'mine'
                ? 'bg-brand text-white'
                : 'text-muted hover:text-text'
            } ${!canShowMine ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Mis predicciones
          </Link>
          <Link
            href={withFilters({ view: 'community' })}
            className={`flex-1 px-4 py-2 rounded-md text-sm transition-colors text-center ${
              filters.view === 'community'
                ? 'bg-brand text-white'
                : 'text-muted hover:text-text'
            }`}
          >
            Comunidad
          </Link>
        </div>

        <div className="mt-3 space-y-2">
          <div className="flex w-full p-1 rounded-lg border border-border bg-surface">
            {(
              [
                { id: 'all', label: 'Todos' },
                { id: 'live', label: 'En juego' },
                { id: 'ns', label: 'No iniciados' },
                { id: 'finished', label: 'Finalizados' },
              ] as const
            ).map((item) => (
              <Link
                key={item.id}
                href={withFilters({ status: item.id })}
                className={`flex-1 px-3 py-1.5 rounded-md text-xs sm:text-sm transition-colors text-center ${
                  filters.status === item.id
                    ? 'bg-brand text-white'
                    : 'text-muted hover:text-text'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-muted">Ordenar</span>
            {(
              [
                { id: 'status', label: 'Por estado' },
                { id: 'kickoff_asc', label: 'Proximos primero' },
                { id: 'kickoff_desc', label: 'Recientes primero' },
              ] as const
            ).map((option) => (
              <Link
                key={option.id}
                href={withFilters({ sort: option.id })}
                className={`px-2.5 py-1 rounded-lg border text-xs transition-colors ${
                  filters.sort === option.id
                    ? 'border-brand bg-brand/10 text-brand'
                    : 'border-border bg-surface text-text'
                }`}
              >
                {option.label}
              </Link>
            ))}
          </div>
        </div>

        {!canShowMine && (
          <p className="mt-3 text-xs text-muted">
            Inicia sesion para ver tus predicciones.
          </p>
        )}

        {groups.length === 0 ? (
          <div className="mt-8 rounded-xl border border-border bg-surface p-5 text-center">
            <p className="text-sm text-muted">
              {filters.view === 'mine'
                ? 'Aun no tienes predicciones guardadas.'
                : 'Aun no hay predicciones de otros usuarios.'}
            </p>
          </div>
        ) : (
          <div className="mt-6 space-y-6">
            {groups.map((sportGroup) => (
              <section
                key={sportGroup.sportId}
                className="rounded-2xl border border-border bg-surface p-4 sm:p-5"
              >
                <details className="group/sport">
                  <summary className="cursor-pointer list-none">
                    <div className="flex items-center justify-between gap-3">
                      <h2 className="text-lg sm:text-xl font-semibold text-text">
                        {sportGroup.sportName}
                      </h2>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted">
                          {sportGroup.leagues.reduce(
                            (acc, league) => acc + league.predictions.length,
                            0,
                          )}{' '}
                          predicciones
                        </span>
                        <ChevronDown className="h-4 w-4 text-muted transition-transform group-open/sport:rotate-180" />
                      </div>
                    </div>
                  </summary>

                  <div className="mt-4 space-y-4">
                    {sportGroup.leagues.map((league) => (
                      <details
                        key={league.competitionId}
                        className="group/league rounded-xl border border-border/70 bg-background p-3"
                      >
                        <summary className="cursor-pointer list-none">
                          <div className="flex items-center justify-between gap-3">
                            <h3 className="text-sm font-medium text-muted">
                              {league.competitionName}
                            </h3>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-muted">
                                {league.predictions.length}
                              </span>
                              <ChevronDown className="h-4 w-4 text-muted transition-transform group-open/league:rotate-180" />
                            </div>
                          </div>
                        </summary>

                        <div className="mt-3 grid grid-cols-1 lg:grid-cols-2 gap-3">
                          {league.predictions.map((prediction) => {
                            const result = getResultDisplay(prediction);

                            return (
                              <Link
                                key={prediction.id}
                                href={`/event/${prediction.matchId}?returnTo=/predictions`}
                                className="block rounded-xl border border-border bg-surface p-4 hover:border-brand/60 transition-colors"
                              >
                                <div className="flex items-center justify-between gap-3">
                                  <p className="text-sm text-text font-medium truncate">
                                    {prediction.homeTeam} vs{' '}
                                    {prediction.awayTeam}
                                  </p>
                                  <span className="text-[11px] text-muted whitespace-nowrap">
                                    {formatKickoff(prediction.kickoff)}
                                  </span>
                                </div>

                                <div className="mt-2 text-xs text-muted">
                                  Usuario: {prediction.username}
                                </div>

                                <div className="mt-3 grid grid-cols-2 gap-2">
                                  <div className="rounded-lg border border-border bg-background px-3 py-2">
                                    <p className="text-[11px] text-muted">
                                      Prediccion
                                    </p>
                                    <p className="text-sm font-semibold text-text">
                                      {prediction.predicted}
                                    </p>
                                  </div>
                                  <div className="rounded-lg border border-border bg-background px-3 py-2">
                                    <p className="text-[11px] text-muted">
                                      {result.label}
                                    </p>
                                    <p
                                      className={`text-sm font-semibold ${result.tone}`}
                                    >
                                      {result.value}
                                    </p>
                                  </div>
                                </div>

                                <div className="mt-2 flex items-center justify-between text-[11px] text-muted">
                                  <span>
                                    Estado:{' '}
                                    {getStatusLabel(prediction.matchStatus)}
                                  </span>
                                  <span>
                                    Puntos:{' '}
                                    {prediction.points === null
                                      ? '-'
                                      : prediction.points}
                                  </span>
                                </div>
                              </Link>
                            );
                          })}
                        </div>
                      </details>
                    ))}
                  </div>
                </details>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
