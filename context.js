'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { googleProvider } from '@/lib/firebase';
import axios from 'axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Save user to MongoDB
          const response = await axios.post('/api/auth/user', {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            name: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL
          });
          
          setUser(response.data.user);
        } catch (error) {
          console.error('Error saving user:', error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      toast.success('Successfully logged in!');
      return result.user;
    } catch (error) {
      console.error('Google sign-in error:', error);
      toast.error('Failed to sign in with Google');
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      toast.success('Successfully logged out!');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout');
      throw error;
    }
  };

  const value = {
    user,
    loading,
    signInWithGoogle,
    logout,
    isAdmin: user?.isAdmin || false
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
