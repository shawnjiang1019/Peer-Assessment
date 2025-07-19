import { User } from "lucide-react";

interface User {
  id: number;
  name: string;
  email: string;
  auth0_id?: string;
  role: string;
}

export class AuthService{
    async getUserRole(sub: string): Promise<string | null>{
        
        const response = await fetch(`https://peer-backend-1014214808131.us-central1.run.app/users/by-auth0/${sub}`);
        const result: User = await response.json();

        return result.role;
    }
}

