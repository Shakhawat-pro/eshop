import { Loader2, Pencil, WandSparkles, X } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface UploadedImage {
    fileId: string;
    file_url: string;
}

type Props = {
    images?: (UploadedImage | null)[];
    size: number | string;
    small?: boolean;
    onImageChange: (file: File | null, index: number, previewUrl?: string | null) => void;
    onRemove?: (index: number) => void;
    defaultImage?: string | null;
    setSelectedImage?: (e: string) => void;
    setOpenImageModal: (openImageModal: boolean) => void;
    index?: any;
    loading?: boolean;
    loadingText?: string;
}

const ImagePlaceHolder = ({ images, size, small, onImageChange, onRemove, defaultImage, setSelectedImage, setOpenImageModal, index, loading = false, loadingText = 'Loading...' }: Props) => {

    const [imagePreview, setImagePreview] = useState<string | null>(defaultImage || null);

    useEffect(() => {
        if (defaultImage && defaultImage !== imagePreview) {
            setImagePreview(defaultImage);
        }
    }, [defaultImage, imagePreview]);

    // useEffect(() => {
    //     const currentFileUrl = images?.[index]?.file_url || null;
    //     if (currentFileUrl && currentFileUrl !== imagePreview) {
    //         setImagePreview(currentFileUrl);
    //     }
    // }, [images, index, imagePreview]);
    useEffect(() => {
    const currentFileUrl = images?.[index]?.file_url || null;

    setImagePreview(currentFileUrl);
}, [images, index]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);
            onImageChange(file, index, previewUrl);
        }
    };

    return (
        <div
            aria-busy={loading}
            className={`relative ${small ? "h-[180px]" : "h-[450px]"} w-full cursor-pointer bg-[var(--color-surface-muted)] border border-[var(--color-border)] rounded-lg flex flex-col items-center justify-center shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]`}
        >
            <input type='file'
                accept='image/*'
                className='hidden'
                id={`image-upload-${index}`}
                disabled={loading}
                onChange={handleFileChange}
            />
            {imagePreview ? (
                <>
                    <button type='button'
                        disabled={loading}
                        onClick={() => {
                            setImagePreview(null);
                            onRemove ? onRemove(index) : onImageChange(null, index);
                        }}
                        className='absolute top-3 right-3 rounded bg-[#ef4444] text-white shadow-lg cursor-pointer p-2 z-10 disabled:cursor-not-allowed disabled:opacity-60'
                    >
                        <X size={16} />
                    </button>
                    <button type='button'
                        disabled={loading}
                        onClick={() => {
                            setOpenImageModal(true)
                            setSelectedImage?.(imagePreview || images?.[index]?.file_url || "")
                        }}
                        className='absolute top-3 right-16 rounded bg-[var(--color-accent)] shadow-lg cursor-pointer p-2 z-10 disabled:cursor-not-allowed disabled:opacity-60'>
                        <WandSparkles size={16} color='white' />
                    </button>
                </>
            ) : (
                <label htmlFor={`image-upload-${index}`} className={`absolute top-3 right-3 p-2 rounded bg-[var(--color-surface-strong)] border border-[var(--color-border)] shadow-lg cursor-pointer ${loading ? 'pointer-events-none opacity-60' : ''}`}>
                    <Pencil size={16} color='white' />
                </label>
            )}

            {loading && (
                <div className='absolute inset-0 z-20 flex flex-col items-center justify-center rounded-lg bg-[rgba(15,23,42,0.6)] backdrop-blur-[2px]'>
                    <Loader2 className='h-8 w-8 animate-spin text-white' />
                    <p className='mt-3 text-sm font-medium text-white'>{loadingText}</p>
                </div>
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