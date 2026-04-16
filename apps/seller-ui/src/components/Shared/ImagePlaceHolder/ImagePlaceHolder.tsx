import { useState } from 'react';

type Props = {
    size: number;
    small?: boolean;
    onImageChange: (file: File | null, index: number) => void;
    onRemove?: (index: number) => void;
    defaultImage?: string | null;
    setOpenImageModal: (openImageModal: boolean) => void;
    index?: any;
}

const ImagePlaceHolder = ({ size, small, onImageChange, onRemove, defaultImage, setOpenImageModal, index }: Props) => {
    const [imagePreview, setImagePreview] = useState<string | null>(defaultImage || null);


    return (
        <div>
            ImagePlaceHolder 
        </div>
    );
};

export default ImagePlaceHolder;