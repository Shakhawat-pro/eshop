"use client";
import { Search } from "lucide-react";
import Link from "next/link";
import { GiGlassHeart } from "react-icons/gi";
import HeaderBottom from "./HeaderBottom";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import logo from "@/assets/logo.png";
import Image from "next/image";

const Header = () => {
    const [scrolled, setScrolled] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const onScroll = () => {
            setScrolled(window.scrollY > 8);
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);



    return (
        <header
            className={`w-full sticky top-0 z-40 transition-all duration-1000 
                ${scrolled ? "bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/70 shadow-md"
                    : "bg-white shadow-sm"} `
            }
        >
            <div className={`w-[80%] mx-auto flex items-center justify-between transition-all duration-300 ${scrolled ? "h-16 py-3" : "h-20 py-5"}`}>
                <Link href={"/"} className="flex items-center justify-center select-none">
                    <Image
                        src={logo}
                        alt="E-Shop"
                        width={50}
                        height={35}
                        className="border-black"
                    />
                    <h1 className="text-3xl text-black font-bold tracking-tight">
                        <span className="ml-2"
                            style={{
                                background: 'linear-gradient(to right, #ff6a00, #ff8c00)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent'
                            }}>
                            E-S</span>hop
                    </h1>
                </Link>

                <div className="w-[45%] relative hidden md:block">
                    <input
                        type="text"
                        placeholder="Search for products..."
                        className="w-full h-[50px] border-[2.5px] border-[#3483ff] rounded-md py-2 pl-4 pr-16 font-Poppins outline-none focus:ring-2 focus:ring-blue-300 transition"
                    />
                    <button
                        aria-label="Search"
                        className="w-[60px] h-full cursor-pointer flex items-center justify-center absolute right-0 top-0 bg-[#3483ff] rounded-r-md hover:bg-blue-600 transition-colors"
                    >
                        <Search className="text-white" />
                    </button>
                </div>
                <div className="flex items-center gap-5">
                    <Link
                        href={"/login"}
                        className="hidden sm:block text-left leading-tight"
                    >
                        <span className="block text-xs text-gray-500">
                            Hello{pathname === "/profile" ? ", User" : ","}
                        </span>
                        <span className="font-semibold text-sm hover:text-blue-600 transition-colors">
                            {pathname === "/login" ? "Signing In..." : "Sign in"}
                        </span>
                    </Link>
                    <Link
                        href={"/profile"}
                        className={`border-2 rounded-full border-gray-300 w-10 h-10 p-1 flex items-center justify-center hover:border-blue-500 transition-colors ${pathname === "/profile" ? "ring-2 ring-blue-300" : ""
                            }`}
                        aria-label="Profile"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="size-6"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                            />
                        </svg>
                    </Link>
                    <Link
                        href={"/wishlist"}
                        className={`relative hover:text-blue-600 transition-colors ${pathname.startsWith("/wishlist")
                            ? "text-blue-600"
                            : "text-gray-600"
                            }`}
                        aria-label="Wishlist"
                    >
                        <GiGlassHeart className="text-2xl" />
                        <span className="absolute -top-2 -right-2 flex items-center justify-center w-5 h-5 text-[10px] font-medium bg-red-500 text-white rounded-full select-none">
                            0
                        </span>
                    </Link>
                    <Link
                        href={"/cart"}
                        className={`relative hover:text-blue-600 transition-colors ${pathname.startsWith("/cart") ? "text-blue-600" : "text-gray-600"
                            }`}
                        aria-label="Cart"
                    >
                        <span className="text-lg">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="size-6"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                                />
                            </svg>
                        </span>
                        <span className="absolute -top-2 -right-2 flex items-center justify-center w-5 h-5 text-[10px] font-medium bg-red-500 text-white rounded-full select-none">
                            0
                        </span>
                    </Link>
                </div>
            </div>
            <div className="border-b border-gray-200">
                <HeaderBottom pathname={pathname} />
            </div>
        </header>
    );
};

export default Header;
