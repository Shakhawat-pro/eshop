"use client";
import BreadCrumbAndHeader from '@/components/Shared/BreadCrumbAndHeader';
import ImagePlaceHolder from '@/components/Shared/ImagePlaceHolder/ImagePlaceHolder';
import { useMemo, useState } from 'react';

import { Controller, useForm } from 'react-hook-form';
import Input from '../../../../../../../packages/components/Input/Index';
import ColorSelector from '../../../../../../../packages/components/color-selector';
import CustomSpecifications from '../../../../../../../packages/components/custom-specifications';
import CustomProperties from '../../../../../../../packages/components/custom-properties';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/utils/axiosInstance';
import RichTextEditor from '../../../../../../../packages/components/RichTextEditor';
import SizeSelector from '../../../../../../../packages/components/size-selector';

const CreateProduct = () => {
    const { register, control, watch, setValue, handleSubmit, formState: { errors }, } = useForm()

    const [openImageModal, setOpenImageModal] = useState(false);
    const [isChanged, setIsChanged] = useState(true);
    const [images, setImages] = useState<(File | null)[]>([null]);
    const [loading, setLoading] = useState(false);

    const { data, isLoading, error: categoriesError } = useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            try {
                const res = await axiosInstance.get('/product/api/get-categories');
                return res.data;
            } catch (error) {
                console.error('Error fetching categories:', error);
                // throw error;
            }
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
        retry: 2,
    })

    const categories = data?.categories || [];
    const subCategories = data?.subCategories || {};

    const selectedCategory = watch('category');
    const selectedSubCategories = useMemo(() => {
        return selectedCategory ? subCategories[selectedCategory] || [] : [];
    }, [selectedCategory, subCategories]);

    console.log(selectedCategory, "selected")


    const onSubmit = (data: any) => {
        console.log(data);
    }

    const handleImageChange = (file: File | null, index: number) => {
        const updatedImages = [...images];
        updatedImages[index] = file;

        if (index === images.length - 1 && file) {
            updatedImages.push(null);
        }

        setImages(updatedImages);
        // setValue('images', updatedImages.filter(img => img !== null));
        setValue('images', updatedImages);
    }

    const handleRemoveImage = (index: number) => {
        setImages((prevImages) => {
            const updatedImages = [...prevImages];

            if (index === -1) {
                updatedImages[0] = null;
            } else {
                updatedImages.splice(index, 1);
            }
            if (!updatedImages.includes(null) && updatedImages.length < 8) {
                updatedImages.push(null);
            }
            setValue('images', updatedImages);
            return updatedImages;
        });
    }

    const handleSaveDraft = () => {
        // Implement save draft functionality here
    }


    return (
        <div>
            {/* BreadCrumb And Header */}
            <BreadCrumbAndHeader header="Create Product" breadcrumbs={[
                { name: "Dashboard", href: "/dashboard" },
                { name: "Products", href: "/dashboard/products" },
                { name: "Create Product" }
            ]} />

            <form>
                {/* Content Layout */}
                <div className='py-4 w-full flex gap-6'>
                    {/* Left Side - Image upload Section */}
                    <div className='md:w-[35%] flex '>
                        {images?.length > 0 &&
                            <ImagePlaceHolder
                                size="765 x 850"
                                small={false}
                                index={0}
                                setOpenImageModal={setOpenImageModal}
                                onImageChange={handleImageChange}
                                onRemove={handleRemoveImage}
                            />
                        }
                        <div className='grid grid-cols-2 gap-3 mt-4 '>
                            {images.slice(1).map((_, index) => (
                                <ImagePlaceHolder
                                    key={index + 1}
                                    size="765 x 850"
                                    small={true}
                                    index={index + 1}
                                    setOpenImageModal={setOpenImageModal}
                                    onImageChange={handleImageChange}
                                    onRemove={handleRemoveImage}
                                />
                            ))}
                        </div>
                    </div>
                    {/* Right Side - Form Input */}
                    <div className='md:w-[65%] w-full flex gap-6'>
                        {/* Form Left Inputs */}
                        <div className='w-2/4 space-y-4'>
                            {/* Product Title Input */}
                            <div className=''>
                                <Input
                                    label="Product Title *"
                                    placeholder='Enter Product Title'
                                    {...register('title', { required: 'Product title is required' })}
                                />
                                {errors.title && (
                                    <p className='text-red-500 text-sm mt-1'>{errors.title.message as string}</p>
                                )}
                            </div>
                            {/* Short Description */}
                            <div className=''>
                                <Input
                                    type='textarea'
                                    rows={7}
                                    cols={10}
                                    label="Short Description *(Max 150 words)"
                                    placeholder='Enter Product description for quick overview'
                                    {...register('description', {
                                        required: 'Description is required',
                                        validate: (value) => {
                                            const wordCount = value.trim().split(/\s+/).length;
                                            return wordCount <= 150 || `Description cannot exceed 150 words (Current: ${wordCount})`;
                                        }
                                    })}
                                />
                                {errors.description && (
                                    <p className='text-red-500 text-sm mt-1'>{errors.description.message as string}</p>
                                )}
                            </div>
                            {/* Tag */}
                            <div className=''>
                                <Input
                                    label="Tags *"
                                    placeholder='apple,mobile,watch'
                                    {...register('tags', { required: 'Separate related product tags with coma' })}
                                />
                                {errors.tags && (
                                    <p className='text-red-500 text-sm mt-1'>{errors.tags.message as string}</p>
                                )}
                            </div>
                            {/* Warranty */}
                            <div className=''>
                                <Input
                                    label="Warranty *"
                                    placeholder='Enter warranty details'
                                    {...register('warranty', { required: 'Warranty details are required' })}
                                />
                                {errors.warranty && (
                                    <p className='text-red-500 text-sm mt-1'>{errors.warranty.message as string}</p>
                                )}
                            </div>
                            {/* Slug */}
                            <div>
                                <Input
                                    label="Slug *"
                                    placeholder='Enter product slug'
                                    {...register('slug', {
                                        required: 'Slug is required',
                                        pattern: {
                                            value: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
                                            message: 'Invalid slug format. Use lowercase letters, numbers, and hyphens only.'
                                        },
                                        minLength: {
                                            value: 3,
                                            message: 'Slug must be at least 3 characters long.'
                                        },
                                        maxLength: {
                                            value: 50,
                                            message: 'Slug cannot exceed 50 characters.'
                                        },
                                        validate: (value) => {
                                            const reservedSlugs = ['admin', 'dashboard', 'products', 'create-product'];
                                            if (reservedSlugs.includes(value)) {
                                                return 'This slug is reserved. Please choose a different one.';
                                            }
                                            return true;
                                        }
                                    })}
                                />
                                {errors.slug && (
                                    <p className='text-red-500 text-sm mt-1'>{errors.slug.message as string}</p>
                                )}
                            </div>
                            {/* Brand */}
                            <div>
                                <Input
                                    label="Brand "
                                    placeholder='Enter product brand'
                                    {...register('brand')}
                                />
                                {errors.brand && (
                                    <p className='text-red-500 text-sm mt-1'>{errors.brand.message as string}</p>
                                )}
                            </div>
                            {/* Color Selector */}
                            <ColorSelector control={control} errors={errors} />
                            {/* Custom Specifications */}
                            <CustomSpecifications control={control} errors={errors} />
                            {/* Custom Properties */}
                            <CustomProperties control={control} errors={errors} />

                            {/* Cash on Delivery */}
                            <div>
                                <label className='block text-sm font-medium text-[var(--color-text)] mb-1'>Product Description *</label>
                                <select
                                    defaultValue="Please select a option"
                                    className="select bg-surface-muted border-border w-full cursor-pointer"
                                    {...register('cod', { required: 'Please select an option' })}
                                >
                                    <option disabled={true}>Please select a option</option>
                                    <option value="yes">Yes</option>
                                    <option value="no">No</option>
                                </select>
                                {errors.cod && (
                                    <p className='text-red-500 text-sm mt-1'>{errors.cod.message as string}</p>
                                )}
                            </div>
                        </div>
                        {/* Form Right Inputs */}
                        <div className='w-2/4 space-y-4'>
                            {/* Category */}
                            <div>
                                <label className='block text-sm font-medium text-[var(--color-text)] mb-1'>Category *</label>
                                <Controller
                                    name="category"
                                    control={control}
                                    rules={{ required: "Please select a category" }}
                                    render={({ field }) => (
                                        <select
                                            {...field}
                                            className="select bg-surface-muted border-border w-full cursor-pointer"
                                        >
                                            <option value="" disabled>
                                                {isLoading ? "Loading..." : "Please select a category"}
                                            </option>

                                            {categories.map((category: string) => (
                                                <option key={category} value={category}>
                                                    {category}
                                                </option>
                                            ))}
                                        </select>
                                    )}
                                />
                                {categoriesError && (
                                    <p className='text-red-500 text-sm mt-1'>Error loading categories</p>
                                )}
                                {errors.category && (
                                    <p className='text-red-500 text-sm mt-1'>{errors.category.message as string}</p>
                                )}
                            </div>
                            {/* Sub Category */}
                            <div>
                                <label className='block text-sm font-medium text-[var(--color-text)] mb-1'>Sub Category *</label>
                                <Controller
                                    name="subCategory"
                                    control={control}
                                    rules={{ required: "Please select a sub category" }}
                                    render={({ field }) => (
                                        <select
                                            defaultValue=""
                                            {...field}
                                            disabled={!selectedCategory}
                                            className="select bg-surface-muted border-border w-full cursor-pointer"
                                        >
                                            <option value="" disabled>
                                                {!selectedCategory
                                                    ? "Select category first"
                                                    : "Please select a sub category"}
                                            </option>

                                            {selectedSubCategories.map((sub: string) => (
                                                <option key={sub} value={sub}>
                                                    {sub}
                                                </option>
                                            ))}
                                        </select>
                                    )}
                                />
                                {errors.subCategory && (
                                    <p className='text-red-500 text-sm mt-1'>{errors.subCategory.message as string}</p>
                                )}
                            </div>
                            {/* Detail Description */}
                            <div>
                                <label className='block text-sm font-medium text-[var(--color-text)] mb-1'>Detail Description * (Min 100 words)</label>
                                <Controller
                                    name="detail_description"
                                    control={control}
                                    rules={{
                                        required: "Please enter a detail description",
                                        validate: (value) => {
                                            const wordCount = value.split(/\s+/).filter((word: string) => word.length > 0).length;
                                            return wordCount >= 100 || `Detail description must be at least 100 words (Current: ${wordCount})`;
                                        }
                                    }}
                                    render={({ field }) => (
                                        <RichTextEditor
                                            value={field.value || ''}
                                            onChange={field.onChange}
                                            placeholder="Enter detailed description of the product"
                                        />
                                    )}
                                />
                                {errors.detail_description && (
                                    <p className='text-red-500 text-sm mt-1'>{errors.detail_description.message as string}</p>
                                )}
                            </div>
                            {/* video url */}
                            <div>
                                <Input
                                    label="Video URL"
                                    placeholder='https://www.youtube.com/watch?v=example'
                                    {...register('video_url', {
                                        pattern: {
                                            value: /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/,
                                            message: 'Please enter a valid YouTube URL! (e.g., https://www.youtube.com/watch?v=example or https://youtu.be/example)'
                                        }
                                    })}
                                />
                                {errors.video_url && (
                                    <p className='text-red-500 text-sm mt-1'>{errors.video_url.message as string}</p>
                                )}
                            </div>
                            {/* Regular Price */}
                            <div>
                                <Input
                                    type='number'
                                    label="Regular Price"
                                    placeholder='20$'
                                    {...register('regular_price', {
                                        valueAsNumber: true,
                                        min: { value: 1, message: 'Price must be at least $1' },
                                        validate: (value) => {
                                            if (isNaN(value)) return 'Please enter a valid number for the price';
                                            return true;
                                        }
                                    })}
                                />
                                {errors.regular_price && (
                                    <p className='text-red-500 text-sm mt-1'>{errors.regular_price.message as string}</p>
                                )}
                            </div>
                            {/* Sale Price */}
                            <div>
                                <Input
                                    label="Sale Price *"
                                    placeholder='15$'
                                    {...register('sale_price', {
                                        min: { value: 1, message: 'Price must be at least $1' },
                                        valueAsNumber: true,
                                        validate: (value) => {
                                            if (isNaN(value)) return 'Please enter a valid number for the price';
                                            const regularPrice = parseFloat(watch('regular_price'));
                                            if (regularPrice && value >= regularPrice) {
                                                return 'Sale price must be less than regular price';
                                            }
                                            return true;
                                        }
                                    })}
                                />
                                {errors.sale_price && (
                                    <p className='text-red-500 text-sm mt-1'>{errors.sale_price.message as string}</p>
                                )}
                            </div>
                            {/* Stock Quantity */}
                            <div>
                                <Input
                                    type='number'
                                    label="Stock Quantity"
                                    placeholder='Enter stock quantity'
                                    {...register('stock_quantity', {
                                        valueAsNumber: true,
                                        min: { value: 0, message: 'Stock quantity must be a positive number' },
                                        max: { value: 1000, message: 'Stock quantity cannot exceed 1,000' },
                                        validate: (value) => {
                                            if (isNaN(value)) return 'Please enter a valid number for the stock quantity';
                                            if (!Number.isInteger(value)) return 'Stock quantity must be an whole number';
                                            return true;
                                        }
                                    })}
                                />
                                {errors.stock_quantity && (
                                    <p className='text-red-500 text-sm mt-1'>{errors.stock_quantity.message as string}</p>
                                )}
                            </div>
                            {/* Size Selector */}
                            <SizeSelector control={control} error={errors} />
                        </div>
                    </div>
                </div>
                <div className='mt-6 flex justify-end gap-3'>
                    {isChanged && (
                        <button
                            type='button'
                            onClick={handleSaveDraft}
                            className='px-4 py-2 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] hover:bg-[var(--color-surface-muted)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition cursor-pointer'
                        > Save Draft
                        </button>
                    )}
                    <button
                        type='submit'
                        onClick={handleSubmit(onSubmit)}
                        className='px-4 py-2 rounded-md border border-[var(--color-accent)] bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)] transition cursor-pointer'
                    > Create
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateProduct;