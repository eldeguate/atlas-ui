import { mapR2RToAskResponse, type R2RRagResponse } from "@/lib/r2rAdapter";
import type { AskResponse } from "@/lib/types";

export function getR2RBaseUrl(): string | null {
  const raw = process.env.R2R_BASE_URL?.trim();
  if (!raw) return null;
  return raw.replace(/\/$/, "");
}

export async function queryR2R(query: string): Promise<AskResponse> {
  const baseUrl = getR2RBaseUrl();
  if (!baseUrl) {
    throw new Error("R2R_BASE_URL is not configured");
  }

  const res = await fetch(`${baseUrl}/v2/rag`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
    cache: "no-store",
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(
      `R2R request failed (${res.status})${detail ? `: ${detail.slice(0, 200)}` : ""}`,
    );
  }

  const payload = (await res.json()) as R2RRagResponse;
  return mapR2RToAskResponse(payload);
}