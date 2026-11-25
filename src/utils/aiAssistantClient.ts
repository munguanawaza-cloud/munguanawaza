import type { Language } from '../i18n/translations';

export interface AssistantChatMessage {
  role: 'user' | 'assistant';
  text: string;
}

export interface AssistantResponse {
  ok: boolean;
  reply?: string;
  mode?: 'gemini' | 'standby_demo';
  error?: string;
}

export async function sendMessageToAssistant(params: {
  message: string;
  history: AssistantChatMessage[];
  lang: Language;
}): Promise<AssistantResponse> {
  const response = await fetch('/api/ai-assistant', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  const data = (await response.json()) as AssistantResponse;
  if (!response.ok || !data.ok || !data.reply) {
    throw new Error(data.error || 'ASSISTANT_REQUEST_FAILED');
  }

  return data;
}
