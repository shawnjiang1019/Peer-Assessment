'use client';
import { useEffect, useState, useCallback, useMemo } from 'react';
import { Student, SurveyInstance, studentService } from '@/app/student/studentlogic';
import { useAuth0 } from '@auth0/auth0-react';
import { useUser } from '@/providers/user-provider';

interface Question {
  id: string;
  text: string;
  subtext: string;
}

interface SurveyAnswer {
  studentId: number;
  questionId: string;
  value: number;
}

interface SurveyProps {
  questions: Question[];
  groupID: number;
  courseID: number;
  studentID: number;
  courseCode: string;
}

// Separate component for option buttons
const OptionButton = ({ 
  value, 
  selected, 
  onClick 
}: { 
  value: number; 
  selected: boolean; 
  onClick: () => void; 
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all text-sm
      ${selected 
        ? 'bg-blue-600 text-white transform scale-110' 
        : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
      }`}
    aria-pressed={selected}
  >
    {value}
  </button>
);

// Table cell component for student-question intersection
const SurveyCell = ({
  student,
  questionId,
  selectedValue,
  onSelect,
  showError,
  isAnswered
}: {
  student: Student;
  questionId: string;
  selectedValue?: number;
  onSelect: (value: number) => void;
  showError: boolean;
  isAnswered: boolean;
}) => {
  const isMissing = !isAnswered && showError;

  return (
    <td 
      className={`p-3 border-r border-gray-200 text-center transition-all ${
        isMissing 
          ? 'bg-red-50 border-red-200 missing-answer' 
          : 'bg-white hover:bg-gray-50'
      }`}
    >
      <div className="flex justify-center gap-1">
        {[1, 2, 3, 4, 5].map((value) => (
          <OptionButton 
            key={value}
            value={value}
            selected={selectedValue === value}
            onClick={() => onSelect(value)}
          />
        ))}
      </div>
      {isMissing && (
        <div className="text-red-600 text-xs mt-1">Required</div>
      )}
    </td>
  );
};

// Custom hook for survey logic (unchanged)
const useSurveyLogic = (groupID: number, questions: Question[]) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [answers, setAnswers] = useState<Map<string, number>>(new Map());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStudents = async () => {
      try {
        const data = await studentService.getStudentsInGroup(groupID);
        setStudents(data || []);
      } catch (error) {
        console.error('Failed to load students:', error);
        setStudents([]);
      } finally {
        setLoading(false);
      }
    };
    loadStudents();
  }, [groupID]);

  const setAnswer = useCallback((studentId: number, questionId: string, value: number) => {
    const key = `${studentId}-${questionId}`;
    setAnswers(prev => new Map(prev).set(key, value));
  }, []);

  const getAnswer = useCallback((studentId: number, questionId: string): number | undefined => {
    return answers.get(`${studentId}-${questionId}`);
  }, [answers]);

  const isAnswered = useCallback((studentId: number, questionId: string): boolean => {
    return answers.has(`${studentId}-${questionId}`);
  }, [answers]);

  // Memoized calculations
  const totalRequired = useMemo(() => 
    students.length * questions.length, 
    [students.length, questions.length]
  );

  const currentAnswers = answers.size;
  const isComplete = currentAnswers === totalRequired;

  const missingAnswers = useMemo(() => {
    const missing: Array<{ studentName: string; questionText: string }> = [];
    
    students.forEach(student => {
      questions.forEach(question => {
        if (!isAnswered(student.id, question.id)) {
          missing.push({
            studentName: student.name,
            questionText: question.text
          });
        }
      });
    });
    
    return missing;
  }, [students, questions, isAnswered]);

  return {
    students,
    answers,
    loading,
    setAnswer,
    getAnswer,
    isAnswered,
    totalRequired,
    currentAnswers,
    isComplete,
    missingAnswers
  };
};

// Main Survey Component
const Survey = ({ questions, groupID, courseID, studentID, courseCode }: SurveyProps) => {
  //const { user } = useAuth0();
  const { user } = useUser();
  
  const {
    students,
    loading,
    setAnswer,
    getAnswer,
    isAnswered,
    totalRequired,
    currentAnswers,
    isComplete,
    missingAnswers
  } = useSurveyLogic(groupID, questions);

  const [submitted, setSubmitted] = useState(false);
  const [showError, setShowError] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSelect = useCallback((studentId: number, questionId: string, value: number) => {
    setAnswer(studentId, questionId, value);
    if (showError) {
      setShowError(false);
    }
  }, [setAnswer, showError]);
  
  const createSurveyPayloads = useCallback((): SurveyInstance[] => {
    const payloads: SurveyInstance[] = [];
    const evaluatorId = user?.id ?? 313785;
    
    students.forEach(student => {
      questions.forEach(question => {
        const answer = getAnswer(student.id, question.id);
        
        if (answer !== undefined) {
          payloads.push({
            evaluator_id: studentID,
            question_id: question.id,
            answer: answer,
            evaluatee_id: student.id,
            group_id: groupID,
            course_id: courseID,
            course_code: courseCode
          });
        }
      });
    });
    console.log(payloads);
    return payloads;
  }, [students, questions, getAnswer, groupID, courseID]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isComplete) {
      setShowError(true);
      const firstMissing = document.querySelector('.missing-answer');
      firstMissing?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setSubmitting(true);
    
    try {
      const payloads = createSurveyPayloads();
      console.log('Survey payloads:', payloads);
      
      // Submit all responses
      for (const payload of payloads) {
        console.log('Submitting:', payload);
        await studentService.postSurveyInstance(payload);
      }
      
      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting survey:', error);
      setShowError(true);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4 text-center">
        <div className="animate-pulse">Loading students...</div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="p-4 bg-green-100 text-green-800 rounded-lg text-center">
        <h3 className="text-lg font-semibold mb-2">Thank you for completing the survey!</h3>
        <p>All responses have been recorded successfully.</p>
        <div className="mt-4 text-sm">
          <p>Submitted {currentAnswers} responses for {students.length} students across {questions.length} questions.</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-full mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Survey</h2>
      
      {/* Progress indicator */}
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span>Progress</span>
          <span>{currentAnswers}/{totalRequired} completed</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentAnswers / totalRequired) * 100}%` }}
          />
        </div>
      </div>

      {/* Error message */}
      {showError && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <h4 className="font-semibold mb-2">Please complete all questions:</h4>
          <ul className="text-sm space-y-1">
            {missingAnswers.slice(0, 5).map((missing, index) => (
              <li key={index}>
                • {missing.studentName} - {missing.questionText}
              </li>
            ))}
            {missingAnswers.length > 5 && (
              <li className="text-gray-600">
                ... and {missingAnswers.length - 5} more
              </li>
            )}
          </ul>
        </div>
      )}

      {/* Rating scale legend */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-sm font-semibold mb-2">Rating Scale:</h3>
        <div className="flex justify-center gap-6 text-sm">
          <span>1 - Poor</span>
          <span>2 - Fair</span>
          <span>3 - Good</span>
          <span>4 - Very Good</span>
          <span>5 - Excellent</span>
        </div>
      </div>
      
      {/* Survey Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300 bg-white">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-3 text-left font-semibold sticky left-0 bg-gray-100 z-10">
                Student
              </th>
              {questions.map((question) => (
                <th 
                  key={question.id} 
                  className="border border-gray-300 p-3 text-center font-semibold min-w-[200px]"
                >
                  <div className="mb-2">{question.text}</div>
                  <div className="text-xs text-gray-600 font-normal">
                    {question.subtext}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id} className="hover:bg-gray-50">
                <td className="border border-gray-300 p-3 font-medium sticky left-0 bg-white z-10">
                  <div className="flex items-center justify-between">
                    <span>{student.name}</span>
                    <div className="flex gap-1">
                      {questions.map((question) => (
                        <div
                          key={question.id}
                          className={`w-2 h-2 rounded-full ${
                            isAnswered(student.id, question.id)
                              ? 'bg-green-500'
                              : 'bg-gray-300'
                          }`}
                          title={`${question.text}: ${
                            isAnswered(student.id, question.id) ? 'Answered' : 'Not answered'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </td>
                {questions.map((question) => (
                  <SurveyCell
                    key={question.id}
                    student={student}
                    questionId={question.id}
                    selectedValue={getAnswer(student.id, question.id)}
                    onSelect={(value) => handleSelect(student.id, question.id, value)}
                    showError={showError}
                    isAnswered={isAnswered(student.id, question.id)}
                  />
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8">
        <button 
          type="submit" 
          className={`w-full py-3 rounded-lg transition font-semibold ${
            isComplete && !submitting
              ? 'bg-blue-600 text-white hover:bg-blue-700' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
          disabled={!isComplete || submitting}
        >
          {submitting 
            ? 'Submitting...'
            : isComplete 
              ? 'Submit Survey' 
              : `Complete All Questions (${currentAnswers}/${totalRequired})`
          }
        </button>
        
        {!isComplete && (
          <p className="text-center text-sm text-gray-500 mt-2">
            Please answer all questions for all students before submitting.
          </p>
        )}
      </div>
    </form>
  );
};

export default Survey;