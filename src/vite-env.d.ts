/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

interface ImportMetaEnv {
  readonly VITE_FIREBASE_API_KEY: string;
  readonly VITE_FIREBASE_AUTH_DOMAIN: string;
  readonly VITE_FIREBASE_PROJECT_ID: string;
  readonly VITE_FIREBASE_STORAGE_BUCKET: string;
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID: string;
  readonly VITE_FIREBASE_APP_ID: string;
  readonly VITE_FIREBASE_MEASUREMENT_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module 'firebase/ai' {
  export function getAI(app: unknown, options?: unknown): unknown;
  export class GoogleAIBackend {
    constructor();
  }
  export function getGenerativeModel(ai: unknown, options: { model: string }): {
    generateContent: (prompt: string | unknown) => Promise<{
      response: {
        text: () => string;
      };
    }>;
  };
}
