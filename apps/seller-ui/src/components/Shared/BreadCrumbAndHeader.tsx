import { Fragment } from 'react';
import { ChevronRightIcon } from 'lucide-react';
import Link from 'next/link';

type Props = {
    header: string;
    description?: string;
    breadcrumbs?: {
        name: string;
        href?: string;
    }[];
}

const BreadCrumbAndHeader = ({ header, description, breadcrumbs }: Props) => {
    return (
        <div>
            <h1 className='text-2xl py-2 font-semibold text-white'>{header}</h1>
            <p className='text-gray-400'>{description}</p>
            <div className='flex items-center gap-1'>
                {breadcrumbs && breadcrumbs.length > 0 ? (
                    breadcrumbs.map((breadcrumb, index) => (
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
                    ))
                ) : null}
            </div>
        </div>
    );
}

export default BreadCrumbAndHeader;