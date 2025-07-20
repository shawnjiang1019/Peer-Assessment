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
import { useRouter, usePathname  } from 'next/navigation'
import { Group } from "next/dist/shared/lib/router/utils/route-regex";


interface StudentData{
    email: string;
    id: number;
    student_id: number;
    firstname: string;
    utorid: number;
    name: string;
    lastname: string;
}

interface Props{
  groupID: number;
}


const fetchGroups = async (groupID: number): Promise<StudentData[]> => {
    const url: URL = new URL("https://peer-backend-1014214808131.us-central1.run.app/group/groups/");
    url.searchParams.append('groupID', groupID.toString());

    const response = await fetch(url, {
        method: "GET",
    });
    const data: StudentData[] = await response.json();
    return data;
}

const GroupStudentClient = ({ groupID } : Props) => {
    const { user } = useUser();
    const [students, setStudents] = useState<StudentData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const pathname = usePathname();

    const router = useRouter();

    useEffect(() => {
        if (!user?.id) return;
        const lecturerId = user.id;
        const loadData = async () => {
            try {
                if (!user){
                    throw new Error("Uh Oh");
                }
                
                const studentdata: StudentData[] = await fetchGroups(groupID); 
                setStudents(studentdata);
                
                
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to load students in group");
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [user?.id]);

    if (loading) return <div>Loading students in group...</div>;
    if (error) return <div>Error: {error}</div>;



    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {students.length > 0 ? (
                students.map((student) => (
                    
                    
                        <Card key={`${student.id}`} className="hover:shadow-lg transition-shadow">
                        
                        <CardHeader>
                            <CardTitle>{student.name}</CardTitle>
                            <CardDescription>Group: {groupID}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-gray-600">
                                {student.email}
                            </p>
                        </CardContent>
                        <CardFooter>
                            <p>{student.utorid}</p>
                        </CardFooter>
                        
                    
                    </Card>

                
                    
                ))
            ) : (
                <div className="text-gray-500">No groups found for this course, ID = {groupID}</div>
            )}
        </div>
    );
    
    

}

export default GroupStudentClient;