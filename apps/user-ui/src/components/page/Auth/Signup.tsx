"use client";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react"; // for password toggle icon
import { FcGoogle } from "react-icons/fc"; // for Google icon
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

type FormData = {
    name: string;
    email: string;
    password: string;
    confirmPassword: string
};

const Signup = () => {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const [serverError, setServerError] = useState("");
    const [showOtp, setShowOtp] = useState(false);
    const [canResend, setCanResend] = useState(true);
    const [timer, setTimer] = useState(60);
    const [otp, setOtp] = useState(["", "", "", ""]);
    const [userData, setUserData] = useState<FormData | null>(null);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const router = useRouter();

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<FormData>();

    const startResendTimer = () => {
        const interval = setInterval(() => {
            setTimer((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    setCanResend(true);
                    return 60;
                }
                return prev - 1;
            });
        }, 1000);
    }

    const signupMutation = useMutation({
        mutationFn: async (data: FormData) => {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/user-registration`, data);
            return response.data;
        },
        onSuccess: (_, formData) => {
            setUserData(formData);
            setShowOtp(true);
            setCanResend(false);
            setTimer(60);
            startResendTimer();
        }
    })

    const verifyMutation = useMutation({
        mutationFn: async () => {
            if (!userData) return;

            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/verify-user`, { ...userData, otp: otp.join("") });
            console.log(response.data);

            return response.data;
        },
        onSuccess: () => {
            setShowOtp(false);
            setUserData(null);
            setOtp(["", "", "", ""]);
            router.push("/login");
        }
    })

    const onSubmit = async (data: FormData) => {
        try {
            console.log("Signup data:", data);
            // signup API logic here
            signupMutation.mutate(data)

        } catch (error) {
            setServerError("Signup failed. Please try again.");
        }
    };

    const handleOtpChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return; // only allow digits
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        if (value && index < inputRefs.current.length - 1) {
            inputRefs.current[index + 1]?.focus();
        }

    };
    const handleOtpKeydown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };
    const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        let pasteData = e.clipboardData.getData('Text').slice(0, otp.length);
        if (!/^\d+$/.test(pasteData)) return; // only digits
        const newOtp = otp.map((_, i) => pasteData[i] || "");
        setOtp(newOtp);

        // Focus last filled input
        const lastFilledIndex = Math.min(pasteData.length - 1, otp.length - 1);
        inputRefs.current[lastFilledIndex]?.focus();
    }


    const handleResendOtp = () => {

    }

    console.log("errors", verifyMutation?.error);


    return (
        <div className="w-full py-10 min-h-[85vh] bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl flex flex-col gap-4 items-center justify-center">
            <div className="text-center space-y-3">
                <h1 className="text-4xl text-gray-900 font-bold">Sign Up</h1>
                <p className="text-gray-600 font-semibold">Home . Sign Up</p>
            </div>
            <div className="max-w-md w-full p-8 bg-white shadow-lg rounded-2xl">
                <h1 className="text-2xl font-bold text-center text-gray-900  ">
                    Welcome to E-Shop
                </h1>
                <p className="text-center text-gray-500 mt-1">Sign up to continue</p>

                {/* Error Message */}
                {serverError && (
                    <p className="text-red-500 text-center mt-3">{serverError}</p>
                )}

                {!showOtp ? (
                    <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-5">
                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-600">
                                Name
                            </label>
                            <input
                                type="text"
                                placeholder="Enter your name"
                                {...register("name", {
                                    required: "Name is required"
                                })}
                                className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.name && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.name.message}
                                </p>
                            )}
                        </div>
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
                            <label className="block text-sm font-medium text-gray-600">Password</label>
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
                        {/* Confirm Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-600">Confirm Password</label>
                            <div className="relative mt-1">
                                <input
                                    type={confirmPasswordVisible ? "text" : "password"}
                                    placeholder="Confirm your password"
                                    {...register("confirmPassword", {
                                        required: "Confirm Password is required",
                                        validate: (value) =>
                                            value === watch("password") || "Passwords do not match"
                                    })}
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <button
                                    type="button"
                                    onClick={() => setConfirmPasswordVisible((prev) => !prev)}
                                    className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                                >
                                    {confirmPasswordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {errors.confirmPassword && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.confirmPassword.message}
                                </p>
                            )}
                        </div>

                        {/* Submit */}
                        <button type="submit" disabled={signupMutation.isPending} className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg font-medium  transition"
                        >
                            {signupMutation.isPending ? "Signing Up..." : "Sign Up"}
                        </button>
                        {serverError && (<p className="text-red-500 text-sm mt-1">{serverError}</p>)}
                    </form>
                ) : (
                    <div>
                        <h3 className="text-xl font-semibold text-center">
                            Enter OTP
                        </h3>
                        <div className="flex justify-center gap-6 my-10">
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    type="text"
                                    ref={(el) => {
                                        if (el) inputRefs.current[index] = el
                                    }}
                                    maxLength={1}
                                    className="w-12 h-12 text-center border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={digit}
                                    onChange={(e) => handleOtpChange(index, e.target.value)}
                                    onKeyDown={(e) => handleOtpKeydown(index, e)}
                                    onPaste={(e) => { handleOtpPaste(e) }}

                                />
                            ))}
                        </div>
                        <button type="button" className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg font-medium transition "
                            // onClick={handleOtpSubmit}
                            disabled={verifyMutation.isPending || otp.some(d => d === "")}
                            onClick={() => { verifyMutation.mutate() }}
                        >
                            {verifyMutation.isPending ? "Verifying..." : "Verify OTP"}
                        </button>
                        <div className="text-center mt-3">
                            {canResend ? (
                                <button
                                    type="button"
                                    onClick={handleResendOtp}
                                    className="text-orange-500 hover:underline"
                                >
                                    Resend OTP
                                </button>
                            ) : (
                                <p className="text-gray-500 text-sm">
                                    Resend OTP in {timer} seconds
                                </p>
                            )}
                            {
                                verifyMutation?.error && verifyMutation?.error instanceof AxiosError && (
                                    <p className="text-red-500 text-sm mt-1">{verifyMutation.error.response?.data?.message || verifyMutation.error.message}</p>
                                )
                            }
                        </div>
                    </div>
                )}

                {/* Divider */}
                <div className="flex items-center my-6">
                    <hr className="flex-grow border-gray-300" />
                    <span className="px-3 text-gray-500 text-sm">OR</span>
                    <hr className="flex-grow border-gray-300" />
                </div>

                {/* Google Signup */}
                <button
                    type="button"
                    className="w-full flex items-center justify-center gap-2 border py-2 rounded-lg hover:bg-gray-50 transition"
                >
                    <FcGoogle size={20} />
                    Continue with Google
                </button>

                {/* Login link */}
                <p className="text-center text-gray-600 text-sm mt-6">
                    Already have an account?{" "}
                    <button
                        type="button"
                        className="text-black font-medium hover:underline"
                        onClick={() => router.push("/login")}
                    >
                        Login Now
                    </button>
                </p>
            </div>
        </div >
    );
};

export default Signup;
