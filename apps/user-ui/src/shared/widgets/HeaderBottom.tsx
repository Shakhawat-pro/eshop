"use client"
import Link from 'next/link';
import React, { useState, useRef, useEffect } from 'react';
import { GiGlassHeart } from 'react-icons/gi';
import { RiMenu2Line } from 'react-icons/ri';

interface HeaderBottomProps {
    pathname: string;
}

const HeaderBottom = ({ pathname }: HeaderBottomProps) => {
    const [open, setOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement | null>(null);
    const [isSticky, setIsSticky] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 100) {
                setIsSticky(true);
            } else {
                setIsSticky(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const departments = [
        "Electronics",
        "Fashion",
        "Home & Kitchen",
        "Books",
        "Toys",
        "Sports",
    ];

    // Close on outside click
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (open && wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setOpen(false);
        };
        window.addEventListener('mousedown', handleClick);
        window.addEventListener('keydown', handleEsc);
        return () => {
            window.removeEventListener('mousedown', handleClick);
            window.removeEventListener('keydown', handleEsc);
        };
    }, [open]);

    const isActive = (p: string) => pathname === p;
    return (
        <div className={`w-full  py-3 shadow-sm ${isSticky ? 'fixed top-0 z-30 shadow-lg bg-white' : 'bg-gray-100'}`}>
            <div className="w-[80%] mx-auto flex items-center justify-between relative" ref={wrapperRef}>
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <button
                            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors ${open ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                            onClick={() => setOpen((prev) => !prev)}
                            aria-haspopup="true"
                            aria-expanded={open}
                        >
                            <RiMenu2Line />
                            All Departments
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={`w-4 h-4 ml-1 transition-transform ${open ? 'rotate-180' : ''}`}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
                            </svg>
                        </button>
                        {/* Animated dropdown */}
                        <div
                            className={`absolute left-0 top-full mt-2 w-56 z-30 origin-top transition-all duration-200 ease-out ${open ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'} `}
                            role="menu"
                            aria-hidden={!open}
                        >
                            <div className="bg-white rounded-md shadow-lg ring-1 ring-black/5 overflow-hidden">
                                <ul className="py-2 max-h-80 overflow-auto">
                                    {departments.map((dept) => (
                                        <li
                                            key={dept}
                                            role="menuitem"
                                            tabIndex={0}
                                            className="px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 cursor-pointer focus:bg-blue-100 focus:outline-none"
                                            onClick={() => setOpen(false)}
                                            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { setOpen(false); } }}
                                        >
                                            {dept}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <nav className="flex items-center gap-6 text-sm font-medium">

                    <a href="/home" className={`${isActive('/') ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'} transition-colors`}>Home</a>
                    <a href="/products" className={`${isActive('/products') ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'} transition-colors`}>Products</a>
                    <a href="/shops" className={`${isActive('/shops') ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'} transition-colors`}>Shops</a>
                    <a href="/offers" className={`${isActive('/offers') ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'} transition-colors`}>Offers</a>
                    <a href="/seller" className={`${isActive('/seller') ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'} transition-colors`}>Become A Seller</a>
                    
                </nav>
                {isSticky &&
                    <div className="flex items-center gap-4 max-h-[40px]">
                        <Link href={'/profile'} className="border rounded-full border-gray-300 w-[35px] h-[35px] p-1 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                            </svg>
                        </Link>
                        <Link href={'/login'}>
                            <span className="block font-medium">Hello,</span>
                            <span className='font-semibold'>Sign in</span>
                        </Link>
                        <Link href={'/wishlist'} className="relative">
                            <GiGlassHeart className="text-2xl text-gray-600" />
                            <span className="absolute -top-2 -right-2 flex items-center justify-center w-5 h-5 max-w-[20px] max-h-[20px] text-xs font-medium bg-red-500 text-white rounded-full">
                                0
                            </span>
                        </Link>
                        <Link href={'/cart'} className="relative">
                            <h2 className='text-lg text-gray-600'><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                            </svg>
                            </h2>
                            <span className="absolute -top-2 -right-2 flex items-center justify-center w-5 h-5 max-w-[20px] max-h-[20px] text-xs font-medium bg-red-500 text-white rounded-full">
                                0
                            </span>
                        </Link>
                    </div>}
            </div>
        </div>
    );
};

export default HeaderBottom;