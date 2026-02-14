interface ScoreInputProps {
  value?: number | string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export default function ScoreInput({
  value,
  onChange,
  disabled,
}: ScoreInputProps) {
  const strValue = value === undefined || value === null ? '' : String(value);
  const isEmpty = strValue === '';

  const baseCls = `
    no-arrows w-16 h-16 rounded-2xl text-center text-2xl font-bold tabular-nums
    transition-all duration-200 outline-none
    focus-visible:ring-2 focus-visible:ring-ring
    focus-visible:ring-offset-2 focus-visible:ring-offset-background
  `;

  const stateCls = disabled
    ? 'bg-background text-muted border border-border opacity-60 cursor-not-allowed'
    : isEmpty
      ? 'bg-surface border border-border text-text'
      : 'bg-brand text-brand-contrast shadow-sm';

  return (
    <input
      disabled={disabled}
      type="number"
      inputMode="numeric"
      min={0}
      step={1}
      value={strValue}
      onChange={(e) => onChange(e.target.value)}
      className={`${baseCls} ${stateCls}`}
    />
  );
}
