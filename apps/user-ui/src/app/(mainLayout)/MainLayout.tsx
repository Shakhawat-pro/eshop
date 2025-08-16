import Footer from '@/shared/widgets/Footer';
import Header from '@/shared/widgets/Header';
import React from 'react';

interface MainLayoutProps { children: React.ReactNode }

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    return (
        <>
            <Header />
            <main id="main-content" className="min-h-screen w-full mt-20">
                <div className="w-11/12 sm:w-[80%] mx-auto py-6">
                    {children}
                </div>
            </main>
            <Footer />
        </>
    );
};

export default MainLayout;