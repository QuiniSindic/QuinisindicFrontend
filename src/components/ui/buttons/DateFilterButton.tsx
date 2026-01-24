export const DateFilterButton = ({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className="
      snap-center shrink-0 whitespace-nowrap
      px-3 py-1.5 text-xs font-medium rounded-full
      bg-surface text-text
      hover:bg-background
      transition-colors border border-border"
  >
    {label}
  </button>
);
