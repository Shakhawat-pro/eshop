"use client";
import BreadCrumbAndHeader from '@/components/Shared/BreadCrumbAndHeader';
import ImagePlaceHolder from '@/components/Shared/ImagePlaceHolder/ImagePlaceHolder';

import { useForm } from 'react-hook-form';

const CreateProduct = () => {

    const { register, control, watch, setValue, handleSubmit, formState: { errors }, } = useForm()

    const onSubmit = (data: any) => {
        console.log(data);
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
                         <ImagePlaceHolder size={200} onImageChange={() => { }} setOpenImageModal={() => { }} />
                    </div>
                </div>
            </form>
        </div>
    );
};

export default CreateProduct;