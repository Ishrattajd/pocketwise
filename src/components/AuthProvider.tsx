import React, { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, signInWithGoogle as fbSignInWithGoogle, signOutUser } from '../services/firebase';
import { UserProfile } from '../types';
import { AuthContext } from '../hooks/useAuth';

const DEMO_USER_STORAGE_KEY = 'pocketwise_demo_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if demo user is stored locally
    const savedDemo = localStorage.getItem(DEMO_USER_STORAGE_KEY);
    if (savedDemo) {
      try {
        const parsed = JSON.parse(savedDemo) as UserProfile;
        setUser(parsed);
        setLoading(false);
        return;
      } catch {
        localStorage.removeItem(DEMO_USER_STORAGE_KEY);
      }
    }

    const unsubscribe = onAuthStateChanged(
      auth,
      (firebaseUser: User | null) => {
        if (firebaseUser) {
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName || 'Student User',
            photoURL: firebaseUser.photoURL,
            isDemo: false,
          });
        } else {
          if (!localStorage.getItem(DEMO_USER_STORAGE_KEY)) {
            setUser(null);
          }
        }
        setLoading(false);
      },
      (authError) => {
        console.warn('Firebase auth state listener warning:', authError);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    setError(null);
    try {
      const result = await fbSignInWithGoogle();
      if (result.user) {
        localStorage.removeItem(DEMO_USER_STORAGE_KEY);
        setUser({
          uid: result.user.uid,
          email: result.user.email,
          displayName: result.user.displayName || 'Student User',
          photoURL: result.user.photoURL,
          isDemo: false,
        });
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to sign in with Google';
      setError(message);
      throw err;
    }
  };

  const signInAsDemo = () => {
    setError(null);
    const demoUser: UserProfile = {
      uid: 'demo-student-id-101',
      email: 'alex.student@campus.edu',
      displayName: 'Alex River',
      photoURL: null,
      isDemo: true,
    };
    localStorage.setItem(DEMO_USER_STORAGE_KEY, JSON.stringify(demoUser));
    setUser(demoUser);
    setLoading(false);
  };

  const signOut = async () => {
    setError(null);
    localStorage.removeItem(DEMO_USER_STORAGE_KEY);
    try {
      await signOutUser();
    } catch (err: unknown) {
      console.warn('Firebase signOut error (safe to ignore if demo user):', err);
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signInWithGoogle,
        signInAsDemo,
        signOut,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
