import SidebarWrapper from '@/components/sidebar/Sidebar';
import React from 'react';

const layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className='flex min-h-screen h-full bg-[var(--color-bg)] text-[var(--color-text)]'>
            {/* Sidebar */}
            <aside className='sticky top-0 h-screen w-[240px] min-w-[220px] max-w-[260px] shrink-0 p-3 bg-[var(--color-surface)] border-r border-r-[var(--color-border)]'>
                <div className='h-full overflow-y-auto no-scrollbar'>
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