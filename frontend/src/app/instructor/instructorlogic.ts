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


    async getStudentFactors(studentID: number, courseID: number, groupID: number){
        try{
            const response = await AxiosClient.get("/calculate/factors", {
                params: {
                    studentID: studentID,
                    courseID: courseID,
                    groupID: groupID
                }
            });
            return response.data;
        } catch(error){
            console.error('Could not get the factor for the specified student', error);
            return null;

        }
    }
}


export const instructorService = new InstructorService();