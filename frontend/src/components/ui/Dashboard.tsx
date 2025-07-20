'use client'

import { useEffect, useState } from "react"
import { instructorService } from "@/app/instructor/instructorlogic";
import { useUser } from "@/providers/user-provider";
import { Student } from "@/app/student/studentlogic";
import Factortable from "./FactorTable";
import ExportCSV from "./ExportCSV";
import RefreshButton from "../refreshbutton";

// "student_id": 1004985643,
//             "name": "Yuening Chen",
//             "factorWithSelf": 1.0,
//             "factorWithoutSelf": 1.0

interface DashboardProps{
    courseID: number;
}

interface AdjustmentFactorTableProps {
    name: string;
    student_id: number;
    factorWithSelf: number;
    factorWithoutSelf: number;
    courseCode: string;
    groupNumber: number;
    courseID: number;
}

export interface StudentFactors{
    name: string;
    utorid: number;
    factorWithSelf: number;
    factorWithoutSelf: number;
    courseCode: string;
    groupNumber: number;
    courseID: number;
}

const Dashboard = (params: DashboardProps) => {
    const { user } = useUser();
    const [students, setStudents] = useState<Student[]>([]);
    const [studentFactors, setStudentFactors] = useState<StudentFactors[]>([]);

    useEffect(() => {
        if (!user?.id) return; 
        
        const fetchData = async () => {
            const factorData : StudentFactors[] = await instructorService.getStudentFactors(params.courseID);
            setStudentFactors(factorData);
        }
        fetchData();

    }, [user?.id, params.courseID])

    return(
        <div>
            <ExportCSV courseID={params.courseID}/>
            <RefreshButton courseID={params.courseID}/>
            <Factortable data={studentFactors}/>

        </div>
    );
}

export default Dashboard;