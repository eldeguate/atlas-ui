import type { CountryCode } from "@/lib/types";

const COUNTRIES: { code: CountryCode; label: string }[] = [
  { code: "CO", label: "Colombia" },
  { code: "VE", label: "Venezuela" },
  { code: "GT", label: "Guatemala" },
  { code: "SV", label: "El Salvador" },
  { code: "HN", label: "Honduras" },
  { code: "NI", label: "Nicaragua" },
  { code: "CR", label: "Costa Rica" },
];

interface HeaderProps {
  country: CountryCode;
  onCountryChange: (country: CountryCode) => void;
}

export function Header({ country, onCountryChange }: HeaderProps) {
  return (
    <header className="bg-navy text-white px-4 py-3 sm:px-6 shadow-sm">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">Atlas</h1>
          <p className="text-xs text-white/70">Grupo UMA</p>
        </div>

        <label className="flex items-center gap-2 text-sm">
          <span className="hidden text-white/70 sm:inline">País</span>
          <select
            value={country}
            onChange={(e) => onCountryChange(e.target.value as CountryCode)}
            className="rounded-[var(--radius-chip)] border border-white/20 bg-navy-2 px-3 py-1.5 text-sm text-white outline-none focus:border-white/40"
            aria-label="Seleccionar país"
          >
            {COUNTRIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.code} — {c.label}
              </option>
            ))}
          </select>
        </label>
      </div>
    </header>
  );
}
