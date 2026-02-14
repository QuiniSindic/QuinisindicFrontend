interface SaveButtonProps {
  label: string;
  onClick?: () => void;
}

export default function SaveButton({ label, onClick }: SaveButtonProps) {
  return (
    <button
      onClick={onClick}
      className="
        bg-brand text-brand-contrast
        px-6 py-2 rounded-lg
        font-semibold
        hover:opacity-90
        transition-colors
        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-ring
        focus-visible:ring-offset-2
        focus-visible:ring-offset-background
      "
    >
      {label}
    </button>
  );
}
