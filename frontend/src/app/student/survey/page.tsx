import Survey from '@/components/ui/Survey';
import { surveyQuestions } from './surveyQuestions';
export default function SurveyPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12 content-center">
      <div className="container mx-auto px-4 content-center">
        <Survey questions={surveyQuestions} />
      </div>
    </main>
  );
}