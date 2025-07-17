'use client';
import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useRouter } from "next/navigation";
import { useUser } from "@/providers/user-provider";

const AuthRedirect = () => {
    const [isRedirecting, setIsRedirecting] = useState(false);
    const { isAuthenticated, isLoading: auth0Loading } = useAuth0();
    const { user, loading: userLoading, error } = useUser(); // Use context instead of API call
    const router = useRouter();

    useEffect(() => {
        const handleRedirect = async () => {
            // Wait for both Auth0 and user context to finish loading
            if (auth0Loading || userLoading || isRedirecting) {
                return;
            }

            if (!isAuthenticated) {
                router.push('/');
                return;
            }

            if (user) {
                try {
                    setIsRedirecting(true);
                    console.log('User role:', user.role);

                    switch (user.role) {
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
                    console.error('Error during redirect:', error);
                    // Fallback to student page on error
                    router.push('/student');
                } finally {
                    setIsRedirecting(false);
                }
            } else if (error) {
                console.error('User context error:', error);
                // Handle error case - maybe redirect to error page or fallback
                router.push('/student');
            }
        };

        handleRedirect();
    }, [user, isAuthenticated, auth0Loading, userLoading, router, isRedirecting, error]);

    // Show loading state while Auth0 is loading, user is loading, or while redirecting
    if (auth0Loading || userLoading || isRedirecting) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-pulse">
                    {auth0Loading ? 'Authenticating...' : 
                     userLoading ? 'Loading user data...' : 
                     'Redirecting...'}
                </div>
            </div>
        );
    }

    return null;
};

export default AuthRedirect;