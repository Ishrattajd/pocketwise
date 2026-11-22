import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  Auth,
} from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

/**
 * Required Firebase environment variable keys and their corresponding
 * placeholder values defined in .env.example.
 */
export const REQUIRED_FIREBASE_ENV_KEYS: Record<string, string> = {
  VITE_FIREBASE_API_KEY: 'your_api_key_here',
  VITE_FIREBASE_AUTH_DOMAIN: 'your_project_id.firebaseapp.com',
  VITE_FIREBASE_PROJECT_ID: 'your_project_id',
  VITE_FIREBASE_APP_ID: 'your_app_id',
};

/**
 * Inspects environment variables and returns only the names of missing or
 * placeholder variables. Never exposes or logs any secret values.
 */
export function getMissingFirebaseConfig(
  env: Record<string, string | undefined> = import.meta.env
): string[] {
  const missing: string[] = [];

  for (const [key, placeholder] of Object.entries(REQUIRED_FIREBASE_ENV_KEYS)) {
    const value = env[key];
    if (
      !value ||
      typeof value !== 'string' ||
      !value.trim() ||
      value.trim() === placeholder ||
      value.trim() === `placeholder-${key.toLowerCase()}`
    ) {
      missing.push(key);
    }
  }

  return missing;
}

/**
 * Checks if Firebase is configured with active credentials.
 * If any required variables are missing, logs ONLY their variable names to the console.
 */
export function checkIsFirebaseConfigured(
  env: Record<string, string | undefined> = import.meta.env
): boolean {
  const missing = getMissingFirebaseConfig(env);
  if (missing.length > 0) {
    // Only log variable names, never variable values
    console.warn('Missing or placeholder Firebase configuration variables:', missing.join(', '));
    return false;
  }
  return true;
}

// Global flag indicating whether Firebase is configured with active credentials
export const isFirebaseConfigured: boolean = checkIsFirebaseConfigured();

const measurementId = import.meta.env.VITE_FIREBASE_MEASUREMENT_ID?.trim();

// Read all Firebase configuration from Vite environment variables
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'placeholder-api-key',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'placeholder-project.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'placeholder-project',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'placeholder-project.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '123456789012',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:123456789012:web:placeholder-app-id',
  // measurementId is optional
  ...(measurementId && measurementId !== 'your_measurement_id' ? { measurementId } : {}),
};

// Initialize Firebase app singleton
export const app: FirebaseApp = !getApps().length
  ? initializeApp(firebaseConfig)
  : getApp();

export const auth: Auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db: Firestore = getFirestore(app);

// Configure Google provider defaults
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

/**
 * Sign in using Firebase Google Auth with popup
 */
export async function signInWithGoogle() {
  if (!isFirebaseConfigured) {
    throw new Error('Google Sign-In requires active Firebase credentials.');
  }
  return await signInWithPopup(auth, googleProvider);
}

/**
 * Sign out current Firebase user
 */
export async function signOutUser() {
  return await firebaseSignOut(auth);
}

export default app;
