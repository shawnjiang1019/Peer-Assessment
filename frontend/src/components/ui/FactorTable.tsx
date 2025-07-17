'use client'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { StudentFactors } from "./Dashboard"

interface Props {
  data: StudentFactors[];
}


const FactorTable = (params: Props) => {
    // Handle empty or undefined data
    if (!params.data || params.data.length === 0) {
        return (
            <div className="w-full max-w-6xl mx-auto p-6">
                <h2 className="text-2xl font-bold mb-4 text-gray-900">Student Adjustment Factors</h2>
                <p className="text-gray-500">No student data available.</p>
            </div>
        );
    }

    return (
        <div className="w-full max-w-6xl mx-auto p-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Student Adjustment Factors</h2>
            <Table>
                <TableCaption>
                    A list of students and their adjustment factors (AFW: Adjustment Factor With Self, AFWO: Adjustment Factor Without Self).
                </TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-48">Student Name</TableHead>
                        <TableHead className="w-32">Course</TableHead>
                        <TableHead className="w-32">Student ID</TableHead>
                        <TableHead className="w-32">Group Number</TableHead>
                        <TableHead className="w-32">Course ID</TableHead>
                        <TableHead className="text-right w-24">AFW</TableHead>
                        <TableHead className="text-right w-24">AFWO</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {params.data.map((student, index) => {
                        // Defensive checks for properties
                        const studentName = student?.name ?? 'N/A';
                        const course = student?.courseCode ?? 'N/A';
                        const studentId = student.utorid ?? 'N/A';
                        const groupNumber = student?.groupNumber ?? 'N/A';
                        const courseId = student?.courseID ?? 'N/A';
                        const afw = student?.factorWithSelf;
                        const afwo = student?.factorWithoutSelf;
                        
                        return (
                            <TableRow key={studentId || index}>
                                <TableCell className="font-medium">
                                    {studentName}
                                </TableCell>
                                <TableCell>
                                    {course}
                                </TableCell>
                                <TableCell>
                                    {studentId}
                                </TableCell>
                                <TableCell>
                                    {groupNumber}
                                </TableCell>
                                <TableCell>
                                    {courseId}
                                </TableCell>
                                <TableCell className="text-right">
                                    {typeof afw === 'number' ? afw.toFixed(3) : 'N/A'}
                                </TableCell>
                                <TableCell className="text-right">
                                    {typeof afwo === 'number' ? afwo.toFixed(3) : 'N/A'}
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
}

export default FactorTable;