export const Tab: React.FC<{
  isActive: boolean;
  onClick: () => void;
  tittle: string;
}> = ({ isActive, onClick, tittle }) => {
  return (
    <button
      onClick={onClick}
      className={`
        flex-1 py-2 text-center transition-colors
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
        focus-visible:ring-offset-2 focus-visible:ring-offset-background
        ${
          isActive
            ? 'text-text border-b-2 border-brand font-semibold'
            : 'text-muted hover:text-text'
        }`}
    >
      {tittle}
    </button>
  );
};
