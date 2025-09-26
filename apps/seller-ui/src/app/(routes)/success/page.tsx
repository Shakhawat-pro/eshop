import Link from 'next/link';
import React from 'react';

const page = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] py-10 px-4">
            <div className="max-w-md w-full p-8 bg-white/80 backdrop-blur border border-gray-100 shadow-xl rounded-2xl flex flex-col items-center">
                <h1 className="text-3xl md:text-4xl font-extrabold text-green-600 mb-2">Success!</h1>
                <p className="text-gray-700 text-base text-center">Your action was completed successfully.</p>
                <div className='mt-4 flex flex-col items-center gap-3'>
                    <svg className="w-24 h-24 text-green-500 mt-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2l4 -4m6 2a9 9 0 11-18 0a9 9 0 0118 0z"></path>
                    </svg>
                    <Link href="/" className="mt-4 bg-orange-500 hover:bg-orange-600 text-white py-2 px-6 rounded-lg font-medium shadow-sm transition">
                        Go to Home
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default page;