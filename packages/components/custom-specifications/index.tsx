import React from 'react';
import { Controller, useFieldArray } from 'react-hook-form';
import Input from '../Input/Index';
import { PlusCircle, Trash2 } from 'lucide-react';

const CustomSpecifications = ({ control, errors }: any) => {
    const { fields, append, remove } = useFieldArray({
        control,
        name: "custom_specifications"
    });

    return (
        <div className="">
            <label className="block font-semibold tracking-wide text-[var(--color-text)] mb-2">Custom Specifications</label>
            <div className='flex flex-col gap-6 '>
                {fields.map((field, index) => (
                    <div key={field.id} className='flex items-center gap-3'>
                        <Controller
                            name={`custom_specifications.${index}.name`}
                            control={control}
                            rules={{ required: "Specification Name Is Required" }}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    label='Name'
                                    placeholder='e.g., Battery Life, Weight, Material'
                                // error={errors?.custom_specifications?.[index]?.name?.message}
                                />
                            )}
                        />
                        <Controller
                            name={`custom_specifications.${index}.value`}
                            control={control}
                            rules={{ required: "Specification Value Is Required" }}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    label='Value'
                                    placeholder='e.g., 10 hours, 1.5 kg, Stainless Steel'
                                // error={errors?.custom_specifications?.[index]?.value?.message}
                                />
                            )}
                        />
                        <button
                            type="button"
                            onClick={() => remove(index)}
                            className="text-red-500 hover:text-red-700 transition-colors duration-200 mt-5 cursor-pointer"
                        >
                            <Trash2 size={20} />
                        </button>
                    </div>
                ))}

                <button
                    type="button"
                    onClick={() => append({ name: "", value: "" })}
                    className='mt-2 flex items-center gap-2 text-sm font-semibold tracking-wide text-blue-500 hover:text-blue-600 cursor-pointer transition-colors duration-200 '
                >
                    <PlusCircle size={20} /> Add Specification
                </button>
            </div>
            {errors?.custom_specifications && (
                <p className="mt-2 text-sm text-red-600">
                    {errors.custom_specifications.message || "Please fix the errors in the specifications."}
                </p>
            )}
        </div>
    );
};

export default CustomSpecifications;
