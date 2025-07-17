// 'use client'

// import { useEffect, useState } from "react";
// import { Plus, Trash2, Edit2, Save, X } from 'lucide-react';

// export interface TableSurveyProps{
    
// }


// const SurveyTable = () => {
//   const [questions, setQuestions] = useState([
//     'Communication Skills',
//     'Technical Expertise',
//     'Teamwork',
//     'Leadership Potential'
//   ]);
  
//   const [people, setPeople] = useState([
//     'John Smith',
//     'Sarah Johnson',
//     'Mike Chen'
//   ]);
  
//   const [responses, setResponses] = useState({});
//   const [editingQuestion, setEditingQuestion] = useState(null);
//   const [editingPerson, setEditingPerson] = useState(null);
//   const [newQuestionText, setNewQuestionText] = useState('');
//   const [newPersonText, setNewPersonText] = useState('');

//   const getResponseKey = (person, question) => `${person}-${question}`;

//   const handleResponseChange = (person, question, value) => {
//     const key = getResponseKey(person, question);
//     setResponses(prev => ({
//       ...prev,
//       [key]: value
//     }));
//   };

//   const addQuestion = () => {
//     const newQuestion = `Question ${questions.length + 1}`;
//     setQuestions(prev => [...prev, newQuestion]);
//   };

//   const addPerson = () => {
//     const newPerson = `Person ${people.length + 1}`;
//     setPeople(prev => [...prev, newPerson]);
//   };

//   const removeQuestion = (index) => {
//     const questionToRemove = questions[index];
//     setQuestions(prev => prev.filter((_, i) => i !== index));
//     // Clean up responses for removed question
//     setResponses(prev => {
//       const newResponses = { ...prev };
//       Object.keys(newResponses).forEach(key => {
//         if (key.endsWith(`-${questionToRemove}`)) {
//           delete newResponses[key];
//         }
//       });
//       return newResponses;
//     });
//   };

//   const removePerson = (index) => {
//     const personToRemove = people[index];
//     setPeople(prev => prev.filter((_, i) => i !== index));
//     // Clean up responses for removed person
//     setResponses(prev => {
//       const newResponses = { ...prev };
//       Object.keys(newResponses).forEach(key => {
//         if (key.startsWith(`${personToRemove}-`)) {
//           delete newResponses[key];
//         }
//       });
//       return newResponses;
//     });
//   };

//   const saveQuestionEdit = (index) => {
//     const oldQuestion = questions[index];
//     setQuestions(prev => prev.map((q, i) => i === index ? newQuestionText : q));
    
//     // Update response keys
//     if (oldQuestion !== newQuestionText) {
//       setResponses(prev => {
//         const newResponses = { ...prev };
//         Object.keys(newResponses).forEach(key => {
//           if (key.endsWith(`-${oldQuestion}`)) {
//             const person = key.split(`-${oldQuestion}`)[0];
//             const newKey = getResponseKey(person, newQuestionText);
//             newResponses[newKey] = newResponses[key];
//             delete newResponses[key];
//           }
//         });
//         return newResponses;
//       });
//     }
    
//     setEditingQuestion(null);
//     setNewQuestionText('');
//   };

//   const savePersonEdit = (index) => {
//     const oldPerson = people[index];
//     setPeople(prev => prev.map((p, i) => i === index ? newPersonText : p));
    
//     // Update response keys
//     if (oldPerson !== newPersonText) {
//       setResponses(prev => {
//         const newResponses = { ...prev };
//         Object.keys(newResponses).forEach(key => {
//           if (key.startsWith(`${oldPerson}-`)) {
//             const question = key.substring(`${oldPerson}-`.length);
//             const newKey = getResponseKey(newPersonText, question);
//             newResponses[newKey] = newResponses[key];
//             delete newResponses[key];
//           }
//         });
//         return newResponses;
//       });
//     }
    
//     setEditingPerson(null);
//     setNewPersonText('');
//   };

//   const exportData = () => {
//     const data = {
//       questions,
//       people,
//       responses
//     };
//     console.log('Survey Data:', data);
//     alert('Survey data exported to console. Check browser developer tools.');
//   };

//   return (
//     <div className="p-6 max-w-6xl mx-auto bg-white">
//       <div className="mb-6">
//         <h1 className="text-3xl font-bold text-gray-800 mb-2">Survey Evaluation Table</h1>
//         <p className="text-gray-600">Evaluate people across different criteria. Click cells to rate, edit names by clicking the edit icon.</p>
//       </div>

//       <div className="mb-4 flex gap-2">
//         <button 
//           onClick={addQuestion}
//           className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
//         >
//           <Plus size={16} />
//           Add Question
//         </button>
//         <button 
//           onClick={addPerson}
//           className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
//         >
//           <Plus size={16} />
//           Add Person
//         </button>
//         <button 
//           onClick={exportData}
//           className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
//         >
//           Export Data
//         </button>
//       </div>

