import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { isFirebaseConfigured } from '../services/firebase';
import { Wallet, ShieldCheck, GraduationCap, DollarSign, Sparkles } from 'lucide-react';

export const SignIn: React.FC = () => {
  const { user, signInWithGoogle, signInAsDemo } = useAuth();
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
        // User closed the popup, do not show an error banner
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
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Glow backdrop decoration */}
        <div className="absolute -top-16 -right-16 w-44 h-44 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-44 h-44 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="text-center">
          <div className="inline-flex p-3 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 shadow-xl shadow-indigo-500/20 mb-4">
            <Wallet className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">PocketWise</h1>
          <p className="mt-1 text-sm text-indigo-400 font-medium">Smart Money for College Students</p>
          <p className="mt-3 text-xs text-slate-400 leading-relaxed max-w-xs mx-auto">
            Take control of your campus budget, track daily food & textbook expenses, grow savings,
            and discover student scholarships & jobs.
          </p>
        </div>

        {/* Feature Highlights */}
        <div className="my-6 space-y-2.5 bg-slate-800/50 border border-slate-800 rounded-xl p-3.5">
          <div className="flex items-center gap-2.5 text-xs text-slate-300">
            <DollarSign className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Track student-friendly budgets & split costs</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs text-slate-300">
            <GraduationCap className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>Find scholarships & verified campus work-study</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs text-slate-300">
            <ShieldCheck className="w-4 h-4 text-violet-400 shrink-0" />
            <span>Mobile PWA offline support & secure Firebase Auth</span>
          </div>
        </div>

        {/* Warning shown ONLY when Firebase credentials are NOT configured */}
        {!isFirebaseConfigured && (
          <div
            data-testid="auth-warning-banner"
            className="mb-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 leading-normal"
          >
            Google Sign-In requires active Firebase credentials. You can also explore instantly with
            "Try Demo Account" below!
          </div>
        )}

        {/* Runtime Authentication Error Banner */}
        {authError && (
          <div
            data-testid="auth-error-banner"
            className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 leading-normal"
          >
            {authError}
          </div>
        )}

        {/* Auth Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            data-testid="google-signin-button"
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-slate-100 text-slate-900 font-semibold py-3 px-4 rounded-xl transition duration-150 shadow-md disabled:opacity-50"
          >
            {/* Google G Logo SVG */}
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
            className="w-full flex items-center justify-center gap-2 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 font-medium py-2.5 px-4 rounded-xl text-xs transition duration-150"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Instant Preview with Demo Student Account</span>
          </button>
        </div>

        <p className="mt-5 text-center text-[11px] text-slate-400">
          Built for students. Read Firebase config from{' '}
          <code className="text-slate-300">VITE_*</code> environment variables.
        </p>
      </div>
    </div>
  );
};

export default SignIn;
