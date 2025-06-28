import GroupStudentClient from './GroupStudentClient';
import { instructorService } from '@/app/instructor/instructorlogic';


const CoursePage = async ({ params }: { params: { groupID: string } }) => {
  // Convert to number if needed
  const numericGroupID = parseInt(params.groupID);

  return (
    <div>
        <GroupStudentClient groupID={numericGroupID}/>
    </div>
  );
};

export default CoursePage;