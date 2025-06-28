'use client'

import { useEffect, useState } from "react"
import { instructorService } from "@/app/instructor/instructorlogic";
import { useUser } from "@/providers/user-provider";
import { Student } from "@/app/student/studentlogic";



interface DashboardProps{
    courseID: number;
    groupID: number;
}

interface AdjustmentFactorTableProps{
    factor: number;
    area: string;
}

interface StudentFactors{
    studentID: number;
    data: AdjustmentFactorTableProps;
}

const Dashboard = (params: DashboardProps) => {
    const { user } = useUser();
    const [students, setStudents] = useState<Student[]>([]);
    const [studentFactors, setStudentFactors] = useState<StudentFactors[]>([]);
    const [tableProps, setTableProps] = useState<AdjustmentFactorTableProps>();

    useEffect(() => {
        if (!user?.id) return; 
        
        const fetchData = async () => {
            try {
                const studentData: Student[] = await instructorService.getStudents(params.groupID);
                setStudents(studentData);
                
                const factorPromises: Promise<AdjustmentFactorTableProps>[] = studentData.map(student => 
                    instructorService.getStudentFactors(student.id, params.courseID, params.groupID)
                );
                
                const allFactorData: AdjustmentFactorTableProps[] = await Promise.all(factorPromises);
                
                // Transform the data to match StudentFactors interface
                const studentFactorsData: StudentFactors[] = studentData.map((student, index) => ({
                    studentID: student.id,
                    data: allFactorData[index]
                }));
                
                setStudentFactors(studentFactorsData);
                console.log('All factor data:', studentFactorsData);
            } catch(error){
                console.error('Error fetching data:', error);
            }
        }
        
        fetchData();

    }, [user?.id, params.courseID, params.groupID])

    return(
        <div>

        </div>
    );
}

export default Dashboard;