import React from 'react';

interface Props {
    title: string;
    children: React.ReactNode;
}

const SidebarMenu = ({ title, children }: Props) => {
    return (
        <div className='block'>
            <h3 className="font-semibold text-xs tracking-[0.04em] mt-2 space-y-1 text-slate-400">{title}</h3>
            {children}
        </div>
    );
};

export default SidebarMenu;