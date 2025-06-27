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
    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all
      ${selected 
        ? 'bg-blue-600 text-white transform scale-110' 
        : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
      }`}
    aria-pressed={selected}
  >
    {value}
  </button>
);

// Separate component for student question row
const StudentQuestionRow = ({
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
    <div 
      className={`p-4 rounded-lg shadow transition-all ${
        isMissing 
          ? 'bg-red-50 border border-red-200 missing-answer' 
          : 'bg-white'
      }`}
    >
      <div className="mb-3 flex items-center justify-between">
        <span className="text-lg font-semibold">{student.name}</span>
        {isAnswered && (
          <span className="text-green-600 text-sm">✓ Answered</span>
        )}
        {isMissing && (
          <span className="text-red-600 text-sm">⚠ Required</span>
        )}
      </div>
      <div className="flex justify-between">
        {[1, 2, 3, 4, 5].map((value) => (
          <OptionButton 
            key={value}
            value={value}
            selected={selectedValue === value}
            onClick={() => onSelect(value)}
          />
        ))}
      </div>
    </div>
  );
};

// Custom hook for survey logic
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
    
    //user?.sub ? parseInt(user.sub.replace('auth0|', '')) : 313785;
    
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
        // await studentService.submitSurveyResponse(payload);
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
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md">
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
      
      {questions.map((question) => (
        <fieldset key={question.id} className="mb-8 p-4 border rounded-lg">
          <legend className="text-lg font-semibold mb-3">{question.text}</legend>
          <p className="text-gray-600 mb-4">{question.subtext}</p>
          <div className="space-y-6">
            {students.map((student) => (
              <StudentQuestionRow
                key={student.id}
                student={student}
                questionId={question.id}
                selectedValue={getAnswer(student.id, question.id)}
                onSelect={(value) => handleSelect(student.id, question.id, value)}
                showError={showError}
                isAnswered={isAnswered(student.id, question.id)}
              />
            ))}
          </div>
        </fieldset>
      ))}

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