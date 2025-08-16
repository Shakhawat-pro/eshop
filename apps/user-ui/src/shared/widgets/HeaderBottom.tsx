"use client"
import React, { useState, useRef, useEffect } from 'react';
import { RiMenu2Line } from 'react-icons/ri';

interface HeaderBottomProps {
    pathname: string;
}

const HeaderBottom = ({ pathname }: HeaderBottomProps) => {
    const [open, setOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement | null>(null);


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
        <div className={`w-full  py-3 shadow-sm `}>
            <div className="w-11/12 sm:w-[80%] mx-auto flex items-center justify-between relative" ref={wrapperRef}>
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <button
                            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors ${open ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                            onClick={() => setOpen((prev) => !prev)}
                            aria-haspopup="true"
                            aria-expanded={open}
                        >
                            <RiMenu2Line />
                            Category
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
                <nav className="flex items-center gap-6 text-sm font-medium max-md:hidden">
                    <a href="/home" className={`${isActive('/') ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'} transition-colors`}>Home</a>
                    <a href="/products" className={`${isActive('/products') ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'} transition-colors`}>Products</a>
                    <a href="/shops" className={`${isActive('/shops') ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'} transition-colors`}>Shops</a>
                    <a href="/offers" className={`${isActive('/offers') ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'} transition-colors`}>Offers</a>
                    <a href="/seller" className={`${isActive('/seller') ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'} transition-colors`}>Become A Seller</a>   
                </nav>
            </div>
        </div>
    );
};

export default HeaderBottom;