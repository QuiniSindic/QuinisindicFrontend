interface LiveBadgeProps {
  label?: string;
}

export default function LiveBadge({ label = 'En vivo' }: LiveBadgeProps) {
  return (
    <div className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-background/80 px-2 py-1 backdrop-blur-sm">
      <span className="text-xs font-semibold text-text">{label}</span>
      <span className="h-2.5 w-2.5 rounded-full bg-red-600 animate-pulse" />
    </div>
  );
}
