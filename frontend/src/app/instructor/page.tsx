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

interface CourseData{
    code: string;
    session: string;
    lecturer_id: number;
}

const fetchCourses = async (lecturer_id: number): Promise<CourseData[]> => {
    const response = await fetch(`http://127.0.0.1:8080/courses/${lecturer_id}`);
    const data = await response.json();
    return data;
}

const Instructor = () => {
    const [courses, setCourses] = useState<CourseData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                const coursedata = await fetchCourses(1); // Hardcoded lecturer ID for now
                setCourses(coursedata);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to load courses");
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    if (loading) return <div>Loading courses...</div>;
    if (error) return <div>Error: {error}</div>;



    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {courses.length > 0 ? (
                courses.map((course) => (

                    <Card key={`${course.code}-${course.session}`} className="hover:shadow-lg transition-shadow">
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
                    </Card>
                ))
            ) : (
                <div className="text-gray-500">No courses found for this instructor</div>
            )}
        </div>
    );
    
    

}

export default Instructor;