type OptionsListButtonProps = {
  title: string;
  isSelected: boolean;
  onClick: () => void;
  disabled?: boolean;
  roleType?: 'toggle' | 'tab'; // según uses toggle o tabs
  variant?: 'solid' | 'outline-solid'; // estilo base
  size?: 'sm' | 'md'; // tamaños
};

export const OptionsListButton = ({
  title,
  isSelected,
  onClick,
  disabled = false,
  roleType = 'toggle',
  variant = 'outline-solid',
  size = 'md',
}: OptionsListButtonProps) => {
  const ariaProps =
    roleType === 'tab'
      ? { role: 'tab', 'aria-selected': isSelected }
      : { 'aria-pressed': isSelected };

  const sizeCls =
    size === 'sm' ? 'h-9 px-3 text-sm' : 'h-10 px-3 text-[0.95rem]';

  const base =
    'snap-center rounded-lg font-semibold whitespace-nowrap truncate transition-colors duration-300 transition-transform duration-150 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-focus/70 ring-offset-background motion-reduce:transition-none motion-reduce:transform-none';

  const stateHover =
    'sm:hover:shadow-lg sm:hover:scale-[1.02] active:scale-[0.98] sm:active:scale-100';

  const outlineUnselected =
    'bg-transparent text-foreground border border-secondary/60 hover:bg-secondary/10';
  const outlineSelected = 'bg-secondary text-white border border-secondary';

  const solidUnselected =
    'bg-muted text-foreground border border-transparent hover:bg-muted/80';
  const solidSelected = 'bg-secondary text-white border border-transparent';

  const selected =
    variant === 'outline-solid' ? outlineSelected : solidSelected;
  const unselected =
    variant === 'outline-solid' ? outlineUnselected : solidUnselected;

  return (
    <div className="snap-center shrink-0">
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        title={title}
        {...ariaProps}
        className={[
          base,
          stateHover,
          sizeCls,
          isSelected ? selected : unselected,
          disabled ? 'opacity-50 cursor-not-allowed' : '',
        ].join(' ')}
      >
        {title}
      </button>
    </div>
  );
};
