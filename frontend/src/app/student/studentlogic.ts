import AxiosClient from "../api/axiosClient"; 

export interface Group{
    id: number;
    courseCode: string;
    groupNumber: number;
    courseID: number;
}

export interface Student{
    id: number;
    name: string;
    email: string;
    fname: string;
    lname: string;
}

export interface SurveyInstance{
    evaluator_id: number;
    question_id: string;
    evaluatee_id: number;
    group_id: number;
    course_id: number;
    course_code: string;
    answer: number;
}

export class StudentService{


    async getGroups(studentID: number): Promise<Group[] | null>{

        try {
            const response = await AxiosClient.get('group/usersgroups', {
                params: { studentID: studentID }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching groups:', error);
            return null;
        }
    }

    async getStudentsInGroup(groupID: number){
        try {
            const response = await AxiosClient.get('group/groups/', {
                params: { groupID: groupID }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching students in group:', error);
            return null;
        }
    }

    async getStudentID(email: string){
        try {
            const response = await AxiosClient.get('users/studentid/' , {
                params: { email: email }
            });
            return response.data
        } catch(error){
            console.error('Could not get the student ID from the specified email', error);
            return null;
        }
    }

    async postSurveyInstance(payload: SurveyInstance){
        try {
            const response = await AxiosClient.post('group/postsurvey/', payload);
            return response.data;
        } catch(error){
            console.error('Error posting survey:', error);
            throw error;
        }
    }
}

export const studentService = new StudentService();