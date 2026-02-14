'use client';

import LeaderboardFilters from '@/components/leaderboard/LeaderboardFilters';
import LeaderboardList from '@/components/leaderboard/LeaderboardList';
import { useState } from 'react';

export type LeaderboardScope = 'global' | 'sport' | 'competition';

export default function Leaderboard() {
  const [scope, setScope] = useState<LeaderboardScope>('global');
  const [filterId, setFilterId] = useState<number | null>(null); // ID del deporte o liga seleccionada

  return (
    <div className="min-h-screen pb-12 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold text-text">Ranking</h1>
            <p className="text-gray-500">
              Consulta los mejores pronosticadores de la comunidad.
            </p>
          </div>

          {/* Barra de Filtros: Pasa las funciones para cambiar el estado */}
          <LeaderboardFilters
            currentScope={scope}
            onScopeChange={setScope}
            onFilterChange={setFilterId}
          />

          <main>
            {/* Lista: Recibe el scope y el ID para hacer la query */}
            <LeaderboardList scope={scope} filterId={filterId} />
          </main>
        </div>
      </div>
    </div>
  );
}
