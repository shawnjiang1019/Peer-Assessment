import AxiosClient from "../api/axiosClient"; 

export interface Group{
    id: number;
    courseCode: string;
    groupNumber: number;
    courseID: number;
}


export class StudentService{
    async getGroups(studentID: number): Promise<Group[] | null>{

        const response: Group[] | null = await AxiosClient.get('groups/usersgroups');
        return response;
    }
}