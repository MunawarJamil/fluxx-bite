import cloudinary from "../config/cloudinary.js";

export const uploadToCloudinary = async (file: {
    buffer: Buffer;
    mimetype: string;
}) => {
    const fileBase64 = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;

    const result = await cloudinary.uploader.upload(fileBase64, {
        folder: 'fluxx-bite',
        resource_type: 'image',
    });

    return {
        url: result.secure_url,
        public_id: result.public_id,
    };
};