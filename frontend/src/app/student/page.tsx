"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { StudentService, Group } from "./studentlogic";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useUser } from "@/providers/user-provider";

const Student = () => {
  const { user } = useUser();
  const router = useRouter();
  const [studentServiceInstance] = useState(() => new StudentService());
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (!user?.id) return;
    
    
    const loadData = async () => {
      try {
        if (!user) {
          throw new Error("User not found");
        }
        const studentId = await studentServiceInstance.getStudentID(user.email);
        const groupsData = await studentServiceInstance.getGroups(studentId);
        
        if (groupsData) {
          setGroups(groupsData);
        } else {
          setGroups([]);
        }
        
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load groups");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user?.id, studentServiceInstance]);

  if (loading) return <div>Loading surveys...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-6">
        You have the following surveys to complete:
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {groups.length > 0 ? (
          groups.map((group) => (
            <Card key={`${group.id}`} className="hover:shadow-lg transition-shadow">
              <button type="button" onClick={() => router.push(`student/survey/${group.id}/${group.courseID}/${group.courseCode}`)}>
                <CardHeader>
                  <CardTitle>{group.courseCode}</CardTitle>
                  <CardDescription>Group {group.groupNumber}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    Group ID: {group.id}
                  </p>
                </CardContent>
                <CardFooter>
                  <p>Begin Survey</p>
                </CardFooter>
              </button>
            </Card>
          ))
        ) : (
          <div className="text-gray-500">No groups found for this student, ID = {user?.id}</div>
        )}
      </div>
    </div>
  );
};

export default Student;