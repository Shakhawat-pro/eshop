"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react"; // for password toggle icon
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

type FormData = {
    email: string;
    password: string;
};

const Login = () => {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [serverError, setServerError] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>();

    const loginMutation = useMutation({
        mutationFn: async (data: FormData) => {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/login-seller`, data, { withCredentials: true });
            return response.data;
        },
        onSuccess: () => {
            router.push("/");
        },
        onError: (error: AxiosError<{ message?: string }>) => {
            setServerError(error.response?.data?.message || "Login failed. Please try again.");
        }
    });

    const onSubmit = async (data: FormData) => {
        setServerError("");
        console.log("Login data:", data, rememberMe);
        loginMutation.mutate(data);
    };

    return (
        <div className="w-full py-10 min-h-screen bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl flex flex-col gap-4 items-center justify-center">
            <div className="text-center space-y-3">
                <h1 className="text-4xl text-gray-900 font-bold">Login</h1>
                <p className="text-gray-600 font-semibold">Home . Login</p>
            </div>
            <div className="max-w-md w-full p-8 bg-white shadow-lg rounded-2xl">
                <h1 className="text-2xl font-bold text-center text-gray-900  ">
                    Welcome Back to E-Shop
                </h1>
                <p className="text-center text-gray-500 mt-1">Login to continue</p>

                {/* Error Message */}
                {serverError && (
                    <p className="text-red-500 text-center mt-3">{serverError}</p>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-5">
                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-600">
                            Email
                        </label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            {...register("email", {
                                required: "Email is required",
                                pattern: {
                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                    message: "Invalid email address"
                                }
                            })}
                            className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.email && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-600">
                            Password
                        </label>
                        <div className="relative mt-1">
                            <input
                                type={passwordVisible ? "text" : "password"}
                                placeholder="Enter your password"
                                {...register("password", {
                                    required: "Password is required",
                                    minLength: { value: 6, message: "Password must be at least 6 characters long" }
                                })}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                                type="button"
                                onClick={() => setPasswordVisible((prev) => !prev)}
                                className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                            >
                                {passwordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.password.message}
                            </p>
                        )}
                    </div>

                    {/* Remember Me + Forgot Password */}
                    <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={() => setRememberMe(!rememberMe)}
                                className="rounded"
                            />
                            Remember me
                        </label>
                        <button
                            type="button"
                            className="text-blue-600 hover:underline"
                            onClick={() => router.push("/forgot-password")}
                        >
                            Forgot password?
                        </button>
                    </div>

                    {/* Submit */}
                    <button type="submit" disabled={loginMutation.isPending} className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg font-medium  transition"
                    >
                        {   loginMutation.isPending ? "Logging in..." : "Login"}
                    </button>
                    {serverError && (<p className="text-red-500 text-sm mt-1">{serverError}</p>)}
                </form>

                {/* Divider */}
                <div className="flex items-center my-6">
                    <hr className="flex-grow border-gray-300" />
                    <span className="px-3 text-gray-500 text-sm">OR</span>
                    <hr className="flex-grow border-gray-300" />
                </div>

                {/* Sign up link */}
                <p className="text-center text-gray-600 text-sm mt-6">
                    Don’t have an account?{" "}
                    <button
                        type="button"
                        className="text-black font-medium hover:underline"
                        onClick={() => router.push("/signup")}
                    >
                        Sign up
                    </button>
                </p>
            </div>
        </div>
    );
};

export default Login;
