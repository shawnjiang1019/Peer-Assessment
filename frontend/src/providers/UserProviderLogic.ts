import AxiosClient from "@/app/api/axiosClient";

interface SyncUserPayload {
  sub: string;
  email: string;
  name: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  auth0_id?: string;
  role: string;
}

// Backend response interface (what comes from the API)
interface BackendUser {
  id: number;
  name: string;
  email: string;
  auth0_sub?: string;  // Backend uses auth0_sub
  role: string;
}

export class UserProviderService {
  
  async syncUser(payload: SyncUserPayload, token: string): Promise<any> {
    try {
      console.log(process.env.DEV);
      console.log("Syncing user with backend...");
      console.log("Sync payload:", payload);
      
      const response = await AxiosClient.post("/users", payload, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      });

      console.log("Sync successful, user data:", response.data);
      return response.data;
    } catch (error) {
      console.error("Sync error:", error);
      throw new Error(`Failed to sync user: ${error}`);
    }
  }

  async getUserByAuth0Id(auth0Id: string, token: string): Promise<BackendUser> {
    try {
      console.log(`Fetching user profile for auth0 ID: ${auth0Id}`);
      
      const response = await AxiosClient.get(`/users/by-auth0/${auth0Id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log("User profile data:", response.data);
      
      // Verify we have an ID
      if (!response.data.id) {
        console.error("User ID is missing in response:", response.data);
        throw new Error("User ID is missing in backend response");
      }

      return response.data;
    } catch (error) {
      console.error("Profile fetch error:", error);
      throw new Error(`Failed to fetch user profile: ${error}`);
    }
  }

  async syncAndLoadUser(auth0User: any, token: string): Promise<User> {
    // 1. Sync user info to backend
    const syncPayload: SyncUserPayload = {
      sub: auth0User.sub,
      email: auth0User.email,
      name: auth0User.name || "", // Handle potential undefined name
    };
    
    await this.syncUser(syncPayload, token);

    // 2. Fetch full user profile from backend
    const userData = await this.getUserByAuth0Id(auth0User.sub, token);
    
    // Transform backend response to frontend interface
    return {
      id: userData.id,
      name: userData.name,
      email: userData.email,
      auth0_id: userData.auth0_sub || auth0User.sub, // Map auth0_sub to auth0_id
      role: userData.role || 'student'
    };
  }
}

export const userProviderService = new UserProviderService();