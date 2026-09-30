
import { useState } from "react";
import axios from "axios";

interface CloudinaryResponse {
    asset_id: string;
    public_id: string;
    version: number;
    version_id: string;
    signature: string;
    width: number;
    height: number;
    format: string;
    resource_type: string;
    created_at: string;
    tags: string[];
    bytes: number;
    type: string;
    etag: string;
    placeholder: boolean;
    url: string;
    secure_url: string;
    access_mode: string;
    original_filename: string;
    duration?: number; // For videos
}

export const useCloudinary = () => {
    const [progress, setProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    /**
     * Uploads a file to Cloudinary using unsigned upload.
     * Requires VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET env variables,
     * or they can be passed as arguments.
     */
    const uploadFile = async (
        file: File,
        options?: {
            cloudName?: string;
            uploadPreset?: string;
            folder?: string;
        }
    ): Promise<CloudinaryResponse> => {
        setIsUploading(true);
        setProgress(0);
        setError(null);

        const cloudName = options?.cloudName || import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

        let envPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
        if (file.type.startsWith("video/")) {
            envPreset = import.meta.env.VITE_CLOUDINARY_VIDEO_UPLOAD_PRESET || envPreset;
        } else if (file.type.startsWith("image/")) {
            envPreset = import.meta.env.VITE_CLOUDINARY_THUMBNAIL_UPLOAD_PRESET || envPreset;
        }

        const uploadPreset = options?.uploadPreset || envPreset;

        if (!cloudName || !uploadPreset) {
            const missing = [];
            if (!cloudName) missing.push("Cloud Name");
            if (!uploadPreset) missing.push("Upload Preset");
            const errMsg = `Missing Cloudinary configuration: ${missing.join(", ")}. Please check VITE_CLOUDINARY_CLOUD_NAME, VITE_CLOUDINARY_VIDEO_UPLOAD_PRESET, or VITE_CLOUDINARY_THUMBNAIL_UPLOAD_PRESET in your .env file.`;

            setError(errMsg);
            setIsUploading(false);
            throw new Error(errMsg);
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", uploadPreset);
        if (options?.folder) {
            formData.append("folder", options.folder);
        }

        try {
            const response = await axios.post<CloudinaryResponse>(
                `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                    onUploadProgress: (progressEvent) => {
                        if (progressEvent.total) {
                            const percent = Math.round(
                                (progressEvent.loaded * 100) / progressEvent.total
                            );
                            setProgress(percent);
                        }
                    },
                }
            );

            return response.data;
        } catch (err: any) {
            console.error("Cloudinary upload error:", err);
            const errMsg = err.response?.data?.error?.message || err.message || "Upload failed";
            setError(errMsg);
            throw new Error(errMsg);
        } finally {
            setIsUploading(false);
        }
    };

    return {
        progress,
        isUploading,
        error,
        uploadFile,
    };
};
