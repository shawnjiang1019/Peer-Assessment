export interface Question {
  id: string;
  text: string;
}

export const surveyQuestions: Question[] = [
  {
    id: 'q1',
    text: 'How satisfied are you with our product?'
  },
  {
    id: 'q2',
    text: 'How likely are you to recommend us to others?'
  },
  {
    id: 'q3',
    text: 'How would you rate our customer support?'
  }
];