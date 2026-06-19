import { mapR2RToAskResponse, type R2RRagResponse } from "@/lib/r2rAdapter";
import type { AskResponse } from "@/lib/types";

let cachedToken: string | null = null;

export function getR2RBaseUrl(): string | null {
  const raw = process.env.R2R_BASE_URL?.trim();
  if (!raw) return null;
  return raw.replace(/\/$/, "");
}

function getR2RCredentials(): { username: string; password: string } | null {
  const username = process.env.R2R_USERNAME?.trim();
  const password = process.env.R2R_PASSWORD;
  if (!username || !password) return null;
  return { username, password };
}

async function loginR2R(baseUrl: string): Promise<string> {
  const creds = getR2RCredentials();
  if (!creds) {
    throw new Error("R2R_USERNAME and R2R_PASSWORD are required for login");
  }

  const res = await fetch(`${baseUrl}/v2/login`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      username: creds.username,
      password: creds.password,
    }),
    cache: "no-store",
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(
      `R2R login failed (${res.status})${detail ? `: ${detail.slice(0, 200)}` : ""}`,
    );
  }

  const data = (await res.json()) as {
    results?: { access_token?: { token?: string } };
  };
  const token = data.results?.access_token?.token;
  if (!token) {
    throw new Error("R2R login failed: missing access token");
  }

  cachedToken = token;
  return token;
}

async function fetchR2RRag(
  baseUrl: string,
  query: string,
  retryOnUnauthorized = true,
): Promise<R2RRagResponse> {
  const creds = getR2RCredentials();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (creds) {
    if (!cachedToken) {
      cachedToken = await loginR2R(baseUrl);
    }
    headers.Authorization = `Bearer ${cachedToken}`;
  }

  const res = await fetch(`${baseUrl}/v2/rag`, {
    method: "POST",
    headers,
    body: JSON.stringify({ query }),
    cache: "no-store",
  });

  if (res.status === 401 && creds && retryOnUnauthorized) {
    cachedToken = await loginR2R(baseUrl);
    return fetchR2RRag(baseUrl, query, false);
  }

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(
      `R2R request failed (${res.status})${detail ? `: ${detail.slice(0, 200)}` : ""}`,
    );
  }

  return (await res.json()) as R2RRagResponse;
}

export async function queryR2R(query: string): Promise<AskResponse> {
  const baseUrl = getR2RBaseUrl();
  if (!baseUrl) {
    throw new Error("R2R_BASE_URL is not configured");
  }

  const payload = await fetchR2RRag(baseUrl, query);
  return mapR2RToAskResponse(payload);
}