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

interface FactorTableProps {
    data: StudentFactors[];  
}

const FactorTable = (params: FactorTableProps) => {
    // Handle empty or undefined data
    if (!params.data || params.data.length === 0) {
        return (
            <div className="w-full max-w-4xl mx-auto p-6">
                <h2 className="text-2xl font-bold mb-4 text-gray-900">Student Adjustment Factors</h2>
                <p className="text-gray-500">No student data available.</p>
            </div>
        );
    }

    return (
        <div className="w-full max-w-4xl mx-auto p-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Student Adjustment Factors</h2>
            <Table>
                <TableCaption>
                    A list of students and their adjustment factors for each question.
                </TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-32">Student ID</TableHead>
                        <TableHead className="text-right">Q1</TableHead>
                        <TableHead className="text-right">Q2</TableHead>
                        <TableHead className="text-right">Q3</TableHead>
                        <TableHead className="text-right">Q4</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {params.data.map((student) => {
                        // Defensive checks for nested properties
                        const studentId = student?.studentID ?? 'N/A';
                        const q1 = student?.data?.q1;
                        const q2 = student?.data?.q2;
                        const q3 = student?.data?.q3;
                        const q4 = student?.data?.q4;
                        
                        return (
                            <TableRow key={studentId}>
                                <TableCell className="font-medium">
                                    {studentId}
                                </TableCell>
                                <TableCell className="text-right">
                                    {typeof q1 === 'number' ? q1.toFixed(2) : 'N/A'}
                                </TableCell>
                                <TableCell className="text-right">
                                    {typeof q2 === 'number' ? q2.toFixed(2) : 'N/A'}
                                </TableCell>
                                <TableCell className="text-right">
                                    {typeof q3 === 'number' ? q3.toFixed(2) : 'N/A'}
                                </TableCell>
                                <TableCell className="text-right">
                                    {typeof q4 === 'number' ? q4.toFixed(2) : 'N/A'}
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