import { group } from "console";
import AxiosClient from "../api/axiosClient"; 

export class InstructorService{

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
}


export const instructorService = new InstructorService();