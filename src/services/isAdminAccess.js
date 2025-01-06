import API from './api';
import { useUserStore } from '../store/useUsertoken';

const isAdminAccess = async () => {
    try {
        const userId = useUserStore.getState().userId;
        if (!userId) return false;
        
        const response = await API.get(`/Users/${userId}`);
        return response.data.roleID === 1;
        
    } catch (error) {
        console.error("Error checking admin access:", error);
        return false; // Return false if there's any error
    }
};

export default isAdminAccess;
