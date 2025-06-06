import CoursePageClient from './CoursePageClient';
import Groups from './GroupClient';
const CoursePage = async ({ params }: { params: { courseID: string } }) => {
  // Convert to number if needed
  const numericCourseId = parseInt(params.courseID);

  return (
    <div>
      <Groups courseId={numericCourseId}/>
      <CoursePageClient courseId={numericCourseId} />
      
    </div>
  );
};

export default CoursePage;