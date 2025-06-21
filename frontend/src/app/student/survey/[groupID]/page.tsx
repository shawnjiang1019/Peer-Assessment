'use client'

import Survey from '@/components/ui/Survey';
import { surveyQuestions } from '../surveyQuestions';
import { studentService } from '../../studentlogic';
import { useEffect, useState } from 'react';
import { Student, Group } from '../../studentlogic';


interface PageProps {
  params: {
    groupID: string;
  };
}


export default function SurveyPage({ params } : PageProps) {

  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(()=> {
    const getStudentsInGroup = async () => {
      const data: Student[] = await studentService.getStudentsInGroup(parseInt(params.groupID));
      setStudents(data || []);
      setLoading(false);
    }
    getStudentsInGroup();

  }, [])

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">Loading students...</div>
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
                groupID={parseInt(params.groupID)}
                // studentId={student.id}
                // studentName={student.name}
              />

        </div>
      </div>
    </main>
  );
}