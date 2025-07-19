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


interface CourseData{
    code: string;
    session: string;
    lecturer_id: number;
    id: number;
}


const fetchCourses = async (lecturer_id: number): Promise<CourseData[]> => {
    const response = await fetch("https://peer-backend-1014214808131.us-central1.run.app/api/courses", {
        method: "GET",
        headers: {
            'instructorID': lecturer_id.toString()
        }
    });
    const data = await response.json();
    console.log(data);
    return data;
}

const Instructor = () => {
    const { user } = useUser();
    const [courses, setCourses] = useState<CourseData[]>([]);
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
                const coursedata = await fetchCourses(lecturerId); // Hardcoded lecturer ID for now
                setCourses(coursedata);
                
                
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to load courses");
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [user?.id]);

    if (loading) return <div>Loading courses...</div>;
    if (error) return <div>Error: {error}</div>;



    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {courses.length > 0 ? (
                courses.map((course) => (
                    
                    
                        <Card key={`${course.code}-${course.session}`} className="hover:shadow-lg transition-shadow">
                        <button type="button" onClick={() => router.push(`instructor/course/${course.id}`)}>
                        <CardHeader>
                            <CardTitle>{course.code}</CardTitle>
                            <CardDescription>{course.session} Session</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-gray-600">
                                Lecturer ID: {course.lecturer_id}
                            </p>
                        </CardContent>
                        <CardFooter>
                            <p>{course.code}</p>
                        </CardFooter>
                        </button>
                    
                    </Card>

                
                    
                ))
            ) : (
                <div className="text-gray-500">No courses found for this instructor, ID = {user?.id}</div>
            )}
        </div>
    );
    
    

}

export default Instructor;