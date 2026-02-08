'use client';
import FootballBall from '@/components/common/icons/FootballBallIcon';
import PenaltyIcon from '@/components/common/icons/PenaltyIcon';
import PenaltyMissedIcon from '@/components/common/icons/PenaltyMissedIcon';
import { MatchEventType } from '@/types/domain/events';
import { ArrowRightLeft, Ban, Circle } from 'lucide-react';

interface EventIconsProps {
  type: string | number;
  cardType?: 'Yellow' | 'Red' | string; // Añadimos esta prop
}

export const EventIcons: React.FC<EventIconsProps> = ({ type, cardType }) => {
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
      const isRed = cardType === 'Red';
      return (
        <span
          className={`inline-block w-3 h-4 rounded-xs border ${
            isRed
              ? 'bg-red-500 border-red-700'
              : 'bg-yellow-400 border-yellow-600'
          }`}
        />
      );

    case 'AddedTime':
      return null;

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
