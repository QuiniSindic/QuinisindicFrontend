'use client';
import FootballBall from '@/components/ui/icons/FootballBallIcon';
import PenaltyIcon from '@/components/ui/icons/PenaltyIcon';
import PenaltyMissedIcon from '@/components/ui/icons/PenaltyMissedIcon';
import { MatchEventType } from '@/types/events/events.types';
import { ArrowRightLeft, Ban, Circle } from 'lucide-react';

interface EventIconsProps {
  type: string | number;
}

export const EventIcons: React.FC<EventIconsProps> = ({ type }) => {
  // Convertimos a string para asegurar comparación
  const typeStr = String(type);

  switch (typeStr) {
    case MatchEventType.Goal:
    case 'Goal':
      return <FootballBall className="w-4 h-4 text-brand" />;

    case MatchEventType.PenaltyGoal:
    case 'PenaltyGoal':
      return <PenaltyIcon className="w-4 h-4 text-green-600 fill-current" />;

    case MatchEventType.FailedPenalty:
    case 'MissedPenalty':
      return <PenaltyMissedIcon className="w-4 h-4 text-red-500" />;

    case MatchEventType.Card:
    case 'Card':
    case 'Yellow': // Por si acaso
    case 'YellowCard':
      // Si el backend no distingue aquí, pintamos amarilla por defecto.
      // Idealmente pasarías 'cardType' como prop extra si quisieras distinguir color exacto.
      return (
        <span className="inline-block w-3 h-4 rounded-xs bg-yellow-400 border border-yellow-600" />
      );

    case 'Red': // Por si acaso
    case 'RedCard':
      return (
        <span className="inline-block w-3 h-4 rounded-xs bg-red-500 border border-red-700" />
      );

    case MatchEventType.Substitution:
    case 'Substitution':
      return <ArrowRightLeft className="w-4 h-4 text-brand" />;

    case 'Var':
      return <Ban className="w-4 h-4 text-text" />;

    default:
      return <Circle className="w-2 h-2 text-muted" />;
  }
};
export function SidePill({ score }: { score?: string }) {
  if (!score) return null;
  return (
    <span
      className="
        inline-flex items-center gap-1 rounded-full px-2 py-0.5
        text-xs font-semibold border border-border bg-surface text-text
      "
    >
      {score}
    </span>
  );
}
