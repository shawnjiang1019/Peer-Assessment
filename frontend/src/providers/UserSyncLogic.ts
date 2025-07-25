import AxiosClient from "@/app/api/axiosClient";

export class UserSyncService {
    async checkUsers(user: any, token: string) {
        try {
            const response = await AxiosClient.post("/users", {
                sub: user.sub,
                email: user.email,
                name: user.name,
                // Add any additional claims
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            
            return response.data;
        } catch (error) {
            console.error('User sync failed:', error);
            throw error; // Re-throw if you want calling code to handle it
        }
    }
}

export const userSyncService = new UserSyncService();