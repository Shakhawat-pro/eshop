"use client";
import axiosInstance from '@/utils/axiosInstance';
import { useMutation } from '@tanstack/react-query';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import Input from '../../../../../../packages/components/Input/Index';
import { AxiosError } from 'axios';

const CreateCodeModal = ({ queryClient, discountCodesLength, onClose }: { queryClient: any; discountCodesLength: number; onClose: () => void }) => {

    const { register, handleSubmit, control, reset, formState: { errors }, watch, setValue } = useForm({
        defaultValues: {
            public_name: '',
            discountType: 'percentage',
            discountValue: '',
            discountCode: '',
            // startDate: '',
            // endDate: '',
            // usageLimit: ''
        }
    })

    const createDiscountCodeMutation = useMutation({
        mutationFn: async (data: any) => {
            const response = await axiosInstance.post('/product/api/create-discount-codes', data);
            return response;
        },
        onSuccess: (data) => {
            toast.success("Discount code created successfully!");
            // Optionally, you can invalidate the query to refetch the discount codes
            queryClient.invalidateQueries({ queryKey: ['discount_codes'] });
            reset();
            onClose();
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.error || "Failed to create discount code.");
        }
    });


    const onSubmit = (data: any) => {
        if (discountCodesLength >= 8) {
            return alert("You can only create up to 8 discount codes.");
        }
        createDiscountCodeMutation.mutate(data);

    }

    const discountType = watch("discountType");

    const generateCode = () => {
        const random = Math.random().toString(36).substring(2, 6).toUpperCase();

        const name = watch("public_name") || "SAVE";

        const prefix = name
            .replace(/[^a-zA-Z0-9 ]/g, "")
            .split(" ")
            .map(word => word[0])
            .join("")
            .toUpperCase()
            .slice(0, 4);

        const code = `${prefix || "SAVE"}-${random}`;

        setValue("discountCode", code);
    };
    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex items-start justify-between border-b border-border bg-surface-muted/60 px-6 py-4">
                    <div>
                        <h2 id="create-discount-title" className="text-xl font-semibold text-text">
                            Create Discount Code
                        </h2>
                        <p className="mt-1 text-sm text-muted">
                            Set up a new promo in seconds.
                        </p>
                    </div>
                    <button
                        className="rounded-md px-2 py-1 text-lg text-muted transition hover:bg-surface-strong"
                        onClick={() => onClose()}
                        aria-label="Close"
                    >
                        ×
                    </button>
                </div>

                <div className="grid gap-5 px-6 py-5">
                    <Input label='Title (Public Name)' placeholder="Spring Launch"
                        {...register('public_name', { required: "Title is required" })}
                        error={errors.public_name?.message}
                    />

                    <div className="grid gap-2">
                        <label className="text-sm font-medium text-text">Discount code</label>
                        <div className="flex gap-2">
                            <Input placeholder="SUMMER20" {...register('discountCode', {
                                required: "Discount code is required",
                                validate: value => !/\s/.test(value) || "Discount code cannot contain spaces"
                            })}
                                error={errors.discountCode?.message}
                            />
                            <button
                                type="button"
                                className="rounded-md border border-border bg-surface-strong px-3 text-sm font-semibold text-text transition hover:bg-surface-muted"
                                onClick={generateCode}
                            >
                                Auto
                            </button>
                        </div>
                    </div>

                    <Controller
                        name="discountType"
                        control={control}
                        defaultValue="percentage"
                        render={({ field }) => (
                            <div className="grid gap-2">
                                <label className="text-sm font-medium text-text">Discount type</label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        className={`rounded-md border px-3 py-2 text-sm font-semibold transition ${field.value === "percentage"
                                            ? "border-blue-600 bg-blue-50 text-blue-700"
                                            : "border-border bg-surface-strong text-text hover:bg-surface-muted"
                                            }`}
                                        onClick={() => field.onChange("percentage")}
                                    >
                                        Percentage
                                    </button>
                                    <button
                                        type="button"
                                        className={`rounded-md border px-3 py-2 text-sm font-semibold transition ${field.value === "flat"
                                            ? "border-blue-600 bg-blue-50 text-blue-700"
                                            : "border-border bg-surface-strong text-text hover:bg-surface-muted"
                                            }`}
                                        onClick={() => field.onChange("flat")}
                                    >
                                        Fixed amount
                                    </button>
                                </div>
                            </div>
                        )}
                    />

                    <div className="grid gap-2">
                        <label className="text-sm font-medium text-text">Value</label>

                        <div className="flex items-center gap-2">
                            <div className="rounded-md border border-border bg-surface-strong px-3 py-2 text-sm text-text-muted">
                                {discountType === "percentage" ? "%" : "৳"}
                            </div>

                            <Input
                                type="number"
                                placeholder={discountType === "percentage" ? "20" : "100"}
                                {...register('discountValue', {
                                    required: "Value is required",
                                    min: {
                                        value: 1,
                                        message: "Value must be greater than 0"
                                    }

                                })}
                                error={errors.discountValue?.message}
                            />
                        </div>

                        <p className="text-xs text-muted">
                            {discountType === "percentage"
                                ? "Example: 20% off"
                                : "Example: ৳100 off"}
                        </p>
                    </div>

                    {/* <div className="grid grid-cols-2 gap-3">
                            <Input label='Start date' type='datetime-local' />
                            <Input label='End date' type='datetime-local' />
                        </div>
                        <Input label='Usage limit' type='number' placeholder="100" /> */}

                </div>

                <div className="flex items-center justify-between border-t border-border bg-surface-muted/60 px-6 py-4">
                    <p className="text-xs text-muted">Tip: Keep codes short and memorable. <br />
                        {createDiscountCodeMutation.isError && (
                            <span className="text-red-500 text-sm mt-2">
                                {(createDiscountCodeMutation.error as AxiosError<{ message: string }>).response?.data?.message || "An error occurred while creating the discount code."}
                            </span>
                        )}
                    </p>
                    <div className="flex gap-2">
                        <button
                            className="rounded-md border border-border bg-surface-strong px-4 py-2 text-sm font-semibold text-text transition hover:bg-surface-muted"
                            onClick={() => onClose()}
                        >
                            Cancel
                        </button>
                        <button type='submit' disabled={createDiscountCodeMutation.isPending} className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700">
                            {createDiscountCodeMutation.isPending ? "Creating..." : "Create"}
                        </button>
                    </div>
                </div>
            </form>

        </div>
    );
};

export default CreateCodeModal;