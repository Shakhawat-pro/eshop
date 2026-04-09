import React from 'react';

interface Props {
    title: string;
    children: React.ReactNode;
}

const SidebarMenu = ({ title, children }: Props) => {
    return (
        <div className='block'>
            <h3 className="font-semibold text-[11px] tracking-[0.12em] mt-3 mb-1 text-slate-500 uppercase">{title}</h3>
            <div className='space-y-1'>
                {children}
            </div>
        </div>
    );
};

export default SidebarMenu;