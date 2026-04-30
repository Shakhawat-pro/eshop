"use client";
import BreadCrumbAndHeader from '@/components/Shared/BreadCrumbAndHeader';
import axiosInstance from '@/utils/axiosInstance';
import { useQuery } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import React, { useState } from 'react';

const DiscountCodePage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { data, isLoading, error } = useQuery({
        queryKey: ['discount_codes'],
        queryFn: async () => {
            const response = await axiosInstance.get('/product/api/get-discount-codes');
            return response;
        }
    });

    console.log(data)


    return (
        <div className='w-full min-h-screen '>
            <div className='flex items-center justify-between'>
                {/* BreadCrumb And Header */}
                <BreadCrumbAndHeader
                    header="Discount Codes"
                    // description="Create, track, and manage promo offers in one place."
                    breadcrumbs={[
                        { name: "Dashboard", href: "/dashboard" },
                        { name: "Discount Codes" }
                    ]}
                />
                {/* Create Discount Code Button */}
                <button
                    className="flex items-center gap-1 rounded-md border bg-blue-600 px-4 py-2 text-sm font-semibold text-text cursor-pointer transition hover:bg-blue-700 border-none"
                    onClick={() => setIsModalOpen(!isModalOpen)}
                >
                    <Plus size={16} strokeWidth={2.5} />  Create Discount
                </button>
            </div>
            {/* Main Content */}
            <div className='mt-8 bg-surface p-6 rounded-lg border border-border blue-shadow-sm'>
                <h1>Your Discount Codes</h1>
            </div>

        </div>
    );
};

export default DiscountCodePage;