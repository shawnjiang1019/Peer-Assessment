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
}

export const studentService = new StudentService();