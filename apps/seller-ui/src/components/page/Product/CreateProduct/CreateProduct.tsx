"use client";
import BreadCrumbAndHeader from '@/components/Shared/BreadCrumbAndHeader';

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

            </form>
        </div>
    );
};

export default CreateProduct;