'use client';
import FootballBall from '@/components/ui/icons/FootballBallIcon';
import PenaltyIcon from '@/components/ui/icons/PenaltyIcon';
import PenaltyMissedIcon from '@/components/ui/icons/PenaltyMissedIcon';
import { MatchEventType } from '@/types/events/events.types';
import { CircleDot, Flag, Pause, RotateCcw } from 'lucide-react';

export function EventIcons({ type }: { type: MatchEventType }) {
  switch (type) {
    case MatchEventType.Goal:
      return <FootballBall className="w-4 h-4" />;
    case MatchEventType.PenaltyGoal:
      return <PenaltyIcon className="w-4 h-4" />;
    case MatchEventType.FailedPenalty:
      return <PenaltyMissedIcon className="w-4 h-4 bg-red-600" />;
    case MatchEventType.YellowCard:
      return (
        <span className="inline-block w-3 h-4 rounded-xs bg-yellow-400 border border-yellow-600" />
      );
    case MatchEventType.RedCard:
      return (
        <span className="inline-block w-3 h-4 rounded-xs bg-red-500 border border-red-700" />
      );
    case MatchEventType.HalfTime:
      return <Pause className="w-4 h-4" />;
    case MatchEventType.Overtime:
      return <RotateCcw className="w-4 h-4" />;
    case MatchEventType.FinalTime:
      return <Flag className="w-4 h-4" />;
    default:
      return <CircleDot className="w-4 h-4" />;
  }
}

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
