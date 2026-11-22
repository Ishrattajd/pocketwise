import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  getMissingFirebaseConfig,
  checkIsFirebaseConfigured,
  firebaseConfig,
} from '../firebase';

describe('Firebase configuration detection', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('counts as configured when all required keys are non-empty and non-placeholder', () => {
    const validEnv = {
      VITE_FIREBASE_API_KEY: 'AIzaSyValidApiKey12345',
      VITE_FIREBASE_AUTH_DOMAIN: 'my-app.firebaseapp.com',
      VITE_FIREBASE_PROJECT_ID: 'my-app-12345',
      VITE_FIREBASE_APP_ID: '1:123456789:web:abcdef12345',
    };

    const missing = getMissingFirebaseConfig(validEnv);
    expect(missing).toEqual([]);
    expect(checkIsFirebaseConfigured(validEnv)).toBe(true);
  });

  it('detects missing or placeholder variables and logs ONLY variable names, never values', () => {
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const placeholderEnv = {
      VITE_FIREBASE_API_KEY: 'your_api_key_here',
      VITE_FIREBASE_AUTH_DOMAIN: 'your_project_id.firebaseapp.com',
      VITE_FIREBASE_PROJECT_ID: '',
      VITE_FIREBASE_APP_ID: 'your_app_id',
    };

    const missing = getMissingFirebaseConfig(placeholderEnv);
    expect(missing).toContain('VITE_FIREBASE_API_KEY');
    expect(missing).toContain('VITE_FIREBASE_AUTH_DOMAIN');
    expect(missing).toContain('VITE_FIREBASE_PROJECT_ID');
    expect(missing).toContain('VITE_FIREBASE_APP_ID');

    const configured = checkIsFirebaseConfigured(placeholderEnv);
    expect(configured).toBe(false);

    // Verify console.warn was called
    expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
    const loggedMessage = consoleWarnSpy.mock.calls[0].join(' ');

    // Must contain variable names
    expect(loggedMessage).toContain('VITE_FIREBASE_API_KEY');
    expect(loggedMessage).toContain('VITE_FIREBASE_AUTH_DOMAIN');

    // Must never contain any secret values or raw values
    expect(loggedMessage).not.toContain('your_api_key_here');
    expect(loggedMessage).not.toContain('your_project_id.firebaseapp.com');
  });

  it('treats measurementId as optional', () => {
    const envWithoutMeasurementId = {
      VITE_FIREBASE_API_KEY: 'AIzaSyValidApiKey12345',
      VITE_FIREBASE_AUTH_DOMAIN: 'my-app.firebaseapp.com',
      VITE_FIREBASE_PROJECT_ID: 'my-app-12345',
      VITE_FIREBASE_APP_ID: '1:123456789:web:abcdef12345',
    };

    const missing = getMissingFirebaseConfig(envWithoutMeasurementId);
    expect(missing).toEqual([]);
    expect(checkIsFirebaseConfigured(envWithoutMeasurementId)).toBe(true);
    expect(firebaseConfig).toBeDefined();
  });
});
