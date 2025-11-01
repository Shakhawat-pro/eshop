import SidebarWrapper from '@/components/sidebar/sidebar';
import React from 'react';

const layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className='flex h-full bg-black min-h-screen'>
            {/* Sidebar */}
            <aside className='w-[280px] min-w-[250px] max-w-[300px]  text-white p-4 border-r border-r-slate-800'>
                <div className='sticky top-0 '>
                    <SidebarWrapper />
                </div>
            </aside>
            {/* Main Content */}
            <main className='flex-1 p-6 '>
                {children}
            </main>
        </div>
    );
};

export default layout;