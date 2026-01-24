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
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[10px] uppercase font-bold text-white/50 ml-1">
        {label}
      </label>

      <input
        type="date"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        // Estilos centralizados aquí
        className="bg-default-100 text-foreground text-xs border border-default-200 rounded-lg p-2 outline-none focus:ring-1 focus:ring-focus w-full h-9 transition-all hover:border-default-300"
        style={{ colorScheme: 'dark' }} // Mantiene el icono del calendario blanco/oscuro según el tema
      />
    </div>
  );
};
