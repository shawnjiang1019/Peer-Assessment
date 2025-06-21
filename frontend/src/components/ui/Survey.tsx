'use client';
import { useEffect, useState } from 'react';
import { Student, studentService } from '@/app/student/studentlogic';

interface Question {
  id: string;
  text: string;
  subtext: string;
}

interface Answers {
  [key: string]: number; // Question ID to selected value
}

interface OptionButtonProps {
  value: number;
  selected: boolean;
  onClick: () => void;
}

interface SurveyProps {
  questions: Question[];
  groupID: number;
}

const OptionButton = ({ value, selected, onClick }: OptionButtonProps) => (
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

const Survey = (SurveyParams: SurveyProps) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [answers, setAnswers] = useState<Answers>({});
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [showError, setShowError] = useState<boolean>(false);

  useEffect(() => {
    const getStudents = async () => {
      const data: Student[] = await studentService.getStudentsInGroup(SurveyParams.groupID);
      setStudents(data || []);
      setLoading(false);
    }
    getStudents();
  }, [SurveyParams]);

  const handleSelect = (studentId: number, questionId: string, value: number) => {
    setAnswers(prev => ({
      ...prev,
      [`${studentId}-${questionId}`]: value
    }));
    // Hide error when user starts answering
    if (showError) {
      setShowError(false);
    }
  };

  // Calculate total required answers
  const totalRequiredAnswers = students.length * SurveyParams.questions.length;
  const currentAnswers = Object.keys(answers).length;
  const isComplete = currentAnswers === totalRequiredAnswers;

  // Get missing answers for better user feedback
  const getMissingAnswers = () => {
    const missing: { studentName: string; questionText: string }[] = [];
    
    students.forEach(student => {
      SurveyParams.questions.forEach(question => {
        const key = `${student.id}-${question.id}`;
        if (!answers[key]) {
          missing.push({
            studentName: student.name,
            questionText: question.text
          });
        }
      });
    });
    
    return missing;
  };

  // Check if specific student-question combo is answered
  const isAnswered = (studentId: number, questionId: string) => {
    return answers[`${studentId}-${questionId}`] !== undefined;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isComplete) {
      setShowError(true);
      // Scroll to first missing answer
      const firstMissing = document.querySelector('.missing-answer');
      if (firstMissing) {
        firstMissing.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    console.log('Survey responses:', answers);
    setSubmitted(true);
    // Add API submission logic here
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
      </div>
    );
  }

  const missingAnswers = getMissingAnswers();

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md content-center">
      <h2 className="text-2xl font-bold mb-6 text-center">Survey</h2>
      
      {/* Progress indicator */}
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span>Progress</span>
          <span>{currentAnswers}/{totalRequiredAnswers} completed</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentAnswers / totalRequiredAnswers) * 100}%` }}
          ></div>
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
      
      {SurveyParams.questions.map((question) => (
        <fieldset key={question.id} className="mb-8 p-4 border rounded-lg">
          <legend className="text-lg font-semibold mb-3">{question.text}</legend>
          <p className="text-gray-600 mb-4">{question.subtext}</p>
          <div className="space-y-6">
            {students.map((student) => {
              const isStudentQuestionAnswered = isAnswered(student.id, question.id);
              const isMissing = !isStudentQuestionAnswered;
              
              return (
                <div 
                  key={student.id} 
                  className={`p-4 rounded-lg shadow transition-all ${
                    isMissing && showError 
                      ? 'bg-red-50 border border-red-200 missing-answer' 
                      : 'bg-white'
                  }`}
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-lg font-semibold">{student.name}</span>
                    {isStudentQuestionAnswered && (
                      <span className="text-green-600 text-sm">✓ Answered</span>
                    )}
                    {isMissing && showError && (
                      <span className="text-red-600 text-sm">⚠ Required</span>
                    )}
                  </div>
                  <div className="flex justify-between">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <OptionButton 
                        key={value}
                        value={value}
                        selected={answers[`${student.id}-${question.id}`] === value}
                        onClick={() => handleSelect(student.id, question.id, value)}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </fieldset>
      ))}

      <div className="mt-8">
        <button 
          type="submit" 
          className={`w-full py-3 rounded-lg transition font-semibold ${
            isComplete
              ? 'bg-blue-600 text-white hover:bg-blue-700' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
          disabled={!isComplete}
        >
          {isComplete 
            ? 'Submit Survey' 
            : `Complete All Questions (${currentAnswers}/${totalRequiredAnswers})`
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