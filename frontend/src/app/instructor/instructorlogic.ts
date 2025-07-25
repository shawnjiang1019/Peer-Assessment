import { group } from "console";
import AxiosClient from "../api/axiosClient"; 

export class InstructorService{

    async getCourses(lecturer_id: number){
        try {
            console.log("lecturer_id: ", lecturer_id)
            const response = await AxiosClient.get("api/courses", {
                params: {
                    instructor_id: lecturer_id
                }
            });
            return response.data;

        } catch(error){
            console.error('Could not get courses for specified instructor', error);
            return null;
        }
        
    }

    async getStudents(groupID: number){
        try{
            const response = await AxiosClient.get("/group/groups/", {
                params: {
                    groupID: groupID
                }
            });
            return response.data;
        } catch(error){
            console.error('Could not get the students in the specified group', error);
            return null;
        }
    }
    async refreshStudentFactors(courseID: number): Promise<any> {
        try {
            // Send courseID as query parameter to match FastAPI endpoint
            const response = await AxiosClient.post("/factor/refreshFactors", null, {
                params: {
                    courseID: courseID
                }
            });
            return response.data;
        } catch (error: unknown) {
            console.error('Could not refresh the factors for groups in the course', error);
            
            // Type guard to check if error is an Axios error
            if (error && typeof error === 'object' && 'response' in error) {
                const axiosError = error as any;
                console.error('Error response:', axiosError.response?.data);
                console.error('Error status:', axiosError.response?.status);
            } else if (error instanceof Error) {
                console.error('Error message:', error.message);
            } else {
                console.error('Unknown error type:', error);
            }
            
            return null;
        }
    }
    async getStudentFactors(courseID: number){
        try{
            const response = await AxiosClient.get("/factor/fetchFactors", {
                params: {
                    courseID: courseID,
                }
            });
            return response.data;
        } catch(error){
            console.error('Could not get the factor for the specified student', error);
            return null;

        }
    }

    async downloadCSV(courseID: number){
        try{
            const response = await AxiosClient.get("/factor/makeCSV", {
                params: {
                    courseID: courseID,
                },
                responseType: 'blob'
            });
            const blob = new Blob([response.data], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `course_${courseID}_students.csv`;
            document.body.appendChild(link);
            link.click();
            
            // Cleanup
            link.remove();
            URL.revokeObjectURL(url);
            
            return { success: true };
        } catch(error){
            console.error('Could not download the csv file', error);
            return null;
        }
    }

    async uploadCSV(file: File, courseId: string, courseCode: string) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('courseID', courseId);
        formData.append('coursecode', courseCode);
        try {
            const response = await AxiosClient.post("/api/csv", formData);
            return response.data;
        } catch(error) {
            console.error('Could not upload the csv file', error);
            return null;
        }
    }
}


export const instructorService = new InstructorService();