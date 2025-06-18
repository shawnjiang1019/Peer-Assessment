'use client';

import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useRouter } from "next/navigation";
import { AuthService } from "./authlogic";

const AuthRedirect = () => {
    const [userServiceInstance] = useState(() => new AuthService()); // ✅ Create instance once
    const [isRedirecting, setIsRedirecting] = useState(false);
    const { user, isAuthenticated, isLoading } = useAuth0();
    const router = useRouter();
    const sub = user?.sub;
    
    useEffect(() => {
        // ✅ Create async function inside useEffect
        const handleRedirect = async () => {
            if (isLoading || isRedirecting) {
                return;
            }
            
            if (!isAuthenticated) {
                router.push('/');
                return;
            }

            if (user && sub) {
                try {
                    setIsRedirecting(true);
                    const userRole = await userServiceInstance.getUserRole(sub);
                    console.log('User role:', userRole);

                    switch (userRole) {
                        case 'instructor':
                            router.push('/instructor');
                            break;
                        case 'student':
                            router.push('/student');
                            break;
                        default:
                            router.push('/student');
                    }
                } catch (error) {
                    console.error('Error fetching user role:', error);
                    // Fallback to student page on error
                    router.push('/student');
                } finally {
                    setIsRedirecting(false);
                }
            }
        };

        // ✅ Call the async function
        handleRedirect();
    }, [user, isAuthenticated, isLoading, router, sub, userServiceInstance, isRedirecting]);

    // ✅ Show loading state while Auth0 is loading or while redirecting
    if (isLoading || isRedirecting) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-pulse">
                    {isLoading ? 'Loading...' : 'Redirecting...'}
                </div>
            </div>
        );
    }
    
    return null;
};

export default AuthRedirect;