// src/components/auth-buttons.tsx
'use client';
import { useAuth0 } from '@auth0/auth0-react';

export default function AuthButtons() {
  const { loginWithRedirect, logout, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) return <div>Loading...</div>;

  return isAuthenticated ? (
    <button onClick={() => logout({ logoutParams: { returnTo: window.location.origin })}>
      Logout
    </button>
  ) : (
    <button onClick={() => loginWithRedirect()}>Login</button>
  );
}