'use client';

import { useUser } from "@auth0/nextjs-auth0";
import { Button } from "./ui/button";
import { Link } from "lucide-react";


const LoginButton = () => {
    const { user } = useUser();
    return (
    <div>
      {user ? (
        <Link href="/api/auth/logout">
            <Button>Logout</Button>
        </Link>
        
      ) : (
        <Link href="/api/auth/login">
            <Button>Login</Button>
        </Link>
      )}
    </div>
  );
}

export default LoginButton;