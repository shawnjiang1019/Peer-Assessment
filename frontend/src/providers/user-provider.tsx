import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useAuth0 } from "@auth0/auth0-react";

interface User {
  id: number;
  name: string;
  email: string;
  auth0_id?: string;
  role: string;
}

interface UserContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
}

const UserContext = createContext<UserContextType>({
  user: null,
  loading: true,
  error: null,
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const { user: auth0User, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const syncAndLoadUser = async () => {
      console.log("Starting user sync process...");
      console.log(`Auth0 auth status: ${isAuthenticated}`);
      console.log(`Auth0 user:`, auth0User);
      
      if (!isAuthenticated || !auth0User) {
        console.log("User not authenticated, skipping sync");
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        console.log("Getting access token...");
        const token = await getAccessTokenSilently();
        console.log("Access token received");

        // 1. Sync user info to backend
        console.log("Syncing user with backend...");
        const syncPayload = {
          sub: auth0User.sub,
          email: auth0User.email,
          name: auth0User.name || "", // Handle potential undefined name
        };
        
        console.log("Sync payload:", syncPayload);
        const syncResponse = await fetch('http://127.0.0.1:8080/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(syncPayload),
        });

        console.log("Sync response status:", syncResponse.status);
        
        if (!syncResponse.ok) {
          const errorText = await syncResponse.text();
          console.error("Sync error response:", errorText);
          throw new Error(`Failed to sync user: ${syncResponse.status} - ${errorText}`);
        }

        const syncData = await syncResponse.json();
        console.log("Sync successful, user data:", syncData);

        // 2. Fetch full user profile from backend
        console.log(`Fetching user profile for auth0 ID: ${auth0User.sub}`);
        const profileResponse = await fetch(
          `http://127.0.0.1:8080/users/by-auth0/${auth0User.sub}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        console.log("Profile response status:", profileResponse.status);
        
        if (!profileResponse.ok) {
          const errorText = await profileResponse.text();
          console.error("Profile error response:", errorText);
          throw new Error(`Failed to fetch user profile: ${profileResponse.status} - ${errorText}`);
        }

        const userData = await profileResponse.json();
        console.log("User profile data:", userData);
        
        // Verify we have an ID
        if (!userData.id) {
          console.error("User ID is missing in response:", userData);
          throw new Error("User ID is missing in backend response");
        }

        setUser({
          id: userData.id,
          name: userData.name,
          email: userData.email,
          auth0_id: userData.auth0_sub || auth0User.sub,
          role: userData.role || 'student'
        });
      } catch (err) {
        console.error("User sync error:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    syncAndLoadUser();
  }, [isAuthenticated, auth0User, getAccessTokenSilently]);

  return (
    <UserContext.Provider value={{ user, loading, error }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);