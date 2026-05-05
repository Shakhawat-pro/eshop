"use client";
import BreadCrumbAndHeader from '@/components/Shared/BreadCrumbAndHeader';
import DataTable from '@/components/Shared/DataTable/DataTable';
import Modal from '@/components/Shared/Modal/Modal';
import { Plus } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';
import CreateCodeModal from './CreateCodeModal';
import DeleteModal from '@/components/Shared/Modal/DeleteModal';
import { useDeleteDiscountCode, useDiscountCodes } from '@/queries/discount.queries';



const DiscountCodePage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedCode, setSelectedCode] = useState<any | null>(null);


    const { data: discountCodes = [], isLoading } = useDiscountCodes();


    const deleteMutation = useDeleteDiscountCode();

    const handleDelete = (id: number) => {
        deleteMutation.mutate(id, {
            onSuccess: () => {
                toast.success("Discount code deleted successfully");
            }
        })
    }



    const columns = [
        { header: "Title", accessor: "public_name" },
        { header: "Type", accessor: "discountType", cell: (row: any) => <p className='capitalize'>{row?.discountType}</p> },
        {
            header: "Value", accessor: "discountValue", cell: (row: any) => (
                <span>
                    {row?.discountType === "percentage" ? `${row?.discountValue}%` : `$${row?.discountValue.toFixed(2)}`}
                </span>
            )
        },
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
                    <button className="text-red-600 hover:underline" onClick={() => {
                        setSelectedCode(row);
                        setIsDeleteModalOpen(true);
                    }}>
                        Delete
                    </button>
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
                <h1>Your Discount Codes: {discountCodes.length}</h1>
                <DataTable
                    data={discountCodes}
                    columns={columns}
                    loading={isLoading}
                />
            </div>

            {/* Create Discount Code Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                ariaLabelledBy="create-discount-title"
            >
                <CreateCodeModal
                    discountCodesLength={discountCodes?.length || 0}
                    onClose={() => setIsModalOpen(false)}
                />
            </Modal>
            <DeleteModal
                title="Delete Discount Code"
                value={selectedCode?.public_name}
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={() => {
                    if (selectedCode !== null) {
                        handleDelete(selectedCode.id);
                    }
                    setIsDeleteModalOpen(false);
                }}
            />
        </div>
    );
};

export default DiscountCodePage;