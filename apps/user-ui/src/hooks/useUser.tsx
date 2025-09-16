import axiosInstance from "@/utils/axiosInstance";
import { useQuery } from "@tanstack/react-query";


const fetchUser = async () => {
    try {
        const response = await axiosInstance.get("/logged-in-user");
        return response.data.user;
    } catch (error: any) {
        if (error.response) {
            // Full backend JSON will be logged here
            console.error("Backend error:", error.response.data);
        } else {
            console.error("Other error:", error.message);
        }
        throw error;
    }
}

const useUser = () => {
    const { data: user, isLoading, isError, refetch } = useQuery({
        queryKey: ["user"],
        queryFn: fetchUser,
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: 1,
    })
    return { user, isLoading, isError, refetch };
}

export default useUser;