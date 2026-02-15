'use client';

import { useAuth } from '@/hooks/logic/useAuth';
import { getAllPredictionsV2 } from '@/services/predictions.service';
import { PredictionView } from '@/types/domain/prediction';
import { formatKickoff } from '@/utils/common/date';
import {
  getResultDisplay,
  getStatusBucket,
  getStatusLabel,
  groupBySportAndLeague,
  PredictionStatusFilter,
} from '@/utils/domain/events';
import { Spinner } from '@heroui/react';
import { useQuery } from '@tanstack/react-query';
import { ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';

type SortMode = 'status' | 'kickoff_desc' | 'kickoff_asc';

export default function PredictionsPage() {
  const { data: user, isLoading: authLoading } = useAuth();
  const [view, setView] = useState<'mine' | 'community'>('mine');
  const [statusFilter, setStatusFilter] =
    useState<PredictionStatusFilter>('all');
  const [sortMode, setSortMode] = useState<SortMode>('status');

  const {
    data: rows = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['predictions-feed'],
    queryFn: getAllPredictionsV2,
    refetchOnWindowFocus: false,
    staleTime: 60_000,
  });

  const filteredRows = useMemo(() => {
    let baseRows: PredictionView[] = rows;

    if (view === 'mine') {
      if (!user?.id) return [];
      baseRows = rows.filter((row) => row.userId === user.id);
    } else if (user?.id) {
      baseRows = rows.filter((row) => row.userId !== user.id);
    }

    if (statusFilter === 'all') return baseRows;
    return baseRows.filter(
      (row) => getStatusBucket(row.matchStatus) === statusFilter,
    );
  }, [rows, view, user?.id, statusFilter]);

  const groups = useMemo(
    () => groupBySportAndLeague(filteredRows, sortMode),
    [filteredRows, sortMode],
  );
  const errorMessage =
    error instanceof Error ? error.message : 'Error desconocido';

  const canShowMine = !!user?.id;

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
          <button
            type="button"
            onClick={() => canShowMine && setView('mine')}
            disabled={!canShowMine}
            className={`flex-1 px-4 py-2 rounded-md text-sm transition-colors ${
              view === 'mine'
                ? 'bg-brand text-white'
                : 'text-muted hover:text-text'
            } ${!canShowMine ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Mis predicciones
          </button>
          <button
            type="button"
            onClick={() => setView('community')}
            className={`flex-1 px-4 py-2 rounded-md text-sm transition-colors ${
              view === 'community'
                ? 'bg-brand text-white'
                : 'text-muted hover:text-text'
            }`}
          >
            Comunidad
          </button>
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
              <button
                key={item.id}
                type="button"
                onClick={() => setStatusFilter(item.id)}
                className={`flex-1 px-3 py-1.5 rounded-md text-xs sm:text-sm transition-colors ${
                  statusFilter === item.id
                    ? 'bg-brand text-white'
                    : 'text-muted hover:text-text'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="inline-flex items-center gap-2">
            <label htmlFor="predictions-sort" className="text-xs text-muted">
              Ordenar
            </label>
            <select
              id="predictions-sort"
              value={sortMode}
              onChange={(e) => setSortMode(e.target.value as SortMode)}
              className="h-8 px-2 rounded-lg border border-border bg-surface text-xs text-text"
            >
              <option value="status">Por estado</option>
              <option value="kickoff_asc">Hora (proximos primero)</option>
              <option value="kickoff_desc">Hora (recientes primero)</option>
            </select>
          </div>
        </div>

        {!canShowMine && (
          <p className="mt-3 text-xs text-muted">
            Inicia sesion para ver tus predicciones.
          </p>
        )}

        {(isLoading || authLoading) && (
          <div className="min-h-[40vh] flex items-center justify-center">
            <Spinner label="Cargando predicciones..." variant="wave" />
          </div>
        )}

        {!isLoading && !authLoading && isError && (
          <div className="mt-6 rounded-xl border border-danger/30 bg-danger/10 p-4">
            <p className="text-sm text-danger">
              No se pudieron cargar las predicciones: {errorMessage}
            </p>
          </div>
        )}

        {!isLoading && !authLoading && !isError && groups.length === 0 && (
          <div className="mt-8 rounded-xl border border-border bg-surface p-5 text-center">
            <p className="text-sm text-muted">
              {view === 'mine'
                ? 'Aun no tienes predicciones guardadas.'
                : 'Aun no hay predicciones de otros usuarios.'}
            </p>
          </div>
        )}

        {!isLoading && !authLoading && !isError && groups.length > 0 && (
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
