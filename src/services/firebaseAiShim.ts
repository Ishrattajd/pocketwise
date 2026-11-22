import { FirebaseApp } from 'firebase/app';

export class GoogleAIBackend {
  constructor() {}
}

export interface GenerativeModelConfig {
  model: string;
  generationConfig?: {
    responseMimeType?: string;
    responseSchema?: unknown;
    temperature?: number;
  };
}

export interface GenerativeModel {
  generateContent: (prompt: string) => Promise<{
    response: {
      text: () => string;
    };
  }>;
}

export function getAI(_app: FirebaseApp, _options?: { backend?: unknown }) {
  return {};
}

export function getGenerativeModel(_ai: unknown, _config: GenerativeModelConfig): GenerativeModel {
  return {
    generateContent: async (_prompt: string) => {
      return {
        response: {
          text: () => '',
        },
      };
    },
  };
}
