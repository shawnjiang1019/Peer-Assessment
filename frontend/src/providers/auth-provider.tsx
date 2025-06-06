// src/providers/auth-provider.tsx
'use client';
import { Auth0Provider } from '@auth0/auth0-react';
import { ReactNode } from 'react';

// Create a separate component for user sync
import UserSync from './user-sync'; // We'll create this next
import { UserProvider } from './user-provider';
export default function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <Auth0Provider
      domain="dev-4m08esq3iy51y7tm.us.auth0.com"
      clientId="CUktNfrC91Xqi7MtIZoPUtqCFVoWWKYW"
      authorizationParams={{
        redirect_uri: typeof window !== 'undefined' ? window.location.origin : '',
        audience: "https://peerassessment.com",
        scope: 'openid profile email',
      }}
      cacheLocation="localstorage"
      useRefreshTokens={true}
    >
      {/* Wrap children with UserSync component */}
      <UserProvider>{children}</UserProvider>
    </Auth0Provider>
  );
}