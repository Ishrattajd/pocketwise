import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SignIn } from '../SignIn';
import * as useAuthModule from '../../hooks/useAuth';
import * as firebaseService from '../../services/firebase';

describe('SignIn component', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders PocketWise brand and sign-in buttons', () => {
    vi.spyOn(useAuthModule, 'useAuth').mockReturnValue({
      user: null,
      loading: false,
      signInWithGoogle: vi.fn(),
      signInAsDemo: vi.fn(),
      signOut: vi.fn(),
      error: null,
    });

    render(
      <MemoryRouter>
        <SignIn />
      </MemoryRouter>
    );

    expect(screen.getByText('PocketWise')).toBeInTheDocument();
    expect(screen.getByText('Smart Money for College Students')).toBeInTheDocument();
    expect(screen.getByTestId('google-signin-button')).toBeInTheDocument();
    expect(screen.getByTestId('demo-signin-button')).toBeInTheDocument();
  });

  it('hides the warning banner when Firebase credentials are configured', () => {
    vi.spyOn(useAuthModule, 'useAuth').mockReturnValue({
      user: null,
      loading: false,
      signInWithGoogle: vi.fn(),
      signInAsDemo: vi.fn(),
      signOut: vi.fn(),
      error: null,
    });

    // In current environment with real .env keys, isFirebaseConfigured is true
    render(
      <MemoryRouter>
        <SignIn />
      </MemoryRouter>
    );

    expect(firebaseService.isFirebaseConfigured).toBe(true);
    expect(screen.queryByTestId('auth-warning-banner')).not.toBeInTheDocument();
  });
});
