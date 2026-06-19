export function TypingIndicator() {
  return (
    <div className="flex justify-start" aria-live="polite" aria-label="Atlas está escribiendo">
      <div className="rounded-[var(--radius-card)] border border-atlas-line bg-atlas-card px-4 py-3 shadow-sm">
        <div className="flex items-center gap-1.5">
          <span className="atlas-typing-dot h-2 w-2 rounded-full bg-atlas-muted" />
          <span className="atlas-typing-dot h-2 w-2 rounded-full bg-atlas-muted" />
          <span className="atlas-typing-dot h-2 w-2 rounded-full bg-atlas-muted" />
        </div>
      </div>
    </div>
  );
}