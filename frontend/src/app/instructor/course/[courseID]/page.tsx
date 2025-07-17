import Dashboard from '@/components/ui/Dashboard';
import CoursePageClient from './CoursePageClient';
import Groups from './GroupClient';
const CoursePage = async ({ params }: { params: { courseID: string } }) => {
  // Convert to number if needed
  const numericCourseId = parseInt(params.courseID);

  return (
    <div>
      <Groups courseId={numericCourseId}/>
      <CoursePageClient courseId={numericCourseId} />
      <Dashboard courseID={numericCourseId}/>
    </div>
  );
};

export default CoursePage;