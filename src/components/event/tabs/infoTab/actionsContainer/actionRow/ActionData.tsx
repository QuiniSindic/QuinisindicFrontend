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
  // Si no hay jugador ni equipo (como en tiempo añadido),
  // centramos el layout o ajustamos el espaciado.
  const isInfoOnly = !playerName && !assist;

  return (
    <div
      className={`flex flex-col min-w-0 ${isInfoOnly ? 'justify-center' : ''}`}
    >
      {/* 1. Solo mostramos el nombre si existe y no es un string vacío */}
      {playerName && playerName.trim() !== '' && (
        <span className="text-sm font-semibold text-text truncate">
          {playerName}
        </span>
      )}

      {/* 2. Línea de detalles: Equipo y Asistencia */}
      {(teamName || assist) && (
        <div className="flex items-center gap-1 text-xs text-muted truncate">
          {teamName && <span>{teamName}</span>}

          {assist && (
            <>
              {teamName && (
                <span className="w-1 h-1 rounded-full bg-muted-foreground/50 shrink-0" />
              )}
              <span className="italic truncate">Asist: {assist}</span>
            </>
          )}
        </div>
      )}

      {/* 3. Fallback visual para eventos puramente informativos (opcional) */}
      {isInfoOnly && teamName && (
        <span className="text-xs font-medium text-muted/80 uppercase tracking-wider">
          {teamName}
        </span>
      )}
    </div>
  );
};
