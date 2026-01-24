type PredictionScoreBadgeProps = {
  home: number;
  away: number;
};

export const PredictionScoreBadge: React.FC<PredictionScoreBadgeProps> = ({
  home,
  away,
}) => {
  return (
    <span
      className="
        inline-flex items-center justify-center
        h-7 px-2.5 rounded-full
        text-sm font-semibold tabular-nums
        bg-surface text-text
        border border-border
      "
      title={`${home} - ${away}`}
    >
      {home} – {away}
    </span>
  );
};
