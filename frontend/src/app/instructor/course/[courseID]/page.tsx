import Dashboard from '@/components/ui/Dashboard';
import CoursePageClient from './CoursePageClient';
import Groups from './GroupClient';

interface CoursePageProps {
  params: Promise<{
    courseID: string;
  }>;
}

const CoursePage = async ({ params }: CoursePageProps) => {
  // Await the params before using them
  const { courseID } = await params;
  
  // Convert to number if needed
  const numericCourseId = parseInt(courseID);

  return (
    <div>
      <Groups courseId={numericCourseId}/>
      <CoursePageClient courseId={numericCourseId} />
      <Dashboard courseID={numericCourseId}/>
    </div>
  );
};

export default CoursePage;