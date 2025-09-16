"use client";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
// import { Eye, EyeOff } from "lucide-react"; // for password toggle icon
// import { FcGoogle } from "react-icons/fc"; // for Google icon
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { toast } from "react-hot-toast";

type FormData = {
    email: string;
    password: string;
    confirmPassword: string;
};

const ForgotPassword = () => {
    const [step, setStep] = useState<"email" | "otp" | "reset">("email");
    const [otp, setOtp] = useState(["", "", "", ""]);
    const [userEmail, setUserEmail] = useState("");
    const [canResend, setCanResend] = useState(true);
    const [timer, setTimer] = useState(60);
    // no password visibility toggle needed
    const [serverError, setServerError] = useState("");
    const router = useRouter();
    const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

    const {
        register,
        handleSubmit,
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

    const requestOtpMutation = useMutation({
        mutationFn: async ({ email }: { email: string }) => {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/forgot-password-user`, { email });
            return response.data;
        },
        onSuccess: (_, { email }) => {
            setUserEmail(email);
            setStep("otp");
            startResendTimer();
            setCanResend(false);
        },
        onError: (error: AxiosError<{ message: string }>) => {
            setServerError(error.response?.data?.message || "An error occurred");
        }
    });

    const verifyOtpMutation = useMutation({
        mutationFn: async () => {
            if (!userEmail) return;
            const otpCode = otp.join("");
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/verify-forgot-password-otp`, { email: userEmail, otp: otpCode });
            return response.data;
        },
        onSuccess: () => {
            setStep("reset");
            setServerError("");
        },
        onError: (error: AxiosError<{ message: string }>) => {
            setServerError(error.response?.data?.message || "An error occurred");
        }
    })

    const resetPasswordMutation = useMutation({
        mutationFn: async ({ password }: { password: string }) => {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/reset-password-user`, { email: userEmail, password });
            return response.data;
        },
        onSuccess: () => {
            setStep("email");
            toast.success("Password reset successful! Please login with your new password.");
            setUserEmail("");
            setServerError("");
            router.push("/login");
        },
        onError: (error: AxiosError<{ message: string }>) => {
            setServerError(error.response?.data?.message || "An error occurred");
        }
    })

    // unused generic submit handler removed

    const onSubmitEmail = (data: FormData) => {
        setServerError("");
        requestOtpMutation.mutate({ email: data.email });
    }

    const onSubmitOtp = () => {
        setServerError("");
        if (otp.some((d) => d === "")) return;
        verifyOtpMutation.mutate();
    }

    const onSubmitPassword = (data: { password: string; confirmPassword: string }) => {
        setServerError("");
        if (data.password !== data.confirmPassword) {
            setServerError("Passwords do not match");
            return;
        }
        resetPasswordMutation.mutate({ password: data.password });
    }

    const handleOtpChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return; // only allow digits
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        if (value && index < inputRefs.current.length - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    }

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


    return (
        <div className="w-full py-10 min-h-[85vh] bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl flex flex-col gap-4 items-center justify-center">
            <div className="text-center space-y-3">
                <h1 className="text-4xl text-gray-900 font-bold">Forgot Password</h1>
                <p className="text-gray-600 font-semibold">Home . Forgot Password</p>
            </div>
            <div className="max-w-md w-full p-8 bg-white shadow-lg rounded-2xl">
                <h1 className="text-2xl font-bold text-center text-gray-900">
                    {step === "email" && "Forgot Password"}
                    {step === "otp" && "Enter OTP"}
                    {step === "reset" && "Reset Password"}
                </h1>
                <p className="text-center text-gray-500 mt-1">
                    {step === "email" && "Enter your email to reset your password"}
                    {step === "otp" && `We sent a 4-digit code to ${userEmail}`}
                    {step === "reset" && "Enter and confirm your new password"}
                </p>

                {/* Error Message */}
                {serverError && (
                    <p className="text-red-500 text-center mt-3">{serverError}</p>
                )}
                {step === "email" && (
                    <form onSubmit={handleSubmit(onSubmitEmail)} className="mt-6 space-y-5">
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


                        {/* Submit */}
                        <button type="submit" disabled={requestOtpMutation.isPending} className="w-full bg-orange-500  hover:bg-orange-600 text-white py-2 rounded-lg font-medium  transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {requestOtpMutation.isPending ? "Submitting..." : "Submit"}
                        </button>
                        {serverError && (<p className="text-red-500 text-sm mt-1">{serverError}</p>)}
                    </form>
                )}
                {step === "otp" && (
                    <div className="mt-6 space-y-5">
                        <div className="flex justify-center gap-4 my-6">
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    type="text"
                                    ref={(el) => { if (el) inputRefs.current[index] = el }}
                                    maxLength={1}
                                    className="w-12 h-12 text-center border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={digit}
                                    onChange={(e) => handleOtpChange(index, e.target.value)}
                                    onKeyDown={(e) => handleOtpKeydown(index, e)}
                                    onPaste={(e) => { handleOtpPaste(e) }}
                                />
                            ))}
                        </div>
                        <button type="button" className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg font-medium transition"
                            disabled={verifyOtpMutation.isPending || otp.some(d => d === "")}
                            onClick={onSubmitOtp}
                        >
                            {verifyOtpMutation.isPending ? "Verifying..." : "Verify OTP"}
                        </button>
                        <div className="text-center mt-3">
                            {canResend ? (
                                <button type="button" className="text-orange-500 hover:underline" onClick={() => requestOtpMutation.mutate({ email: userEmail })}>
                                    Resend OTP
                                </button>
                            ) : (
                                <p className="text-gray-500 text-sm">Resend OTP in {timer} seconds</p>
                            )}
                        </div>
                    </div>
                )}

                {step === "reset" && (
                    <form onSubmit={handleSubmit(onSubmitPassword)} className="mt-6 space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-600">New Password</label>
                            <input
                                type="password"
                                placeholder="Enter new password"
                                {...register("password", {
                                    required: "Password is required",
                                    minLength: { value: 6, message: "Password must be at least 6 characters long" }
                                })}
                                className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.password && (
                                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600">Confirm Password</label>
                            <input
                                type="password"
                                placeholder="Confirm new password"
                                {...register("confirmPassword", {
                                    required: "Confirm Password is required",
                                    validate: (value) => value === (document.querySelector('input[name="password"]') as HTMLInputElement)?.value || "Passwords do not match",
                                })}
                                className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.confirmPassword && (
                                <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
                            )}
                        </div>
                        <button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg font-medium transition"
                            disabled={resetPasswordMutation.isPending}
                        >
                            {resetPasswordMutation.isPending ? "Resetting..." : "Reset Password"}
                        </button>
                    </form>
                )}


                {/* Divider */}
                <div className="flex items-center my-6">
                    <hr className="flex-grow border-gray-300" />
                    <span className="px-3 text-gray-500 text-sm">OR</span>
                    <hr className="flex-grow border-gray-300" />
                </div>

                {/* Login link */}
                <p className="text-center text-gray-600 text-sm mt-6">
                    Go back to
                    <button
                        type="button"
                        className="text-black font-medium hover:underline"
                        onClick={() => router.push("/login")}
                    >
                        Login
                    </button>
                </p>
            </div>
        </div>
    );
};

export default ForgotPassword;
