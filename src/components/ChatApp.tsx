"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ATLAS_API } from "@/lib/config";
import type {
  Agent,
  AskResponse,
  ChatMessage,
  CountryCode,
} from "@/lib/types";
import { AgentTabs } from "./AgentTabs";
import { AnswerCard } from "./AnswerCard";
import { Composer } from "./Composer";
import { Header } from "./Header";
import { TypingIndicator } from "./TypingIndicator";
import { UserBubble } from "./UserBubble";

function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function ChatApp() {
  const [agent, setAgent] = useState<Agent>("vendedor");
  const [country, setCountry] = useState<CountryCode>("CO");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pendingQuery, setPendingQuery] = useState<string | null>(null);
  const threadRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    const el = threadRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading, error, scrollToBottom]);

  const sendQuery = useCallback(
    async (query: string) => {
      const trimmed = query.trim();
      if (!trimmed || loading) return;

      setError(null);
      setPendingQuery(trimmed);
      setInput("");
      setMessages((prev) => [
        ...prev,
        { id: createId(), role: "user", content: trimmed },
      ]);
      setLoading(true);

      try {
        const res = await fetch(ATLAS_API, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: trimmed, agent, country }),
        });

        if (!res.ok) {
          throw new Error(`Error del servidor (${res.status})`);
        }

        const data = (await res.json()) as AskResponse;
        setMessages((prev) => [
          ...prev,
          { id: createId(), role: "assistant", response: data },
        ]);
        setPendingQuery(null);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "No se pudo obtener una respuesta. Intenta de nuevo.",
        );
      } finally {
        setLoading(false);
      }
    },
    [agent, country, loading],
  );

  const retry = () => {
    if (pendingQuery) void sendQuery(pendingQuery);
  };

  return (
    <div className="flex h-dvh flex-col bg-atlas-bg">
      <Header country={country} onCountryChange={setCountry} />
      <AgentTabs agent={agent} onAgentChange={setAgent} />

      <main
        ref={threadRef}
        className="flex-1 overflow-y-auto px-4 py-4 sm:px-6"
        aria-label="Conversación"
      >
        <div className="mx-auto flex max-w-3xl flex-col gap-4">
          {messages.length === 0 && !loading && !error && (
            <p className="py-8 text-center text-sm text-atlas-muted">
              Pregunta sobre especificaciones, financiamiento o manuales aprobados.
              <br />
              <span className="text-xs">
                Prueba &quot;precio&quot; o &quot;inventario&quot; para ver el estado sin respuesta.
              </span>
            </p>
          )}

          {messages.map((message) =>
            message.role === "user" ? (
              <UserBubble key={message.id} content={message.content} />
            ) : (
              <AnswerCard key={message.id} response={message.response} />
            ),
          )}

          {loading && <TypingIndicator />}

          {error && (
            <div className="flex justify-start">
              <div className="max-w-[92%] rounded-[var(--radius-card)] border border-uma-red/30 bg-uma-red/5 px-4 py-3 text-sm text-atlas-text">
                <p>{error}</p>
                {pendingQuery && (
                  <button
                    type="button"
                    onClick={retry}
                    className="mt-2 text-sm font-semibold text-uma-red underline-offset-2 hover:underline"
                  >
                    Reintentar
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      <Composer
        value={input}
        onChange={setInput}
        onSubmit={() => void sendQuery(input)}
        disabled={loading}
      />
    </div>
  );
}