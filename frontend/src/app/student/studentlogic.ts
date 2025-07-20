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
            console.log("email: ", email);
            const response = await AxiosClient.get('/users/studentid', {
                params: { email: email }
            });
            return response.data;
        } catch(error){
            // Type guard to safely access error properties
            if (error instanceof Error) {
                console.error('Error message:', error.message);
            }
            
            // For axios errors specifically
            if (error && typeof error === 'object' && 'response' in error) {
                const axiosError = error as any; // or import AxiosError type
                console.error('Axios error:', axiosError.response?.status, axiosError.response?.data);
            }
            
            console.error('Could not get the student ID from the specified email', error);
            return null;
        }
    }

    async postSurveyInstance(payload: SurveyInstance){
        try {
            console.log('Posting survey payload:', payload);
            console.log('Request URL:', 'group/postsurvey');
            
            const response = await AxiosClient.post('group/postsurvey', payload);
            console.log('Survey post successful:', response.data);
            return response.data;
        } catch(error){
            // Enhanced error logging like your getStudentID method
            if (error instanceof Error) {
                console.error('Error message:', error.message);
            }
            
            if (error && typeof error === 'object' && 'response' in error) {
                const axiosError = error as any;
                console.error('Axios error details:', {
                    status: axiosError.response?.status,
                    statusText: axiosError.response?.statusText,
                    data: axiosError.response?.data,
                    url: axiosError.config?.url,
                    method: axiosError.config?.method,
                    payload: axiosError.config?.data
                });
            } else if (error && typeof error === 'object' && 'request' in error) {
                console.error('Network error - no response received:', error);
            }
            
            console.error('Error posting survey:', error);
            throw error;
        }
    }
}

export const studentService = new StudentService();