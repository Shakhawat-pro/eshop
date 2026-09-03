import axiosInstance from "@/utils/axiosInstance";
import { useQuery } from "@tanstack/react-query";

export const useCategories = () => {
    return useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            try {
                const res = await axiosInstance.get('/product/api/get-categories');
                return res.data;
            } catch (error) {
                console.error('Error fetching categories:', error);
                // throw error;
            }
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
        retry: 2,
    })
}