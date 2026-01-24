export const ScoreBadgeForm = ({ score }: { score?: string }) => {
  return (
    <span
      className="
        ml-2 inline-flex h-8 min-w-12 items-center justify-center
        rounded-full px-2
        border border-border
        bg-surface
        text-base font-bold tabular-nums
        text-text
      "
      title={score || 'vs'}
    >
      {score ?? 'vs'}
    </span>
  );
};
