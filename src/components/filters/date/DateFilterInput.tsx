import { useId } from 'react';

interface DateFilterInputProps {
  label: string;
  value?: string | null;
  onChange: (value: string) => void;
}

export const DateFilterInput = ({
  label,
  value,
  onChange,
}: DateFilterInputProps) => {
  const inputId = useId();

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={inputId}
        className="text-[10px] uppercase font-bold text-muted ml-1"
      >
        {label}
      </label>

      <input
        id={inputId}
        type="date"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className="
          bg-surface text-text text-xs
          border border-border rounded-lg
          px-2 py-1 h-9 w-full
          outline-none transition-colors
          hover:border-brand/40
          focus-visible:ring-2 focus-visible:ring-ring
          focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
        style={{ colorScheme: 'dark' }}
      />
    </div>
  );
};
