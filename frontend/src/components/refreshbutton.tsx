import React from "react";
import { instructorService } from "@/app/instructor/instructorlogic";
type RefreshButtonProps = {
  courseID: number;
};

function RefreshButton({ courseID }: RefreshButtonProps) {
  return (
    <button
      className="bg-blue-500 text-white px-6 py-3 rounded-lg text-lg hover:bg-blue-600"
      onClick={() => instructorService.refreshStudentFactors(courseID)}
    >
      Refresh Factors
    </button>
  );
}

export default RefreshButton;
