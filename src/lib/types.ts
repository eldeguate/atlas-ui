export type Agent = "vendedor" | "asesor";

export type CountryCode = "CO" | "VE" | "GT" | "SV" | "HN" | "NI" | "CR";

export interface Citation {
  label: string;
  url: string;
}

export interface AskRequest {
  query: string;
  agent: Agent;
  country: CountryCode;
}

export interface AskResponse {
  answer: string;
  citations: Citation[];
  validUntil: string;
  noAnswer: boolean;
}

export type MessageRole = "user" | "assistant";

export interface UserMessage {
  id: string;
  role: "user";
  content: string;
}

export interface AssistantMessage {
  id: string;
  role: "assistant";
  response: AskResponse;
}

export type ChatMessage = UserMessage | AssistantMessage;
