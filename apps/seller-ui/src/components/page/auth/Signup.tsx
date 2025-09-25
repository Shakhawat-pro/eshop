"use client";
import { useRouter } from "next/navigation";
import { useRef, useState, useEffect } from "react";
import { set, useForm } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { countries } from "@/utils/countries";

type FormData = {
    name: string;
    email: string;
    country: string;
    phone_number: string;
    password: string;
    confirmPassword: string
};

type ShopFormData = {
    shop_name: string;
    bio: string; // limit 100 words
    address: string;
    opening_hours: string;
    website?: string;
    category: string;
};

const SHOP_CATEGORIES = [
    "Electronics",
    "Fashion",
    "Home & Garden",
    "Beauty",
    "Sports",
    "Books",
    "Health",
    "Toys",
    "Automotive",
    "Other"
];

const Signup = () => {
    const [activeStep, setActiveStep] = useState(1);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const [serverError, setServerError] = useState("");
    const [showOtp, setShowOtp] = useState(false);
    const [canResend, setCanResend] = useState(true);
    const [timer, setTimer] = useState(60);
    const [otp, setOtp] = useState(["", "", "", ""]);
    const [sellerData, setSellerData] = useState<FormData | null>(null);
    const [sellerId, setSellerId] = useState("");

    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const router = useRouter();

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<FormData>();

    // Form for Step 2 (Shop Setup)
    const {
        register: registerShop,
        handleSubmit: handleSubmitShop,
        watch: watchShop,
        formState: { errors: shopErrors },
        setValue: setShopValue
    } = useForm<ShopFormData>();

    const bioValue = watchShop("bio") || "";
    const [bioWordCount, setBioWordCount] = useState(0);

    useEffect(() => {
        const words = bioValue.trim().split(/\s+/).filter(Boolean);
        if (words.length <= 100) {
            setBioWordCount(words.length);
        } else {
            // Prevent exceeding 100 words by trimming
            const trimmed = words.slice(0, 100).join(" ");
            setShopValue("bio", trimmed, { shouldValidate: true });
            setBioWordCount(100);
        }
    }, [bioValue, setShopValue]);

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
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/seller-registration`, data);
            return response.data;
        },
        onSuccess: (_, formData) => {
            setSellerData(formData);
            setShowOtp(true);
            setCanResend(false);
            setTimer(60);
            startResendTimer();
        }
    })

    console.log("errors", signupMutation?.error);


    const verifyMutation = useMutation({
        mutationFn: async () => {
            if (!sellerData) return;

            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/verify-seller`, { ...sellerData, otp: otp.join("") });
            console.log(response.data);

            return response.data;
        },
        onSuccess: (data) => {
            setSellerId(data.id);
            setActiveStep(2);
            // setShowOtp(false);
            // setSellerData(null);
            // setOtp(["", "", "", ""]);
            // router.push("/login");
        }
    })

    const createShopMutation = useMutation({
        mutationFn: async (data: ShopFormData) => {
            // Assuming an API endpoint exists - adjust as needed
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/shops`, { sellerId, ...data });
            return response.data;
        },
        onSuccess: () => {
            setActiveStep(3); // proceed to next step (e.g., connect bank)
        }
    });

    const onCreateShop = (data: ShopFormData) => {
        createShopMutation.mutate(data);
    };

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
        <div className="w-full py-10 flex flex-col items-center justify-center min-h-screen px-4">
            {/* Stepper */}
            <div className="relative w-full max-w-3xl mx-auto mb-8 px-4 md:px-8">
                <div className="flex items-center justify-between relative">
                    {/* Progress Line Background */}
                    <div className="absolute top-5 h-1 bg-gray-300" 
                         style={{ left: '2.5rem', right: '2.5rem' }} />
                    
                    {/* Progress Line Fill */}
                    <div 
                        className="absolute top-5 h-1 bg-orange-500 transition-all duration-300"
                        style={{ 
                            left: '2.5rem',
                            width: `calc((100% - 5rem) * ${((activeStep - 1) / 2)})`
                        }}
                    />

                    {/* Steps */}
                    {[1, 2, 3].map((step) => (
                        <div key={step} className="flex flex-col items-center relative z-10">
                            {/* Step Circle */}
                            <div className={`w-10 h-10 flex items-center justify-center rounded-full font-bold text-white transition-colors duration-300 ${step <= activeStep ? "bg-orange-500" : "bg-gray-300"
                                }`}>
                                {step}
                            </div>
                            {/* Step Label */}
                            <span className="mt-2 text-sm font-medium text-gray-700 text-center whitespace-nowrap">
                                {step === 1 ? "Create Account" : step === 2 ? "Setup Shop" : "Connect Bank"}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
            {/* Step Content */}
            {activeStep === 1 && (
                <>
                    <div className="text-center space-y-2 mb-4">
                        <h1 className="text-3xl md:text-4xl text-gray-900 font-extrabold tracking-tight">Create your account</h1>
                        <p className="text-gray-500 text-sm md:text-base">Home / Sign Up</p>
                    </div>
                    <div className="max-w-md w-full p-8 bg-white/80 backdrop-blur border border-gray-100 shadow-xl rounded-2xl">
                        <h2 className="text-2xl font-semibold text-center text-gray-900">
                            Welcome to <span className="text-orange-500">E-Shop</span>
                        </h2>
                        <p className="text-center text-gray-500 mt-1 text-sm">Create your credentials to continue</p>

                        {/* Error Message */}
                        {serverError && (
                            <p className="text-red-500 text-center mt-3">{serverError}</p>
                        )}

                        {!showOtp ? (
                            <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-5">
                                {/* Name */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Enter your name"
                                        {...register("name", {
                                            required: "Name is required"
                                        })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition"
                                    />
                                    {errors.name && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {errors.name.message}
                                        </p>
                                    )}
                                </div>
                                {/* Email */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
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
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition"
                                    />
                                    {errors.email && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {errors.email.message}
                                        </p>
                                    )}
                                </div>
                                {/* Phone Number */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        placeholder="Enter your phone number"
                                        {...register("phone_number", {
                                            required: "Phone number is required",
                                            pattern: {
                                                value: /^(?:\+|0)?[1-9]\d{6,14}$/,
                                                message: "Invalid phone number format"
                                            },
                                            minLength: { value: 7, message: "Phone number must be at least 7 digits" },
                                            maxLength: { value: 15, message: "Phone number must be at most 15 digits" }
                                        })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition"
                                    />
                                    {errors.phone_number && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {errors.phone_number.message}
                                        </p>
                                    )}
                                </div>
                                {/* Countries */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                                    <div className="relative">
                                        <select
                                            {...register("country", { required: "Country is required" })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition appearance-none pr-10"
                                        >
                                            <option value="">Select your country</option>
                                            {countries.map((country) => (
                                                <option key={country.code} value={country.name}>
                                                    {country.name}
                                                </option>
                                            ))}
                                        </select>
                                        <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </span>
                                    </div>
                                    {errors.country && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {errors.country.message}
                                        </p>
                                    )}
                                </div>
                                {/* Password */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                    <div className="relative">
                                        <input
                                            type={passwordVisible ? "text" : "password"}
                                            placeholder="Enter your password"
                                            {...register("password", {
                                                required: "Password is required",
                                                minLength: { value: 6, message: "Password must be at least 6 characters long" }
                                            })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 pr-10 transition"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setPasswordVisible((prev) => !prev)}
                                            className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
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
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                                    <div className="relative">
                                        <input
                                            type={confirmPasswordVisible ? "text" : "password"}
                                            placeholder="Confirm your password"
                                            {...register("confirmPassword", {
                                                required: "Confirm Password is required",
                                                validate: (value) =>
                                                    value === watch("password") || "Passwords do not match"
                                            })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 pr-10 transition"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setConfirmPasswordVisible((prev) => !prev)}
                                            className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
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
                                <button type="submit" disabled={signupMutation.isPending} className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 disabled:cursor-not-allowed text-white py-2.5 rounded-lg font-medium shadow-sm transition"
                                >
                                    {signupMutation.isPending ? "Signing Up..." : "Sign Up"}
                                </button>
                                {/* {serverError && (<p className="text-red-500 text-sm mt-1">{serverError}</p>)} */}
                                {signupMutation?.error && signupMutation?.error instanceof AxiosError && (
                                    <p className="text-red-500 text-sm mt-1">{signupMutation.error.response?.data?.message || signupMutation.error.message}</p>
                                )}
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
                </>
            )}
            {activeStep === 2 && (
                <div className="max-w-md w-full p-8 bg-white/80 backdrop-blur border border-gray-100 shadow-xl rounded-2xl">
                    <h2 className="text-2xl font-semibold text-center text-gray-900 mb-6">Setup new shop</h2>
                    <form onSubmit={handleSubmitShop(onCreateShop)} className="space-y-5">
                        {/* Shop Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                            <input
                                type="text"
                                placeholder="Shop name"
                                {...registerShop("shop_name", { required: "Shop name is required", minLength: { value: 2, message: "Too short" } })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition"
                            />
                            {shopErrors.shop_name && <p className="text-red-500 text-sm mt-1">{shopErrors.shop_name.message}</p>}
                        </div>
                        {/* Bio */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Bio (Max 100 words) *</label>
                            <textarea
                                rows={3}
                                placeholder="Shop bio"
                                {...registerShop("bio", { required: "Bio is required" })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg resize-y bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition"
                            />
                            <div className="flex justify-between mt-1 text-xs text-gray-500">
                                <span>{bioWordCount}/100 words</span>
                                {shopErrors.bio && <span className="text-red-500">{shopErrors.bio.message}</span>}
                            </div>
                        </div>
                        {/* Address */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
                            <input
                                type="text"
                                placeholder="Shop location"
                                {...registerShop("address", { required: "Address is required" })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition"
                            />
                            {shopErrors.address && <p className="text-red-500 text-sm mt-1">{shopErrors.address.message}</p>}
                        </div>
                        {/* Opening Hours */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Opening Hours *</label>
                            <input
                                type="text"
                                placeholder="e.g., Mon-Fri 9AM - 6PM"
                                {...registerShop("opening_hours", { required: "Opening hours are required" })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition"
                            />
                            {shopErrors.opening_hours && <p className="text-red-500 text-sm mt-1">{shopErrors.opening_hours.message}</p>}
                        </div>
                        {/* Website */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                            <input
                                type="url"
                                placeholder="https://example.com"
                                {...registerShop("website", {
                                    pattern: {
                                        value: /^(https?:\/\/)?([\w\-])+\.[\w\-]+[\w\-._~:/?#[\]@!$&'()*+,;=.]*$/i,
                                        message: "Invalid URL"
                                    }
                                })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition"
                            />
                            {shopErrors.website && <p className="text-red-500 text-sm mt-1">{shopErrors.website.message}</p>}
                        </div>
                        {/* Category */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                            <select
                                {...registerShop("category", { required: "Category is required" })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition"
                            >
                                <option value="">Select a category</option>
                                {SHOP_CATEGORIES.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                            {shopErrors.category && <p className="text-red-500 text-sm mt-1">{shopErrors.category.message}</p>}
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
            )}
            {activeStep === 3 && (
                <div className="max-w-md w-full p-8 bg-white/80 backdrop-blur border border-gray-100 shadow-xl rounded-2xl">
                    <h2 className="text-2xl font-semibold text-center text-gray-900 mb-6">Setup new shop</h2>
                    <form onSubmit={handleSubmitShop(onCreateShop)} className="space-y-5">
                        {/* Shop Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                            <input
                                type="text"
                                placeholder="shop name"
                                {...registerShop("shop_name", { required: "Shop name is required", minLength: { value: 2, message: "Too short" } })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition"
                            />
                            {shopErrors.shop_name && <p className="text-red-500 text-sm mt-1">{shopErrors.shop_name.message}</p>}
                        </div>
                        {/* Bio */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Bio (Max 100 words) *</label>
                            <textarea
                                rows={3}
                                placeholder="shop bio"
                                {...registerShop("bio", { required: "Bio is required" })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg resize-y bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition"
                            />
                            <div className="flex justify-between mt-1 text-xs text-gray-500">
                                <span>{bioWordCount}/100 words</span>
                                {shopErrors.bio && <span className="text-red-500">{shopErrors.bio.message}</span>}
                            </div>
                        </div>
                        {/* Address */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
                            <input
                                type="text"
                                placeholder="shop location"
                                {...registerShop("address", { required: "Address is required" })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition"
                            />
                            {shopErrors.address && <p className="text-red-500 text-sm mt-1">{shopErrors.address.message}</p>}
                        </div>
                        {/* Opening Hours */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Opening Hours *</label>
                            <input
                                type="text"
                                placeholder="e.g., Mon-Fri 9AM - 6PM"
                                {...registerShop("opening_hours", { required: "Opening hours are required" })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition"
                            />
                            {shopErrors.opening_hours && <p className="text-red-500 text-sm mt-1">{shopErrors.opening_hours.message}</p>}
                        </div>
                        {/* Website */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                            <input
                                type="url"
                                placeholder="https://example.com"
                                {...registerShop("website", {
                                    pattern: {
                                        value: /^(https?:\/\/)?([\w\-])+\.[\w\-]+[\w\-._~:/?#[\]@!$&'()*+,;=.]*$/i,
                                        message: "Invalid URL"
                                    }
                                })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition"
                            />
                            {shopErrors.website && <p className="text-red-500 text-sm mt-1">{shopErrors.website.message}</p>}
                        </div>
                        {/* Category */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                            <select
                                {...registerShop("category", { required: "Category is required" })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition"
                            >
                                <option value="">Select a category</option>
                                {SHOP_CATEGORIES.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                            {shopErrors.category && <p className="text-red-500 text-sm mt-1">{shopErrors.category.message}</p>}
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
            )}
        </div>

    );
};

export default Signup;
