'use client';

import { useState, useEffect } from "react";


interface Props {
  courseID: number;
}

const CoursePageClient =  ({ courseID }: Props) => {
  const [studentsInCourse, setStudentsInCourse] = useState<StudentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  //Get group number of student in student_group with group_id == groups
  useEffect(() => {

    const getGroups = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8080/group/getgroups?courseID=${courseID}`);
            if (!response.ok) throw new Error("Failed to get groups");
            const data = await response.json();
            
        }
    }

    const loadData = async () => {
      try {
        const response1 = await fetch(`http://127.0.0.1:8080/course/students?courseID=${courseID}`);
        if (!response1.ok) throw new Error("Failed to fetch students");
        const data = await response1.json();

        const groupNumbers = await fetch('http://127.0.0.1:8080/course/students?courseID=${courseId}')

        setStudentsInCourse(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [courseID]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="container mx-auto py-10">
    </div>
  );
};

export default CoursePageClient;



