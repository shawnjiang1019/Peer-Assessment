'use client'

import Survey from '@/components/ui/Survey';
import { surveyQuestions } from '../../../surveyQuestions';
import { studentService } from '../../../../studentlogic';
import { useEffect, useState } from 'react';
import { Student, Group, SurveyInstance } from '../../../../studentlogic';
import { useUser } from '@/providers/user-provider';

interface PageProps {
  params: Promise<{
    groupID: string;
    courseID: number;
    courseCode: string;
  }>;
}

export default function SurveyPage({ params } : PageProps) {
  const [students, setStudents] = useState<Student[]>([]);
  const [isloading, setIsLoading] = useState<boolean>(true);
  const [studentNum, setStudentNum] = useState<number>(0);
  const [resolvedParams, setResolvedParams] = useState<{
    groupID: string;
    courseID: number;
    courseCode: string;
  } | null>(null);
  const { user, loading } = useUser();
  
  // Resolve params in useEffect since this is a client component
  useEffect(() => {
    const resolveParams = async () => {
      const resolved = await params;
      setResolvedParams(resolved);
    };
    resolveParams();
  }, [params]);

  useEffect(() => {
    if (!resolvedParams) return;
    
    const getStudentsInGroup = async () => {
      const data: Student[] = await studentService.getStudentsInGroup(parseInt(resolvedParams.groupID));
      setStudents(data || []);
    };

    getStudentsInGroup();
  }, [resolvedParams]);

  useEffect(() => {
    const getStudentID = async () => {
      if (!user?.email) {
        console.log('User email not available yet');
        return;
      }

      try {
        console.log('Fetching student ID for email:', user.email);
        const studentID: number = await studentService.getStudentID(user.email);
        console.log('Student ID retrieved:', studentID);
        setStudentNum(studentID);
      } catch (error) {
        console.error('Failed to fetch student ID:', error);
      }
    };
    getStudentID();
  }, [user?.email]);

  useEffect(() => {
    // Set loading to false when both user and students are loaded
    if (!loading && students.length >= 0) { // >= 0 to handle empty arrays
      setIsLoading(false);
    }
  }, [loading, students]);

  if (loading || isloading || !resolvedParams) {
    return (
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">Loading students...</div>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center text-gray-600">
            Please log in to access the survey.
          </div>
        </div>
      </main>
    );
  }

  if (students.length === 0) {
    return (
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center text-gray-600">
            No students found in this group.
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Group Survey
          </h1>
          <p className="text-gray-600">
            Complete the survey for each student in the group
          </p>
        </div>
        
        <div className="space-y-8">
          <Survey 
            questions={surveyQuestions} 
            groupID={parseInt(resolvedParams.groupID)}
            studentID={studentNum}
            courseID={resolvedParams.courseID}
            courseCode={resolvedParams.courseCode}
            // studentId={student.id}
            // studentName={student.name}
          />
        </div>
      </div>
    </main>
  );
}