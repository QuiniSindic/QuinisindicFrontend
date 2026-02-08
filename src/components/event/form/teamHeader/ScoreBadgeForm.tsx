'use client';

import { MatchData } from '@/types/domain/events';
import { parseKickoff } from '@/utils/common/date';
import 'dayjs/locale/es';

interface Props {
  event: MatchData;
}

export default function ScoreBadgeForm({ event }: Props) {
  const isNS = event.status === 'NS';
  const isFT =
    event.status === 'FT' ||
    event.status === 'AET' ||
    event.status === 'AP' ||
    event.status === 'Canc.';
  // Si no es NS ni FT (y no es cancelado), asumimos que está en juego o en descanso (HT)
  const isLive = !isNS && !isFT;

  // 1. GESTIÓN DE FECHAS con Day.js
  const dateObj = parseKickoff(event.kickoff);
  const formattedTime = dateObj ? dateObj.format('HH:mm') : '--:--';
  // Formato: "dom. 1 jun" (minúsculas por defecto en dayjs es)
  const formattedDate = dateObj ? dateObj.locale('es').format('ddd D MMM') : '';

  // 2. GESTIÓN DEL RESULTADO (Parsing de string "2 - 1")
  let homeScore = '0';
  let awayScore = '0';

  if (event.result && event.result.includes('-')) {
    const [h, a] = event.result.split('-');
    homeScore = h.trim();
    awayScore = a.trim();
  }

  return (
    <div className="flex flex-col items-center justify-center min-w-25 sm:min-w-35 gap-1">
      {/* 1. STATUS BADGE (El "semáforo" del partido) */}
      <div
        className={`
        flex items-center justify-center px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider shadow-sm border
        ${isLive ? 'bg-red-500/10 text-red-600 border-red-500/20 animate-pulse' : ''}
        ${isFT ? 'bg-surface text-muted border-border' : ''}
        ${isNS ? 'bg-brand/5 text-brand border-brand/10' : ''}
      `}
      >
        {isLive && (
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
            LIVE {event.minute ? `• ${event.minute}'` : ''}
          </span>
        )}
        {isFT && (
          <span>{event.status === 'Canc.' ? 'Cancelado' : 'Finalizado'}</span>
        )}
        {isNS && <span>{formattedTime}</span>}
      </div>

      {/* 2. MARCADOR REAL (The Real Score) */}
      <div className="relative flex items-center justify-center h-12">
        {isNS ? (
          // Estado VS
          <span className="text-2xl font-black text-muted/40 italic">VS</span>
        ) : (
          // Estado Marcador (Live o Final) -> Usamos las variables parseadas
          <div className="flex items-center gap-3 text-3xl sm:text-4xl font-black text-text tabular-nums tracking-tight">
            <span>{homeScore}</span>
            <span className="text-muted/30 text-2xl font-normal">-</span>
            <span>{awayScore}</span>
          </div>
        )}
      </div>

      {/* 3. FECHA (Solo si no ha empezado, para contexto) */}
      {isNS && (
        <span className="text-[10px] text-muted capitalize">
          {formattedDate}
        </span>
      )}
    </div>
  );
}
