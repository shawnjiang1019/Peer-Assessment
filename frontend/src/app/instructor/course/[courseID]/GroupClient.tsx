"use client";
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useAuth0 } from "@auth0/auth0-react";
import { useUser } from "@/providers/user-provider";
import { useRouter, usePathname } from 'next/navigation'
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

interface GroupData {
  courseCode: string;
  courseID: string;  // Consider renaming to courseId for consistency
  groupNumber: number;
  id: number;
}

type GroupsProps = {
  courseId: number;
};

const fetchGroups = async (courseID: number): Promise<GroupData[]> => {
  const url = new URL("https://peer-backend-1014214808131.us-central1.run.app/group/getgroups");
  url.searchParams.append('courseID', courseID.toString());
  
  const response = await fetch(url, { method: "GET" });
  return await response.json();
}

const Groups = ({ courseId }: GroupsProps) => {  // Fixed props destructuring
  const { user } = useUser();
  const [groups, setGroups] = useState<GroupData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router: AppRouterInstance = useRouter();
  const pathname: string = usePathname();

  useEffect(() => {
    //if (!user?.id) return;
    
    const loadData = async () => {
      try {
        const groupdata = await fetchGroups(courseId);
        setGroups(groupdata);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load groups");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user?.id, courseId]);  // Added courseId to dependencies

  if (loading) return <div>Loading groups...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {groups.length > 0 ? (
        groups.map((group) => (
          <Card key={group.id} className="hover:shadow-lg transition-shadow">
            <button 
              type="button" 
              onClick={() => router.push(`${pathname}/${group.id}`)}
              className="w-full text-left"
            >
              <CardHeader>
                <CardTitle>{group.courseCode}</CardTitle>
                <CardDescription>Group: {group.groupNumber}</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Course ID: {group.courseID}</p>
              </CardContent>
              <CardFooter>
                <p>Group ID: {group.id}</p>
              </CardFooter>
            </button>
          </Card>
        ))
      ) : (
        <div className="text-gray-500">
          No groups found for course ID: {courseId}
        </div>
      )}
    </div>
  );
}

export default Groups;