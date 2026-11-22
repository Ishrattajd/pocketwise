import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './components/AuthProvider';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AppLayout } from './components/AppLayout';
import { LoadingSpinner } from './components/LoadingSpinner';

// Lazy-loaded routes for performance & code splitting
const Home = lazy(() => import('./pages/Home'));
const Expenses = lazy(() => import('./pages/Expenses'));
const Goals = lazy(() => import('./pages/Goals'));
const Scholarships = lazy(() => import('./pages/Scholarships'));
const Jobs = lazy(() => import('./pages/Jobs'));
const SignIn = lazy(() => import('./pages/SignIn'));
const NotFound = lazy(() => import('./pages/NotFound'));

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Suspense
          fallback={
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
              <LoadingSpinner message="Loading PocketWise..." />
            </div>
          }
        >
          <Routes>
            {/* Public authentication route */}
            <Route path="/signin" element={<SignIn />} />

            {/* Protected routes wrapped with student bottom tab navigation */}
            <Route element={<ProtectedRoute />}>
              <Route element={<AppLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/expenses" element={<Expenses />} />
                <Route path="/goals" element={<Goals />} />
                <Route path="/scholarships" element={<Scholarships />} />
                <Route path="/jobs" element={<Jobs />} />
              </Route>
            </Route>

            {/* 404 and fallback routes */}
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
