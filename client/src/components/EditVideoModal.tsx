import React, { useRef, useEffect } from "react";
import { X, Image as ImageIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { useUpdateVideo } from "../hooks/useVideoMutations";
import { useCloudinary } from "../hooks/useCloudinary";
import type { Video } from "../api/types";

interface EditVideoModalProps {
    isOpen: boolean;
    onClose: () => void;
    video: Video | null;
}

interface EditVideoFormData {
    title: string;
    description: string;
    thumbnailFile: File | null;
}

export default function EditVideoModal({
    isOpen,
    onClose,
    video,
}: EditVideoModalProps) {
    const thumbnailInputRef = useRef<HTMLInputElement>(null);
    const updateVideoMutation = useUpdateVideo();
    const { uploadFile: uploadThumbnail, progress: thumbnailProgress, isUploading: isThumbnailUploading } = useCloudinary();

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors, isDirty },
    } = useForm<EditVideoFormData>({
        defaultValues: {
            title: "",
            description: "",
            thumbnailFile: null,
        },
    });

    const thumbnailFile = watch("thumbnailFile");

    // Pre-fill form when video data changes
    useEffect(() => {
        if (video && isOpen) {
            reset({
                title: video.title,
                description: video.description,
                thumbnailFile: null,
            });
        }
    }, [video, isOpen, reset]);

    // Handle ESC key to close modal
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape" && !updateVideoMutation.isPending && !isThumbnailUploading) {
                onClose();
            }
        };
        if (isOpen) {
            document.addEventListener("keydown", handleEsc);
        }
        return () => document.removeEventListener("keydown", handleEsc);
    }, [isOpen, onClose, updateVideoMutation.isPending, isThumbnailUploading]);

    if (!isOpen || !video) return null;

    const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setValue("thumbnailFile", e.target.files[0], { shouldDirty: true });
        }
    };

    const getThumbnailPreview = (): string => {
        if (thumbnailFile) {
            return URL.createObjectURL(thumbnailFile);
        }
        return video.thumbnail.url;
    };

    const onSubmit: SubmitHandler<EditVideoFormData> = async (data) => {
        const formData = new FormData();
        formData.append("title", data.title);
        formData.append("description", data.description);

        // If new thumbnail is selected, upload to Cloudinary first
        if (data.thumbnailFile) {
            try {
                const thumbnailResponse = await uploadThumbnail(data.thumbnailFile, {
                    folder: "thumbnails"
                });

                formData.append("thumbnail", JSON.stringify({
                    url: thumbnailResponse.secure_url,
                    public_id: thumbnailResponse.public_id
                }));
            } catch (error) {
                console.error("Thumbnail upload failed", error);
                return;
            }
        }

        updateVideoMutation.mutate(
            { videoId: video._id, data: formData },
            {
                onSuccess: () => {
                    reset();
                    onClose();
                },
            }
        );
    };

    const isLoading = updateVideoMutation.isPending || isThumbnailUploading;

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-video-title"
        >
            <div
                className="absolute inset-0"
                onClick={!isLoading ? onClose : undefined}
            ></div>

            <div className="bg-[#1a1a1a] w-full max-w-lg rounded-2xl p-6 shadow-2xl ring-1 ring-white/10 relative z-10 flex flex-col max-h-[90vh] overflow-y-auto border border-white/5">
                <div className="flex justify-between items-center mb-6">
                    <h2 id="edit-video-title" className="text-white text-xl font-bold tracking-tight">
                        Edit Video
                    </h2>
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="text-gray-400 hover:text-white transition-colors disabled:opacity-50 p-1 hover:bg-white/10 rounded-full"
                        aria-label="Close modal"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Current Thumbnail with Replace Option */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Thumbnail
                        </label>
                        <div className="flex items-start gap-4">
                            {/* Thumbnail Preview */}
                            <div className="w-32 h-20 rounded-lg overflow-hidden bg-gray-800 flex-shrink-0">
                                <img
                                    src={getThumbnailPreview()}
                                    alt="Video thumbnail"
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Replace Button */}
                            <div className="flex-1">
                                <div
                                    onClick={() => thumbnailInputRef.current?.click()}
                                    className="border border-dashed border-gray-700 hover:border-gray-500 rounded-xl p-4 flex items-center justify-center cursor-pointer transition-all duration-200 group bg-black/20 hover:bg-black/40"
                                >
                                    <input
                                        type="file"
                                        ref={thumbnailInputRef}
                                        onChange={handleThumbnailChange}
                                        accept="image/*"
                                        className="hidden"
                                    />
                                    {thumbnailFile ? (
                                        <div className="flex items-center gap-2 text-white">
                                            <ImageIcon className="w-4 h-4" />
                                            <span className="text-sm truncate max-w-[120px]">
                                                {thumbnailFile.name}
                                            </span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2 text-gray-400 group-hover:text-gray-300">
                                            <ImageIcon className="w-4 h-4" />
                                            <span className="text-sm">Replace Thumbnail</span>
                                        </div>
                                    )}
                                </div>
                                {isThumbnailUploading && (
                                    <div className="mt-2">
                                        <div className="flex justify-between text-xs text-gray-400 mb-1">
                                            <span>Uploading...</span>
                                            <span>{Math.round(thumbnailProgress)}%</span>
                                        </div>
                                        <div className="w-full bg-gray-700 rounded-full h-1.5 overflow-hidden">
                                            <div
                                                className="bg-purple-500 h-full transition-all duration-300"
                                                style={{ width: `${thumbnailProgress}%` }}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Title Input */}
                    <div>
                        <label htmlFor="edit-title" className="block text-sm font-medium text-gray-300 mb-1">
                            Title
                        </label>
                        <input
                            id="edit-title"
                            type="text"
                            placeholder="Video title"
                            className="w-full bg-black/40 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:ring-1 focus:ring-white/20 focus:border-white/20 outline-none transition-all placeholder:text-gray-600"
                            {...register("title", { required: "Title is required" })}
                        />
                        {errors.title && (
                            <p className="text-red-500 text-xs mt-1" role="alert">
                                {errors.title.message}
                            </p>
                        )}
                    </div>

                    {/* Description Input */}
                    <div>
                        <label htmlFor="edit-description" className="block text-sm font-medium text-gray-300 mb-1">
                            Description
                        </label>
                        <textarea
                            id="edit-description"
                            placeholder="Tell viewers about your video"
                            rows={4}
                            className="w-full bg-black/40 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:ring-1 focus:ring-white/20 focus:border-white/20 outline-none transition-all placeholder:text-gray-600 resize-none"
                            {...register("description", {
                                required: "Description is required",
                            })}
                        />
                        {errors.description && (
                            <p className="text-red-500 text-xs mt-1" role="alert">
                                {errors.description.message}
                            </p>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isLoading}
                            className="flex-1 bg-gray-800 hover:bg-gray-700 disabled:bg-gray-900 disabled:text-gray-600 text-white font-medium py-3 rounded-xl text-sm transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading || !isDirty}
                            className="flex-1 bg-[#2a2a2a] hover:bg-[#3f3f3f] disabled:bg-slate-800 disabled:text-gray-600 text-white font-semibold py-3 rounded-xl text-sm transition-all flex justify-center items-center shadow-lg shadow-black/20"
                        >
                            {isLoading ? (
                                <>
                                    <span className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                                    Saving...
                                </>
                            ) : (
                                "Save Changes"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
