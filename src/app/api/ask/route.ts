import { NextRequest, NextResponse } from "next/server";
import { isLiveDataQuery } from "@/lib/liveDataGuard";
import { queryR2R, getR2RBaseUrl } from "@/lib/r2rClient";
import type { Agent, AskRequest, AskResponse } from "@/lib/types";

function buildNoAnswer(): AskResponse {
  return {
    answer: "No tengo esa información aprobada.",
    citations: [],
    validUntil: new Date().toISOString(),
    noAnswer: true,
  };
}

function buildSampleAnswer(agent: Agent): AskResponse {
  if (agent === "asesor") {
    return {
      answer:
        "Para el Bajaj Boxer CT 100 ES en Colombia, el financiamiento aprobado contempla cuota inicial del 30% y plazo hasta 36 meses según perfil crediticio.",
      citations: [
        {
          label: "Política de financiamiento UMA — Colombia v2",
          url: "#",
        },
        {
          label: "Tabla de tasas — Asesor interno (CO)",
          url: "#",
        },
      ],
      validUntil: "2026-06-30",
      noAnswer: false,
    };
  }

  return {
    answer:
      "El Bajaj Boxer CT 100 ES tiene freno delantero de tambor y sistema CBS. El motor es de 102 cc con arranque eléctrico y pedal.",
    citations: [
      {
        label: "Manual CT 100 ES — Frenos v3 (CO)",
        url: "#",
      },
    ],
    validUntil: "2026-06-30",
    noAnswer: false,
  };
}

async function buildMockResponse(
  query: string,
  agent: Agent,
): Promise<AskResponse> {
  await new Promise((resolve) => setTimeout(resolve, 650));

  return isLiveDataQuery(query) ? buildNoAnswer() : buildSampleAnswer(agent);
}

export async function POST(request: NextRequest) {
  let body: AskRequest;

  try {
    body = (await request.json()) as AskRequest;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const query = body.query?.trim() ?? "";
  if (!query) {
    return NextResponse.json({ error: "query is required" }, { status: 400 });
  }

  const agent: Agent = body.agent === "asesor" ? "asesor" : "vendedor";

  if (isLiveDataQuery(query)) {
    return NextResponse.json(buildNoAnswer());
  }

  try {
    const response = getR2RBaseUrl()
      ? await queryR2R(query)
      : await buildMockResponse(query, agent);

    return NextResponse.json(response);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Upstream R2R error";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}