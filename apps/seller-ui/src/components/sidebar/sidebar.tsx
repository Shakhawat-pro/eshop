"use client"
import useSeller from '@/hooks/useSeller';
import useSidebar from '@/hooks/useSidebar';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useEffect } from 'react';

const SidebarWrapper = () => {
    const { activeSidebar, setActiveSidebar } = useSidebar();
    const pathName = usePathname();
    const { seller } = useSeller();

    console.log("Seller data in SidebarWrapper:", seller);
    

    useEffect(() => {
        setActiveSidebar(pathName);
    }, [pathName]);

    const getIconColor = (route: string) => activeSidebar === route ? "text-white" : "text-slate-400";

    return (
        <div>
            <Link href={"/dashboard"} className='flex items-center gap-3 mb-6'>
               
            </Link>
        </div>
    );
};

export default SidebarWrapper;