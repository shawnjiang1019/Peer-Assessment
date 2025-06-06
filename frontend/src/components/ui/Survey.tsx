'use client';
import { useState } from 'react';

interface Question {
  id: string;
  text: string;
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

const Survey = ({ questions }: SurveyProps) => {
  const [answers, setAnswers] = useState<Answers>({});
  const [submitted, setSubmitted] = useState(false);

  const handleSelect = (questionId: string, value: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Survey responses:', answers);
    setSubmitted(true);
    // Add API submission logic here
  };

  if (submitted) {
    return (
      <div className="p-4 bg-green-100 text-green-800 rounded-lg text-center">
        Thank you for completing the survey!
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Survey</h2>
      
      {questions.map((question) => (
        <fieldset key={question.id} className="mb-8 p-4 border rounded-lg">
          <legend className="text-lg font-semibold mb-3">{question.text}</legend>
          <div className="flex justify-between">
            {[1, 2, 3, 4, 5].map((value) => (
              <OptionButton 
                key={value}
                value={value}
                selected={answers[question.id] === value}
                onClick={() => handleSelect(question.id, value)}
              />
            ))}
          </div>
        </fieldset>
      ))}

      <button 
        type="submit" 
        className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        disabled={Object.keys(answers).length !== questions.length}
      >
        Submit Survey
      </button>
    </form>
  );
};

export default Survey;