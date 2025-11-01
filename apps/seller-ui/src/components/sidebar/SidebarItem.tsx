import { Link } from 'lucide-react';
import React from 'react';

interface Props {
    icon: React.ReactNode;
    title: string;
    isActive?: boolean;
    href: string;
}

const SidebarItem = ({ icon, title, isActive, href }: Props) => {
    return (
        // <Link href={href} className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium hover:bg-slate-800 transition-colors ${isActive ? 'bg-slate-800 text-white' : 'text-slate-400'}`}>
        //     {icon}
        //     <span>{title}</span>
        // </Link>
        <Link href={href}>
            <div className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium hover:bg-slate-800 transition-colors ${isActive ? 'bg-slate-800 text-white' : 'text-slate-400'}`}>
                {icon}
                <span>{title}</span>
            </div>
        </Link>

    );
};

export default SidebarItem;