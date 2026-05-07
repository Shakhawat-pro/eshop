import ImageKit from '@imagekit/nodejs';

export const imagekitClient = new ImageKit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
});
