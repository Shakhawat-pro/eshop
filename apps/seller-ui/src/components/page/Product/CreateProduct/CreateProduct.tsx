"use client";
import BreadCrumbAndHeader from '@/components/Shared/BreadCrumbAndHeader';
import ImagePlaceHolder from '@/components/Shared/ImagePlaceHolder/ImagePlaceHolder';
import { useState } from 'react';

import { useForm } from 'react-hook-form';
import Input from '../../../../../../../packages/components/Input/Index';

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
                    <div className='md:w-[35%] flex items-center'>
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
                    <div className='md:w-[65%] '>
                        <div className='w-full flex gap-6'>
                            {/* Product Title Input */}
                            <div className='w-2/4'>
                                <Input
                                    label="Product Title"
                                    placeholder='Enter Product Title'
                                    {...register('title', { required: 'Product title is required' })}
                                />

                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default CreateProduct;