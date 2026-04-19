"use client";
import BreadCrumbAndHeader from '@/components/Shared/BreadCrumbAndHeader';
import ImagePlaceHolder from '@/components/Shared/ImagePlaceHolder/ImagePlaceHolder';
import { useState } from 'react';

import { useForm } from 'react-hook-form';

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
            return updatedImages;
        });
        setValue('images', images);
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
                    <div className='w-full max-w-[35%] bg-[#1e1e1e] rounded-md p-4'>
                        <ImagePlaceHolder
                            size="765 x 850"
                            small={false}
                            setOpenImageModal={setOpenImageModal}
                            onImageChange={handleImageChange}
                            onRemove={handleRemoveImage}
                        />
                    </div>
                </div>
            </form>
        </div>
    );
};

export default CreateProduct;