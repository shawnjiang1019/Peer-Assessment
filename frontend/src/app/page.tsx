'use client';
import { useAuth0 } from '@auth0/auth0-react';
import { useRouter } from 'next/navigation';
import LoginButton from '@/components/loginbutton';
export default function Home() {
  const { isAuthenticated } = useAuth0();
  const router = useRouter();

  if (isAuthenticated) {
    router.push('/instructor');
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-6">Peer Assessment System</h1>
        <LoginButton/>
      </div>
    </div>
  );
}