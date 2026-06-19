import type { AskResponse, Citation } from "@/lib/types";

/** R2R 3.x POST /v2/rag response (subset we consume). */
export interface R2RRagResponse {
  results?: {
    completion?: {
      choices?: Array<{
        message?: { content?: string | null };
      }>;
    };
    search_results?: {
      vector_search_results?: R2RVectorHit[];
    };
  };
}

export interface R2RVectorHit {
  document_id: string;
  score: number;
  metadata?: {
    title?: string;
    validUntil?: string;
    valid_until?: string;
    effective_to?: string;
    citation_label?: string;
    [key: string]: unknown;
  };
}

const NO_ANSWER_PHRASE = "No tengo esa información aprobada.";
const MIN_RELEVANCE_SCORE = 0.25;
const MAX_CITATIONS = 5;

function cleanTitle(raw: string): string {
  return raw.replace(/\.atlas\.md$/i, "").trim();
}

function pickValidUntil(hits: R2RVectorHit[]): string | null {
  for (const hit of hits) {
    const meta = hit.metadata;
    const candidate =
      meta?.validUntil ?? meta?.valid_until ?? meta?.effective_to;
    if (typeof candidate === "string" && candidate.trim()) {
      return candidate.trim();
    }
  }
  return null;
}

function buildCitations(hits: R2RVectorHit[]): Citation[] {
  const seen = new Set<string>();
  const citations: Citation[] = [];

  for (const hit of hits) {
    if (seen.has(hit.document_id)) continue;
    seen.add(hit.document_id);

    const rawLabel =
      hit.metadata?.title ??
      hit.metadata?.citation_label ??
      hit.document_id;
    const title =
      typeof rawLabel === "string" && rawLabel.includes(".atlas.md")
        ? cleanTitle(rawLabel)
        : String(rawLabel ?? `Documento ${hit.document_id.slice(0, 8)}`);

    citations.push({
      label: title,
      url: `#${hit.document_id}`,
    });

    if (citations.length >= MAX_CITATIONS) break;
  }

  return citations;
}

function shouldNoAnswer(answer: string, hits: R2RVectorHit[]): boolean {
  if (!answer) return true;

  const normalized = answer.toLowerCase();
  if (
    normalized.includes("no tengo") ||
    normalized.includes("no hay información") ||
    normalized.includes("no se encontró")
  ) {
    return true;
  }

  const topScore = hits.reduce((max, h) => Math.max(max, h.score ?? 0), 0);
  return hits.length === 0 || topScore < MIN_RELEVANCE_SCORE;
}

/** Map R2R /v2/rag JSON to Atlas UI AskResponse. */
export function mapR2RToAskResponse(r2r: R2RRagResponse): AskResponse {
  const answer =
    r2r.results?.completion?.choices?.[0]?.message?.content?.trim() ?? "";
  const hits = r2r.results?.search_results?.vector_search_results ?? [];
  const noAnswer = shouldNoAnswer(answer, hits);

  if (noAnswer) {
    return {
      answer: NO_ANSWER_PHRASE,
      citations: [],
      validUntil: pickValidUntil(hits),
      noAnswer: true,
    };
  }

  return {
    answer,
    citations: buildCitations(hits),
    validUntil: pickValidUntil(hits),
    noAnswer: false,
  };
}