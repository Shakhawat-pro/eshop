"use client";
import BreadCrumbAndHeader from '@/components/Shared/BreadCrumbAndHeader';
import DataTable from '@/components/Shared/DataTable/DataTable';
import axiosInstance from '@/utils/axiosInstance';
import { useQuery } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import React, { useState } from 'react';

const dummyData = [
    {
        id: 1,
        public_name: "Summer Sale",
        discountType: "Percentage",
        discountValue: 20,
        discountCode: "SUMMER20"
    },
    {
        id: 2,
        public_name: "Holiday Discount",
        discountType: "Fixed Amount",
        discountValue: 10,
        discountCode: "HOLIDAY10"
    },
    {
        id: 3,
        public_name: "Black Friday Deal",
        discountType: "Percentage",
        discountValue: 50,
        discountCode: "BLACKFRIDAY50"
    }
];


const DiscountCodePage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { data: discountCodes = [], isLoading } = useQuery({
        queryKey: ['discount_codes'],
        queryFn: async () => {
            const response = await axiosInstance.get('/product/api/get-discount-codes');
            return response.data.discount_codes;
        }
    });

    console.log(discountCodes, "discount codes data log")


    const columns = [
        { header: "Title", accessor: "public_name" },
        { header: "Type", accessor: "discountType" },
        { header: "Value", accessor: "discountValue" },
        {
            header: "Code",
            accessor: "discountCode",
            cell: (row: any) => (
                <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded">
                    {row?.discountCode}
                </span>
            )
        },
        {
            header: "Actions",
            accessor: "actions",
            cell: (row: any) => (
                <div className="flex gap-2">
                    <button className="text-blue-600 hover:underline">Edit</button>
                    <button className="text-red-600 hover:underline">Delete</button>
                </div>
            )

        }
    ];


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
                <DataTable
                    data={dummyData}
                    columns={columns}
                    loading={isLoading}
                />
            </div>

            {/* Create Discount Code Modal */}
            <div className={`fixed inset-0 z-50 flex items-center justify-center bg-[#00000059] bg-opacity-50 transition-opacity ${isModalOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                <div className="bg-white rounded-lg p-6 w-full max-w-md">
                    <h2 className="text-xl font-semibold mb-4">Create Discount Code</h2>
                    {/* Form fields for creating a discount code */}
                </div>
            </div>
        </div>
    );
};

export default DiscountCodePage;