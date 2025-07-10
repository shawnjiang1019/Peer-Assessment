import GroupStudentClient from './GroupStudentClient';
import { instructorService } from '@/app/instructor/instructorlogic';
import Dashboard from '@/components/ui/Dashboard';

const CoursePage = async ({ params }: { params: { groupID: string; courseID: string } }) => {
  // Convert to number if needed
  const numericGroupID = parseInt(params.groupID);

  return (
    <div>
        <GroupStudentClient groupID={numericGroupID}/>
        <Dashboard groupID={parseInt(params.groupID)} courseID={parseInt(params.courseID)}/>
    </div>
  );
};

export default CoursePage;