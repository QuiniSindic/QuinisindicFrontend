export const DateFilterButton = ({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className="snap-center shrink-0 px-3 py-1.5 text-xs font-medium rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors border border-white/5 whitespace-nowrap"
  >
    {label}
  </button>
);
