import Footer from '@/shared/widgets/Footer';
import Header from '@/shared/widgets/Header';
import React from 'react';

interface MainLayoutProps { children: React.ReactNode }

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    return (
        <>
            <Header />
            <main id="main-content" className="min-h-[50vh]">
                <div className="">
                    {children}
                </div>
            </main>
            <Footer />
        </>
    );
};

export default MainLayout;