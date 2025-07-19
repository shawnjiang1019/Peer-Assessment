'use client';

import { useState, useEffect } from "react";
import { columns, StudentData } from "./columns";
import { DataTable } from "./studentTable";

interface Props {
  courseId: number;
}

const CoursePageClient =  ({ courseId }: Props) => {
  const [studentsInCourse, setStudentsInCourse] = useState<StudentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  //Get group number of student in student_group with group_id == groups
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch(`https://peer-backend-1014214808131.us-central1.run.app/course/students?courseID=${courseId}`);
        if (!response.ok) throw new Error("Failed to fetch students");
        const data = await response.json();


        setStudentsInCourse(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [courseId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={studentsInCourse} />
    </div>
  );
};

export default CoursePageClient;



