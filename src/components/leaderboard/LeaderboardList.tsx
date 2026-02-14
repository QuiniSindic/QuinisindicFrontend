'use client';

import { createClient } from '@/utils/supabase/client';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface LeaderboardEntry {
  user_id: string;
  username: string;
  avatar_url: string | null;
  total_points: number;
  predictions_count: number;
  exact_hits: number;
}

interface Props {
  scope: 'global' | 'sport' | 'competition';
  filterId: number | null;
}

export default function LeaderboardList({ scope, filterId }: Props) {
  const supabase = createClient();
  const [data, setData] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      let query: any;

      if (scope === 'global') {
        query = supabase.from('leaderboard_global').select('*');
      } else if (scope === 'sport' && filterId) {
        query = supabase
          .from('leaderboard_sport')
          .select('*')
          .eq('sport_id', filterId);
      } else if (scope === 'competition' && filterId) {
        query = supabase
          .from('leaderboard_competition')
          .select('*')
          .eq('competition_id', filterId);
      }

      if (query) {
        const { data: result, error } = await query
          .order('total_points', { ascending: false })
          .limit(50);

        if (!error && result) {
          setData(result);
        } else {
          console.error('Error fetching leaderboard:', error);
          setData([]);
        }
      }
      setLoading(false);
    }

    fetchData();
  }, [scope, filterId]);

  if (loading)
    return (
      <div className="space-y-2 p-1">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="h-16 w-full bg-surface rounded-lg border border-border/50 animate-pulse"
          />
        ))}
      </div>
    );

  if (data.length === 0)
    return (
      <div className="py-12 text-center text-muted bg-surface rounded-lg border border-border border-dashed">
        <p className="text-sm">No hay datos disponibles para este filtro.</p>
      </div>
    );

  return (
    <div className="bg-surface rounded-xl shadow-sm border border-border overflow-hidden">
      <table className="w-full text-sm text-left text-text">
        <thead className="text-[11px] uppercase bg-background/50 text-muted font-medium border-b border-border">
          <tr>
            <th className="px-4 py-3 text-center w-12 tracking-wider">#</th>
            <th className="px-4 py-3 tracking-wider">Usuario</th>
            <th className="px-4 py-3 text-center hidden sm:table-cell tracking-wider">
              Plenos
            </th>
            <th className="px-4 py-3 text-center hidden sm:table-cell tracking-wider">
              Predic.
            </th>
            <th className="px-4 py-3 text-right tracking-wider">Puntos</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-border/60">
          {data.map((entry, index) => {
            const rank = index + 1;

            // Estilos para el Top 3 (Minimalista: solo colores de texto/bg sutiles)
            let rankClass = 'text-muted font-medium';
            let rowClass = 'hover:bg-background/40 transition-colors';

            if (rank === 1) {
              rankClass = 'text-amber-500 font-bold'; // Oro sutil
              rowClass += ' bg-amber-500/5';
            } else if (rank === 2) {
              rankClass = 'text-slate-500 font-bold'; // Plata
            } else if (rank === 3) {
              rankClass = 'text-orange-700 font-bold'; // Bronce
            }

            return (
              <tr key={entry.user_id} className={rowClass}>
                {/* RANKING */}
                <td className="px-4 py-3 text-center">
                  <span className={`text-sm tabular-nums ${rankClass}`}>
                    {rank}
                  </span>
                </td>

                {/* USUARIO + DATOS MÓVIL */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div className="size-8 rounded-full bg-background border border-border overflow-hidden relative shrink-0">
                      {entry.avatar_url ? (
                        <Image
                          src={entry.avatar_url}
                          alt={entry.username}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center w-full h-full text-[10px] font-bold text-muted uppercase">
                          {entry.username?.[0] || '?'}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col justify-center">
                      <span className="font-medium text-text text-sm truncate max-w-37.5 sm:max-w-none">
                        {entry.username || 'Anónimo'}
                      </span>

                      {/* INFORMACIÓN MÓVIL (Clean Text) */}
                      <div className="flex items-center gap-2 sm:hidden text-[10px] text-muted leading-tight mt-0.5">
                        <span>{entry.predictions_count} pred.</span>
                        <span className="text-border text-[8px]">•</span>
                        <span
                          className={
                            entry.exact_hits > 0
                              ? 'text-green-600 font-medium'
                              : ''
                          }
                        >
                          {entry.exact_hits} plenos
                        </span>
                      </div>
                    </div>
                  </div>
                </td>

                {/* PLENOS (Desktop) */}
                <td className="px-4 py-3 text-center hidden sm:table-cell">
                  <span
                    className={`text-xs font-medium ${entry.exact_hits > 0 ? 'text-green-600' : 'text-muted/60'}`}
                  >
                    {entry.exact_hits}
                  </span>
                </td>

                {/* PREDICCIONES (Desktop) */}
                <td className="px-4 py-3 text-center text-muted text-xs hidden sm:table-cell">
                  {entry.predictions_count}
                </td>

                {/* PUNTOS */}
                <td className="px-4 py-3 text-right">
                  <span className="font-bold text-brand tabular-nums">
                    {entry.total_points}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
