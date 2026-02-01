import React from 'react';

interface ActionDataProps {
  playerName?: string;
  teamName?: string;
  assist?: string;
}

export const ActionData: React.FC<ActionDataProps> = ({
  playerName,
  teamName,
  assist,
}) => {
  return (
    <div className="flex flex-col min-w-0">
      <span className="text-sm font-semibold text-text truncate">
        {playerName || 'Jugador desconocido'}
      </span>
      <div className="flex items-center gap-1 text-xs text-muted truncate">
        <span>{teamName}</span>
        {assist && (
          <>
            <span className="w-1 h-1 rounded-full bg-muted-foreground/50" />
            <span className="italic">Asist: {assist}</span>
          </>
        )}
      </div>
    </div>
  );
};
