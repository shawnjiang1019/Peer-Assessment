'use client'
import { useUser } from "@/providers/user-provider";

export default function UserProfile() {
  const { user, loading, error } = useUser();

  if (loading) return <div>Loading profile...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!user) return <div>Please log in to view profile</div>;

  return (
    <div className="profile-card">
      <h2>{user.name}</h2>
      <p>Email: {user.email}</p>
      <p>User ID: {user.id}</p>
    </div>
  );
}