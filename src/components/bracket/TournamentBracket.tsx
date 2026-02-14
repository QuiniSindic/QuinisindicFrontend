'use client';

import { MatchData } from '@/types/domain/events';
import { organizeBracket } from '@/utils/domain/bracket';
import { useState } from 'react';
import { BracketMatchCard } from './BracketMatchCard';

interface Props {
  matches: MatchData[];
  onMatchSelect?: () => void;
}

export const TournamentBracket = ({ matches, onMatchSelect }: Props) => {
  const rounds = organizeBracket(matches);
  const [activeTab, setActiveTab] = useState('playoff'); // Tab por defecto: Octavos

  // Filtrar rondas vacías para no mostrarlas si no hay datos
  const activeRounds = rounds.filter((round) => round.matches.length > 0);

  if (activeRounds.length === 0) {
    return (
      <div className="text-center p-8 text-muted">
        No hay datos de eliminatorias disponibles.
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col">
      {/* === MOBILE: TABS === */}
      <div className="lg:hidden flex border-b border-border mb-4 overflow-x-auto scrollbar-hide">
        {activeRounds.map((round) => (
          <button
            key={round.id}
            onClick={() => setActiveTab(round.id)}
            className={`
              flex-1 py-3 px-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors
              ${
                activeTab === round.id
                  ? 'border-brand text-brand'
                  : 'border-transparent text-muted hover:text-text'
              }
            `}
          >
            {round.name}
          </button>
        ))}
      </div>

      {/* === CONTENT AREA === */}
      <div className="flex-1 overflow-y-auto lg:overflow-x-auto lg:overflow-y-hidden p-1">
        <div className="flex flex-col lg:flex-row lg:h-full lg:min-w-max gap-4 lg:gap-8">
          {activeRounds.map((round) => {
            // En Mobile, solo mostramos la ronda activa
            const isHiddenOnMobile = round.id !== activeTab;

            return (
              <div
                key={round.id}
                className={`
                  flex-col gap-4 lg:w-64 shrink-0
                  ${isHiddenOnMobile ? 'hidden lg:flex' : 'flex'}
                `}
              >
                {/* Título Ronda (Solo desktop, en mobile ya está en tabs) */}
                <h3 className="hidden lg:block text-center font-bold text-muted uppercase tracking-wider text-xs mb-4 sticky top-0 bg-background py-2 z-10">
                  {round.name}
                </h3>

                {/* Lista de Partidos */}
                <div className="flex flex-col justify-center h-full gap-4 lg:gap-8 pb-10">
                  {round.matches.map((match) => (
                    <div key={match.id} className="relative">
                      {/* Aquí irían las líneas conectoras CSS en una V2 */}
                      <BracketMatchCard
                        match={match}
                        onMatchSelect={onMatchSelect}
                      />
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
