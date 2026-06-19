import type { Agent } from "@/lib/types";

const AGENTS: { id: Agent; label: string }[] = [
  { id: "vendedor", label: "Vendedor" },
  { id: "asesor", label: "Asesor de Financiamiento" },
];

interface AgentTabsProps {
  agent: Agent;
  onAgentChange: (agent: Agent) => void;
}

export function AgentTabs({ agent, onAgentChange }: AgentTabsProps) {
  return (
    <div
      className="border-b border-atlas-line bg-atlas-card"
      role="tablist"
      aria-label="Seleccionar agente"
    >
      <div className="mx-auto flex max-w-3xl gap-1 px-2 sm:px-4">
        {AGENTS.map((item) => {
          const active = agent === item.id;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => onAgentChange(item.id)}
              className={[
                "relative px-4 py-3 text-sm font-medium transition-colors",
                active
                  ? "text-navy after:absolute after:inset-x-2 after:bottom-0 after:h-0.5 after:rounded-full after:bg-uma-red"
                  : "text-atlas-muted hover:text-atlas-text",
              ].join(" ")}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}