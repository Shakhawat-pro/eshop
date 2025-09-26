import { shopCategories } from "@/utils/categories";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useForm } from "react-hook-form";

type ShopFormData = {
    name: string;
    bio: string;
    address: string;
    opening_hours: string;
    website?: string;
    category: string;
};


const CreateShop = ({
    sellerId,
    setActiveStep
}: {
    sellerId: string;
    setActiveStep: (step: number) => void;
}) => {


    const {
        register,
        handleSubmit,
        // watch,
        formState: { errors },
    } = useForm<ShopFormData>();



    const createShopMutation = useMutation({
        mutationFn: async (data: ShopFormData & { sellerId: string }) => {
            
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/create-shop`, data);
            return response.data;
        },
        onSuccess: () => {
            setActiveStep(3);
        }
    });

    const onSubmit = async (data: any) => {
        const shopData = { ...data, sellerId };
        console.log("Submitting shop data:", shopData);
        
        createShopMutation.mutate(shopData);
    };

    return (
        <div className="max-w-md w-full p-8 bg-white/80 backdrop-blur border border-gray-100 shadow-xl rounded-2xl">
            <h2 className="text-2xl font-semibold text-center text-gray-900 mb-6">Setup new shop</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* Shop Name */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                    <input
                        type="text"
                        placeholder="Shop name"
                        {...register("name", { required: "Shop name is required", minLength: { value: 2, message: "Too short" } })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition"
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                </div>
                {/* Bio */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bio (Max 100 words) *</label>
                    <textarea
                        rows={3}
                        placeholder="Shop bio"
                        {...register("bio", {
                            required: "Bio is required",
                            validate: value => value.trim().split(/\s+/).length <= 100 || "Bio can't exceed 100 words"
                        })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg resize-y bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition"
                    />
                    <div className="flex justify-between mt-1 text-xs text-gray-500">
                        {errors.bio && <span className="text-red-500">{errors.bio.message}</span>}
                    </div>
                </div>
                {/* Address */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
                    <input
                        type="text"
                        placeholder="Shop location"
                        {...register("address", { required: "Address is required" })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition"
                    />
                    {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>}
                </div>
                {/* Opening Hours */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Opening Hours *</label>
                    <input
                        type="text"
                        placeholder="e.g., Mon-Fri 9AM - 6PM"
                        {...register("opening_hours", { required: "Opening hours are required" })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition"
                    />
                    {errors.opening_hours && <p className="text-red-500 text-sm mt-1">{errors.opening_hours.message}</p>}
                </div>
                {/* Website */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                    <input
                        type="url"
                        placeholder="https://example.com"
                        {...register("website", {
                            pattern: {
                                value: /^(https?:\/\/)?([\w\-])+\.[\w\-]+[\w\-._~:/?#[\]@!$&'()*+,;=.]*$/i,
                                message: "Invalid URL"
                            }
                        })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition"
                    />
                    {errors.website && <p className="text-red-500 text-sm mt-1">{errors.website.message}</p>}
                </div>
                {/* Category */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                    <div className="relative">
                        <select
                            {...register("category", { required: "Category is required" })}
                            className="w-full px-4 py-2 appearance-none border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition"
                        >
                            <option value="">Select a category</option>
                            {shopCategories.map(cat => (
                                <option key={cat.value} value={cat.value}>{cat.label}</option>
                            ))}
                        </select>
                        <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                            </svg>
                        </span>
                    </div>
                    {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>}
                </div>
                {/* Actions */}
                <div className="flex gap-3 pt-2">
                    <button
                        type="button"
                        onClick={() => setActiveStep(1)}
                        className="w-1/3 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded-lg font-medium transition"
                    >
                        Back
                    </button>
                    <button
                        type="submit"
                        disabled={createShopMutation.isPending}
                        className="flex-1 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 disabled:cursor-not-allowed text-white py-2 rounded-lg font-medium shadow-sm transition"
                    >
                        {createShopMutation.isPending ? "Creating..." : "Create"}
                    </button>
                </div>
                {createShopMutation.error && createShopMutation.error instanceof AxiosError && (
                    <p className="text-red-500 text-sm mt-1">{createShopMutation.error.response?.data?.message || createShopMutation.error.message}</p>
                )}
            </form>
        </div>

    );
};

export default CreateShop;