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
        
        const response = await fetch(`http://127.0.0.1:8080/users/by-auth0/${sub}`);
        const result: User = await response.json();

        return result.role;
    }
}

