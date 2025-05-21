'use client';
import { useUser } from '@auth0/nextjs-auth0';
import { useState, useEffect } from 'react';
import { fetchProtectedData } from '@/lib/api';

export default function Dashboard() {
  const { user } = useUser();
  const [data, setData] = useState(null);

  useEffect(() => {
    if (user) {
      fetchProtectedData().then(setData);
    }
  }, [user]);

  return (
    <div>
      <h1>Welcome {user?.name}</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}