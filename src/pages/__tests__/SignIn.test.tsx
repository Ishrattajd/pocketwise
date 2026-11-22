import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SignIn } from '../SignIn';
import { CurrencyProvider } from '../../context/CurrencyContext';
import * as useAuthModule from '../../hooks/useAuth';
import * as firebaseService from '../../services/firebase';

describe('SignIn component', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders PocketWise brand, currency selector and sign-in buttons', () => {
    vi.spyOn(useAuthModule, 'useAuth').mockReturnValue({
      user: null,
      loading: false,
      signInWithGoogle: vi.fn(),
      signInAsDemo: vi.fn(),
      signOut: vi.fn(),
      error: null,
    });

    render(
      <CurrencyProvider>
        <MemoryRouter>
          <SignIn />
        </MemoryRouter>
      </CurrencyProvider>
    );

    expect(screen.getByText('PocketWise')).toBeInTheDocument();
    expect(screen.getByText('Smart Money for College Students')).toBeInTheDocument();
    expect(screen.getByTestId('currency-selector')).toBeInTheDocument();
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

    render(
      <CurrencyProvider>
        <MemoryRouter>
          <SignIn />
        </MemoryRouter>
      </CurrencyProvider>
    );

    expect(firebaseService.isFirebaseConfigured).toBe(true);
    expect(screen.queryByTestId('auth-warning-banner')).not.toBeInTheDocument();
  });
});
