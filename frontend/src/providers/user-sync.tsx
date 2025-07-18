// src/providers/user-sync.tsx
'use client';
import { useAuth0 } from '@auth0/auth0-react';
import { useEffect } from 'react';

export default function UserSync({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();

  // Sync user with FastAPI backend
  useEffect(() => {
    const syncUser = async () => {
      if (!isAuthenticated || !user) return;
      
      try {
        const token = await getAccessTokenSilently();
        
        await fetch(`${process.env.REACT_APP_API_URL}/users`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            sub: user.sub,
            email: user.email,
            name: user.name,
            // Add any additional claims
          })
        });
      } catch (error) {
        console.error('User sync failed:', error);
      }
    };

    syncUser();
  }, [isAuthenticated, user, getAccessTokenSilently]);

  return <>{children}</>;
}