//       <div className="overflow-x-auto border rounded-lg shadow-sm">
//         <table className="w-full border-collapse bg-white">
//           <thead>
//             <tr className="bg-gray-50">
//               <th className="border p-3 text-left font-semibold text-gray-700 min-w-[150px]">
//                 Person / Question
//               </th>
//               {questions.map((question, index) => (
//                 <th key={question} className="border p-3 text-center font-semibold text-gray-700 min-w-[140px]">
//                   <div className="flex items-center justify-center gap-2">
//                     {editingQuestion === index ? (
//                       <div className="flex items-center gap-1">
//                         <input
//                           type="text"
//                           value={newQuestionText}
//                           onChange={(e) => setNewQuestionText(e.target.value)}
//                           className="px-2 py-1 border rounded text-sm w-24"
//                           onKeyPress={(e) => e.key === 'Enter' && saveQuestionEdit(index)}
//                         />
//                         <button
//                           onClick={() => saveQuestionEdit(index)}
//                           className="text-green-600 hover:text-green-800"
//                         >
//                           <Save size={14} />
//                         </button>
//                         <button
//                           onClick={() => {
//                             setEditingQuestion(null);
//                             setNewQuestionText('');
//                           }}
//                           className="text-red-600 hover:text-red-800"
//                         >
//                           <X size={14} />
//                         </button>
//                       </div>
//                     ) : (
//                       <>
//                         <span className="text-sm">{question}</span>
//                         <button
//                           onClick={() => {
//                             setEditingQuestion(index);
//                             setNewQuestionText(question);
//                           }}
//                           className="text-gray-400 hover:text-gray-600"
//                         >
//                           <Edit2 size={14} />
//                         </button>
//                         {questions.length > 1 && (
//                           <button
//                             onClick={() => removeQuestion(index)}
//                             className="text-red-400 hover:text-red-600"
//                           >
//                             <Trash2 size={14} />
//                           </button>
//                         )}
//                       </>
//                     )}
//                   </div>
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             {people.map((person, personIndex) => (
//               <tr key={person} className="hover:bg-gray-50">
//                 <td className="border p-3 font-medium text-gray-700 bg-gray-50">
//                   <div className="flex items-center gap-2">
//                     {editingPerson === personIndex ? (
//                       <div className="flex items-center gap-1">
//                         <input
//                           type="text"
//                           value={newPersonText}
//                           onChange={(e) => setNewPersonText(e.target.value)}
//                           className="px-2 py-1 border rounded text-sm flex-1"
//                           onKeyPress={(e) => e.key === 'Enter' && savePersonEdit(personIndex)}
//                         />
//                         <button
//                           onClick={() => savePersonEdit(personIndex)}
//                           className="text-green-600 hover:text-green-800"
//                         >
//                           <Save size={14} />
//                         </button>
//                         <button
//                           onClick={() => {
//                             setEditingPerson(null);
//                             setNewPersonText('');
//                           }}
//                           className="text-red-600 hover:text-red-800"
//                         >
//                           <X size={14} />
//                         </button>
//                       </div>
//                     ) : (
//                       <>
//                         <span>{person}</span>
//                         <button
//                           onClick={() => {
//                             setEditingPerson(personIndex);
//                             setNewPersonText(person);
//                           }}
//                           className="text-gray-400 hover:text-gray-600"
//                         >
//                           <Edit2 size={14} />
//                         </button>
//                         {people.length > 1 && (
//                           <button
//                             onClick={() => removePerson(personIndex)}
//                             className="text-red-400 hover:text-red-600"
//                           >
//                             <Trash2 size={14} />
//                           </button>
//                         )}
//                       </>
//                     )}
//                   </div>
//                 </td>
//                 {questions.map((question) => (
//                   <td key={question} className="border p-3 text-center">
//                     <select
//                       value={responses[getResponseKey(person, question)] || ''}
//                       onChange={(e) => handleResponseChange(person, question, e.target.value)}
//                       className="w-full px-2 py-1 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     >
//                       <option value="">Select...</option>
//                       <option value="1">1 - Poor</option>
//                       <option value="2">2 - Below Average</option>
//                       <option value="3">3 - Average</option>
//                       <option value="4">4 - Good</option>
//                       <option value="5">5 - Excellent</option>
//                     </select>
//                   </td>
//                 ))}
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       <div className="mt-4 text-sm text-gray-600">
//         <p><strong>Instructions:</strong></p>
//         <ul className="list-disc list-inside mt-1 space-y-1">
//           <li>Click the dropdown in each cell to rate a person on that criteria (1-5 scale)</li>
//           <li>Use the edit icon next to names to rename questions or people</li>
//           <li>Add new questions or people using the buttons above the table</li>
//           <li>Remove items using the trash icon (minimum 1 question and 1 person required)</li>
//           <li>Export your data to see all responses in the browser console</li>
//         </ul>
//       </div>
//     </div>
//   );
// };

// export default SurveyTable;


