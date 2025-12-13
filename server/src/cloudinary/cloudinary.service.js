const cloudinary = require("cloudinary").v2;
require("dotenv").config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload file (from buffer or temp path)
async function uploadFile(filePath) {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            folder: "prolancer_uploads",
        });

        return {
            success: true,
            url: result.secure_url,
            publicId: result.public_id,
        };
    } catch (err) {
        return {
            success: false,
            message: "Cloudinary upload failed",
            error: err.message,
        };
    }
}

async function deleteFile(publicId) {
    try {
        await cloudinary.uploader.destroy(publicId);
        return { success: true };
    } catch (err) {
        return {
            success: false,
            message: "Failed to delete Cloudinary file",
            error: err.message,
        };
    }
}

module.exports = { uploadFile, deleteFile };
