export interface Question {
  id: string;
  text: string;
  subtext: string;
}

export const surveyQuestions: Question[] = [
  {
    id: 'q1',
    text: 'Contribution to the Team Work.',
    subtext: 'Consistently completed the share of the team’s tasks on time. Took initiative to help the team achieve its goals. Made meaningful contributions to team discussions and planning.'
    
  },
  {
    id: 'q2',
    text: 'Interacting with Teammates',
    subtext: 'Listened respectfully to others’ ideas and perspectives. Communicated clearly and effectively with team members. Helped create a positive and inclusive team atmosphere.'
  },
  {
    id: 'q3',
    text: 'Keeping the Team on Track',
    subtext: 'Listened respectfully to others’ ideas and perspectives. Communicated clearly and effectively with team members. Helped create a positive and inclusive team atmosphere.'
  },
  {
    id: 'q4',
    text: 'Expecting Quality',
    subtext: 'Helped the team stay focused on goals and deadlines. Reminded others of responsibilities when needed. Contributed to setting and maintaining a clear plan of action.'
  }
];