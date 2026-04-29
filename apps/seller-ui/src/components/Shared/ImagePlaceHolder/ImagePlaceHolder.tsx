import { Pencil, WandSparkles, X } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

type Props = {
    size: number | string;
    small?: boolean;
    onImageChange: (file: File | null, index: number) => void;
    onRemove?: (index: number) => void;
    defaultImage?: string | null;
    setOpenImageModal: (openImageModal: boolean) => void;
    index?: any;
}

const ImagePlaceHolder = ({ size, small, onImageChange, onRemove, defaultImage, setOpenImageModal, index }: Props) => {

    const [imagePreview, setImagePreview] = useState<string | null>(defaultImage || null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setImagePreview(URL.createObjectURL(file));
            onImageChange(file, index);
        }
    };

    return (
        <div
            className={`relative ${small ? "h-[180px]" : "h-[450px]"} w-full cursor-pointer bg-[var(--color-surface-muted)] border border-[var(--color-border)] rounded-lg flex flex-col items-center justify-center shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]`}
        >
            <input type='file'
                accept='image/*'
                className='hidden'
                id={`image-upload-${index}`}
                onChange={handleFileChange}
            />
            {imagePreview ? (
                <>
                    <button type='button'
                        onClick={() => {
                            setImagePreview(null);
                            onRemove ? onRemove(index) : onImageChange(null, index);
                        }}
                        className='absolute top-3 right-3 rounded bg-[#ef4444] text-white shadow-lg cursor-pointer p-2 z-10'
                    >
                        <X size={16} />
                    </button>
                    <button type='button' onClick={() => setOpenImageModal(true)}
                        className='absolute top-3 right-16 rounded bg-[var(--color-accent)] shadow-lg cursor-pointer p-2 z-10'>
                        <WandSparkles size={16} color='white' />
                    </button>
                </>
            ) : (
                <label htmlFor={`image-upload-${index}`} className='absolute top-3 right-3 p-2 rounded bg-[var(--color-surface-strong)] border border-[var(--color-border)] shadow-lg cursor-pointer'>
                    <Pencil size={16} color='white' />
                </label>
            )}

            {imagePreview ? (
                <Image
                    src={imagePreview}
                    alt={`Image Preview ${index}`}
                    width={400}
                    height={300}
                    className='object-cover h-full w-full rounded-md'
                />
            ) : (
                <>
                    <p className={`text-[var(--color-text)] ${small ? "text-xl" : "text-4xl"} font-semibold`}>
                        {size}
                    </p>
                    <p className={`text-[var(--color-text-muted)] ${small ? "text-sm" : "text-base"} pt-2 text-center`}>
                        Please choose an Image <br />
                        according to the expected ratio.
                    </p>
                </>
            )}
        </div>
    );
};

export default ImagePlaceHolder;