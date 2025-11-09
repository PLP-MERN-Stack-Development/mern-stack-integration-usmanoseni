import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../client/src/services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => authService.getCurrentUser());
  const [showAuthCard, setShowAuthCard] = useState(!authService.getCurrentUser());

  // Handle auth state changes
  const handleAuth = ({ token, user }) => {
    setUser(user || authService.getCurrentUser());
    setShowAuthCard(false);
  };

  // Listen for storage events (auth changes in other tabs)
  useEffect(() => {
    function onStorage(e) {
      if (e.key === 'user') {
        setUser(authService.getCurrentUser());
      }
    }
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const value = {
    user,
    setUser,
    showAuthCard,
    setShowAuthCard,
    handleAuth
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}