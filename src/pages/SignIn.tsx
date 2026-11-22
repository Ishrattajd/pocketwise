import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useCurrency } from '../hooks/useCurrency';
import { isFirebaseConfigured } from '../services/firebase';
import { CurrencySelector } from '../components/CurrencySelector';
import { StudentFinanceIllustration } from '../components/Illustrations';
import { Wallet, ShieldCheck, GraduationCap, DollarSign, Sparkles } from 'lucide-react';

export const SignIn: React.FC = () => {
  const { user, signInWithGoogle, signInAsDemo } = useAuth();
  const { currency } = useCurrency();
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: { pathname?: string } })?.from?.pathname || '/';

  React.useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  const handleGoogleSignIn = async () => {
    if (!isFirebaseConfigured) {
      setAuthError(
        'Google Sign-In requires active Firebase credentials. You can also explore instantly with "Try Demo Account" below!'
      );
      return;
    }

    setLoading(true);
    setAuthError(null);
    try {
      await signInWithGoogle();
      navigate(from, { replace: true });
    } catch (err: unknown) {
      console.error(err);
      const firebaseError = err as { code?: string; message?: string };
      if (firebaseError.code === 'auth/popup-closed-by-user') {
        return;
      }
      setAuthError(
        firebaseError.message ||
          'Failed to sign in with Google. Please try again or use the Demo Account.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDemoSignIn = () => {
    signInAsDemo();
    navigate(from, { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1E293B] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border border-[#E5E0D8] rounded-3xl p-6 sm:p-8 shadow-sm">
        {/* Header Branding */}
        <div className="text-center">
          <div className="inline-flex p-3 rounded-2xl bg-[#0F766E] text-white shadow-sm mb-3">
            <Wallet className="w-7 h-7 text-white" />
          </div>
          <h1 className="font-heading text-2xl font-bold text-[#1E293B] tracking-tight">
            PocketWise
          </h1>
          <p className="mt-1 text-sm text-[#0F766E] font-medium">Smart Money for College Students</p>
        </div>

        {/* Inline SVG Illustration */}
        <div className="my-4 flex justify-center">
          <StudentFinanceIllustration className="w-48 h-36" />
        </div>

        <p className="text-center text-xs text-[#64748B] leading-relaxed max-w-xs mx-auto mb-4">
          College is busy enough. Keep your spending simple with easy hostel budgets, tuition goals,
          and student grants.
        </p>

        {/* Currency Selector on Sign-in */}
        <div className="mb-5 bg-[#FAF7F2] p-3 rounded-2xl border border-[#E5E0D8]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-[#1E293B] uppercase tracking-wider">
              Preferred Currency
            </span>
            <span className="text-[11px] font-medium text-[#0F766E]">Selected: {currency}</span>
          </div>
          <CurrencySelector />
        </div>

        {/* Feature Highlights */}
        <div className="mb-5 space-y-2 bg-[#FAF7F2] border border-[#E5E0D8] rounded-2xl p-3.5">
          <div className="flex items-center gap-2.5 text-xs text-[#1E293B]">
            <DollarSign className="w-4 h-4 text-[#0F766E] shrink-0" />
            <span>Track daily mess, transit & textbook spending</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs text-[#1E293B]">
            <GraduationCap className="w-4 h-4 text-[#F59E0B] shrink-0" />
            <span>Find NSP, state merit grants & campus work-study</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs text-[#1E293B]">
            <ShieldCheck className="w-4 h-4 text-[#0F766E] shrink-0" />
            <span>Offline-first PWA with secure student sync</span>
          </div>
        </div>

        {/* Warning shown ONLY when Firebase credentials are NOT configured */}
        {!isFirebaseConfigured && (
          <div
            data-testid="auth-warning-banner"
            className="mb-4 p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 leading-normal"
          >
            Google Sign-In requires active Firebase credentials. You can explore instantly with "Try
            Demo Account" below!
          </div>
        )}

        {/* Runtime Authentication Error Banner */}
        {authError && (
          <div
            data-testid="auth-error-banner"
            className="mb-4 p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 leading-normal"
          >
            {authError}
          </div>
        )}

        {/* Auth Buttons with 44px+ touch targets */}
        <div className="space-y-3">
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            data-testid="google-signin-button"
            className="min-h-[44px] w-full flex items-center justify-center gap-3 bg-white hover:bg-slate-50 text-[#1E293B] border border-[#E5E0D8] font-semibold py-2.5 px-4 rounded-xl transition duration-150 shadow-sm disabled:opacity-50"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>{loading ? 'Connecting...' : 'Sign in with Google'}</span>
          </button>

          <button
            onClick={handleDemoSignIn}
            data-testid="demo-signin-button"
            className="min-h-[44px] w-full flex items-center justify-center gap-2 bg-[#0F766E]/10 hover:bg-[#0F766E]/15 text-[#0F766E] border border-[#0F766E]/20 font-semibold py-2.5 px-4 rounded-xl text-xs transition duration-150"
          >
            <Sparkles className="w-4 h-4 text-[#0F766E]" />
            <span>Instant Preview with Demo Student Account</span>
          </button>
        </div>

        <p className="mt-5 text-center text-[11px] text-[#64748B]">
          Built for students. INR-first with zero ads or tracking.
        </p>
      </div>
    </div>
  );
};

export default SignIn;
