'use client'
import { Student } from "@/app/student/studentlogic";
import { instructorService } from "@/app/instructor/instructorlogic";
import { StudentFactors } from "./Dashboard";
import { Button } from "./button";
import { useState, useEffect } from "react";

interface Props {
  courseID: number;
}

const ExportCSV = ({ courseID }: Props) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleExport = async () => {
        setIsLoading(true);
        try {
            await instructorService.downloadCSV(courseID);
            // Success! File should be downloaded
        } catch(error) {
            console.error("Failed to download CSV:", error);
            alert("Failed to download CSV. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Button onClick={handleExport} disabled={isLoading}>
            {isLoading ? "Downloading..." : "Download CSV"}
        </Button>
    )
}

export default ExportCSV;