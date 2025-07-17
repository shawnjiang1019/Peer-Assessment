import GroupStudentClient from './GroupStudentClient';
import Dashboard from '@/components/ui/Dashboard';

// export default function CoursePage({
//   params,
// }: {
//   params: {
//     groupID: string;
//     courseID: string;
//   };
// }) {
//   return (
//     <div>
//       <GroupStudentClient groupID={parseInt(params.groupID)} />
//       <Dashboard courseID={parseInt(params.courseID)} />
//     </div>
//   );
// }



interface CoursePageProps {
  params: Promise<{
    courseID: string;
    groupID: string;
  }>;
}

export default async function CoursePage({ params }: CoursePageProps) {
  // Await the params before using them
  const { courseID, groupID } = await params;

  return (
    <div>
      <GroupStudentClient groupID={parseInt(groupID)} />
      <Dashboard courseID={parseInt(courseID)} />
    </div>
  );
}