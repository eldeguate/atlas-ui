interface ComposerProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
}

export function Composer({ value, onChange, onSubmit, disabled }: ComposerProps) {
  return (
    <form
      className="border-t border-atlas-line bg-atlas-card px-4 py-3 sm:px-6"
      onSubmit={(e) => {
        e.preventDefault();
        if (!disabled && value.trim()) onSubmit();
      }}
    >
      <div className="mx-auto flex max-w-3xl gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Pregunta sobre productos, financiamiento o manuales…"
          disabled={disabled}
          className="min-w-0 flex-1 rounded-[var(--radius-chip)] border border-atlas-line bg-atlas-bg px-4 py-2.5 text-sm text-atlas-text outline-none transition-colors placeholder:text-atlas-muted focus:border-navy/40 focus:bg-white disabled:opacity-60"
          aria-label="Escribe tu pregunta"
        />
        <button
          type="submit"
          disabled={disabled || !value.trim()}
          className="shrink-0 rounded-[var(--radius-chip)] bg-uma-red px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Enviar
        </button>
      </div>
    </form>
  );
}