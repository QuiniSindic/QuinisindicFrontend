'use client';

import FootballBall from '@/components/common/icons/FootballBallIcon';
import PenaltyIcon from '@/components/common/icons/PenaltyIcon';
import PenaltyMissedIcon from '@/components/common/icons/PenaltyMissedIcon';
import { MatchEventKind, MatchEventType } from '@/types/domain/events';
import { ArrowRightLeft, Ban, Circle, Clock3, Flag } from 'lucide-react';

interface EventIconsProps {
  type: string | number;
  kind?: MatchEventKind;
  cardType?: 'Yellow' | 'Red' | 'YellowRed' | string;
}

export const EventIcons: React.FC<EventIconsProps> = ({
  type,
  kind,
  cardType,
}) => {
  const typeStr = String(type);

  if (kind === 'missed_penalty') {
    return <PenaltyMissedIcon className="h-4 w-4 text-red-500" />;
  }

  if (kind === 'added_time') {
    return <Clock3 className="h-4 w-4 text-brand" />;
  }

  if (kind === 'period') {
    return <Flag className="h-4 w-4 text-muted" />;
  }

  if (kind === 'var') {
    return <Ban className="h-4 w-4 text-text" />;
  }

  switch (typeStr) {
    case MatchEventType.Goal:
    case 'Goal':
      return <FootballBall className="h-4 w-4 text-brand" />;

    case MatchEventType.PenaltyGoal:
    case 'PenaltyGoal':
      return <PenaltyIcon className="h-4 w-4 fill-current text-green-600" />;

    case MatchEventType.MissedPenalty:
    case MatchEventType.FailedPenalty:
    case 'MissedPenalty':
      return <PenaltyMissedIcon className="h-4 w-4 text-red-500" />;

    case MatchEventType.Card: {
      if (cardType === 'YellowRed') {
        return (
          <span className="relative inline-flex h-4 w-4 items-center justify-center">
            <span className="absolute left-0 inline-block h-4 w-2.5 rounded-xs border border-yellow-600 bg-yellow-400" />
            <span className="absolute right-0 inline-block h-4 w-2.5 rounded-xs border border-red-700 bg-red-500" />
          </span>
        );
      }

      const isRed = cardType === 'Red';
      return (
        <span
          className={`inline-block h-4 w-3 rounded-xs border ${
            isRed
              ? 'border-red-700 bg-red-500'
              : 'border-yellow-600 bg-yellow-400'
          }`}
        />
      );
    }

    case 'AddedTime':
      return <Clock3 className="h-4 w-4 text-brand" />;

    case MatchEventType.Substitution:
    case 'Substitution':
      return <ArrowRightLeft className="h-4 w-4 text-brand" />;

    case 'Var':
    case 'VAR':
      return <Ban className="h-4 w-4 text-text" />;

    default:
      return <Circle className="h-2 w-2 text-muted" />;
  }
};
