
import axiosInstance from "@/utils/axiosInstance";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";


export const discountQueryKeys = "shop-discount";


// Get discount codes for shop

export const useDiscountCodes = () => {
    return useQuery({
        queryKey: [discountQueryKeys],
        queryFn: async () => {
            const res = await axiosInstance.get("/product/api/get-discount-codes");
            return res.data.discount_codes;
        },
    });
};


// Create discount code for shop

export const useCreateDiscountCode = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: any) => {
            const response = await axiosInstance.post('/product/api/create-discount-codes', data);
            return response;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: [discountQueryKeys] });
            toast.success("Discount code created successfully!");
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.error || "Failed to create discount code.");
        }
    })
}


// Delete discount code for shop

export const useDeleteDiscountCode = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: number) => {
            await axiosInstance.delete(`/product/api/delete-discount-code/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [discountQueryKeys] });
        },
        onError: (error: any) => {
            const errorMessage = error?.response?.data?.message || "Failed to delete discount code";
            toast.error(errorMessage);
        }
    })
}