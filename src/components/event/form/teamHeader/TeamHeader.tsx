// src/components/event/form/teamHeader/TeamHeader.tsx
'use client';

import { MatchData } from '@/types/events/events.types';
import ScoreBadgeForm from './ScoreBadgeForm';
import TeamBadgeForm from './TeamBadgeForm';

interface TeamHeaderProps {
  event: MatchData;
}

export default function TeamHeader({ event }: TeamHeaderProps) {
  const home = event.homeTeam;
  const away = event.awayTeam;

  return (
    <div className="w-full flex items-center justify-between py-2 relative">
      {/* LOCAL: Izquierda en móvil, Derecha en escritorio */}
      {/* Usamos w-1/3 para asegurar espacio en móvil */}
      <div className="w-1/3 sm:flex-1 flex justify-start sm:justify-end min-w-0 z-0">
        <TeamBadgeForm
          name={home.name}
          logo={home.img as string}
          teamId={event.homeId}
          align="right"
        />
      </div>

      {/* MARCADOR: Centro estático */}
      {/* En móvil puede solaparse un poco si es necesario, tiene z-index mayor */}
      <div className="shrink-0 z-10 px-1">
        <ScoreBadgeForm event={event} />
      </div>

      {/* VISITANTE: Derecha */}
      <div className="w-1/3 sm:flex-1 flex justify-end sm:justify-start min-w-0 z-0">
        <TeamBadgeForm
          name={away.name}
          logo={away.img as string}
          teamId={event.awayId}
          align="left"
        />
      </div>
    </div>
  );
}
