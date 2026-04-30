"use client";
import BreadCrumbAndHeader from '@/components/Shared/BreadCrumbAndHeader';
import ImagePlaceHolder from '@/components/Shared/ImagePlaceHolder/ImagePlaceHolder';
import { useState } from 'react';

import { useForm } from 'react-hook-form';
import Input from '../../../../../../../packages/components/Input/Index';
import ColorSelector from '../../../../../../../packages/components/color-selector';
import CustomSpecifications from '../../../../../../../packages/components/custom-specifications';
import CustomProperties from '../../../../../../../packages/components/custom-properties';

const CreateProduct = () => {
    const [openImageModal, setOpenImageModal] = useState(false);
    const [isChanged, setIsChanged] = useState(false);
    const [images, setImages] = useState<(File | null)[]>([null]);
    const [loading, setLoading] = useState(false);

    const { register, control, watch, setValue, handleSubmit, formState: { errors }, } = useForm()

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


    return (
        <div>
            {/* BreadCrumb And Header */}
            <BreadCrumbAndHeader title="Create Product" breadcrumbs={[
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
                                <label className='block text-sm font-medium text-[var(--color-text)] mb-2'>Product Description *</label>
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
                                <label className='block text-sm font-medium text-[var(--color-text)] mb-2'>Category *</label>
                                <select
                                    defaultValue="Please select a category"
                                    className="select bg-surface-muted border-border w-full cursor-pointer"
                                    {...register('category', { required: 'Please select a category' })}
                                >
                                    <option disabled={true}>Please select a category</option>
                                    <option value="electronics">Electronics</option>
                                    <option value="clothing">Clothing</option>
                                    <option value="home">Home</option>
                                </select>
                                {errors.category && (
                                    <p className='text-red-500 text-sm mt-1'>{errors.category.message as string}</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default CreateProduct;