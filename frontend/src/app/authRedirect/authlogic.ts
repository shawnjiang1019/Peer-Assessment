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
        const key: string = process.env.DEV;
        const response = await fetch(`${key}/users/by-auth0/${sub}`);
        const result: User = await response.json();

        return result.role;
    }
}

