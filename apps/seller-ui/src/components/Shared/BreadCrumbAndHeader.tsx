import { Fragment } from 'react';
import { ChevronRightIcon } from 'lucide-react';
import Link from 'next/link';

type Props = {
    title: string;
    breadcrumbs: {
        name: string;
        href?: string;
    }[];
}

const BreadCrumbAndHeader = ({title, breadcrumbs}: Props) => {
    return (
        <div>
            <h1 className='text-2xl py-2 font-semibold text-white'>{title}</h1>
            <div className='flex items-center gap-1'>
                {breadcrumbs?.map((breadcrumb, index) => (
                    <Fragment key={index}>
                        {breadcrumb.href ? (
                            <Link href={breadcrumb.href} className='text-sm text-[#80Deea] hover:text-gray-200'>
                                {breadcrumb.name}
                            </Link>
                        ) : (
                            <span className='text-sm text-gray-400'>{breadcrumb.name}</span>
                        )}
                        {index < breadcrumbs.length - 1 && (
                            <ChevronRightIcon size={18} className='text-sm text-gray-400' />
                        )}
                    </Fragment>
                ))}
            </div>
        </div>
    );
};

export default BreadCrumbAndHeader;