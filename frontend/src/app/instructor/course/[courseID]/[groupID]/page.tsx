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
import { useRouter } from 'next/navigation'
import { Group } from "next/dist/shared/lib/router/utils/route-regex";


interface GroupData{
    courseCode: string;
    courseID: string;
    groupNumber: number;
    id: number;
}


const fetchGroups = async (courseID: number): Promise<GroupData[]> => {
    const url: URL = new URL("http://127.0.0.1:8080/group/getgroups");
    url.searchParams.append('courseID', courseID.toString());

    const response = await fetch(url, {
        method: "GET",
    });
    const data: GroupData[] = await response.json();
    console.log(data);
    return data;
}

const Groups = ({ params }: { params: { courseID: number }}) => {
    const { user } = useUser();
    const [groups, setGroups] = useState<GroupData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    


    const router = useRouter();

    useEffect(() => {
        if (!user?.id) return;
        const lecturerId = user.id;
        const loadData = async () => {
            try {
                if (!user){
                    throw new Error("Uh Oh");
                }
                const groupdata: GroupData[] = await fetchGroups(params.courseID); // Hardcoded lecturer ID for now
                setGroups(groupdata);
                
                
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to load groups");
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [user?.id]);

    if (loading) return <div>Loading groups...</div>;
    if (error) return <div>Error: {error}</div>;



    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {groups.length > 0 ? (
                groups.map((group) => (
                    
                    
                        <Card key={`${group.id}`} className="hover:shadow-lg transition-shadow">
                        <button type="button" onClick={() => router.push(`instructor/course/${group.id}`)}>
                        <CardHeader>
                            <CardTitle>{group.courseCode}</CardTitle>
                            <CardDescription>Group: {group.courseID}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-gray-600">
                                
                            </p>
                        </CardContent>
                        <CardFooter>
                            <p>{group.id}</p>
                        </CardFooter>
                        </button>
                    
                    </Card>

                
                    
                ))
            ) : (
                <div className="text-gray-500">No groups found for this course, ID = {params.courseID}</div>
            )}
        </div>
    );
    
    

}

export default Groups;