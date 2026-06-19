"use client";

import { useState } from "react";
import type { AskResponse } from "@/lib/types";

interface AnswerCardProps {
  response: AskResponse;
}

export function AnswerCard({ response }: AnswerCardProps) {
  const [feedback, setFeedback] = useState<"up" | "down" | null>(null);
  const { noAnswer, answer, citations, validUntil } = response;

  if (noAnswer) {
    return (
      <div className="flex justify-start">
        <div className="max-w-[92%] rounded-[var(--radius-card)] border border-atlas-line bg-atlas-card px-4 py-4 shadow-sm">
          <p className="text-sm text-atlas-muted italic">
            No tengo esa información aprobada.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start">
      <article className="max-w-[92%] rounded-[var(--radius-card)] border border-atlas-line bg-atlas-card px-4 py-4 shadow-sm">
        <div className="max-w-none text-sm leading-relaxed text-atlas-text">
          <p className="whitespace-pre-wrap">{answer}</p>
        </div>

        {citations.length > 0 && (
          <div className="mt-4 border-t border-atlas-line pt-3">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-atlas-muted">
              Fuentes
            </p>
            <div className="flex flex-wrap gap-2">
              {citations.map((citation, index) => (
                <a
                  key={`${citation.url}-${index}`}
                  href={citation.url}
                  className="inline-flex items-center rounded-[var(--radius-chip)] border border-atlas-line bg-atlas-bg px-2.5 py-1 text-xs text-navy transition-colors hover:border-navy/30 hover:bg-white"
                >
                  <span className="mr-1 font-semibold text-uma-red">[{index + 1}]</span>
                  {citation.label}
                </a>
              ))}
            </div>
          </div>
        )}

        <div className="mt-3 flex flex-wrap items-center gap-3">
          {validUntil && (
            <span className="rounded-[var(--radius-chip)] bg-atlas-bg px-2 py-0.5 text-xs text-atlas-muted">
              Vigencia: {new Date(validUntil).toLocaleDateString("es-CO")}
            </span>
          )}

          <div className="ml-auto flex items-center gap-1">
            <button
              type="button"
              title="Útil"
              aria-label="Útil"
              onClick={() => setFeedback("up")}
              className={[
                "rounded-[var(--radius-chip)] px-2 py-1 text-base transition-colors",
                feedback === "up"
                  ? "bg-atlas-ok/15 ring-1 ring-atlas-ok/40"
                  : "hover:bg-atlas-bg",
              ].join(" ")}
            >
              👍
            </button>
            <button
              type="button"
              title="No útil"
              aria-label="No útil"
              onClick={() => setFeedback("down")}
              className={[
                "rounded-[var(--radius-chip)] px-2 py-1 text-base transition-colors",
                feedback === "down"
                  ? "bg-uma-red/10 ring-1 ring-uma-red/30"
                  : "hover:bg-atlas-bg",
              ].join(" ")}
            >
              👎
            </button>
          </div>
        </div>
      </article>
    </div>
  );
}
