import React, { useRef } from "react";
import { X, Upload, Image as ImageIcon, Film } from "lucide-react";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast, Bounce } from "react-toastify";
import { publishVideo } from "../api/video.api";
import type { AxiosError } from "axios";
import { useCloudinary } from "../hooks/useCloudinary";

interface UploadVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess?: () => void;
}

interface UploadVideoFormData {
  title: string;
  description: string;
  videoFile: File | null;
  thumbnailFile: File | null;
}

export default function UploadVideoModal({
  isOpen,
  onClose,
  onUploadSuccess,
}: UploadVideoModalProps) {
  const queryClient = useQueryClient();
  const videoInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);

  const { uploadFile: uploadVideo, progress: videoProgress, isUploading: isVideoUploading } = useCloudinary();
  const { uploadFile: uploadThumbnail, progress: thumbnailProgress, isUploading: isThumbnailUploading } = useCloudinary();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<UploadVideoFormData>({
    defaultValues: {
      title: "",
      description: "",
      videoFile: null,
      thumbnailFile: null,
    },
  });

  const videoFile = watch("videoFile");
  const thumbnailFile = watch("thumbnailFile");

  const uploadMutation = useMutation({
    mutationFn: (data: FormData) => {
      return publishVideo(data);
    },
    onSuccess: () => {
      toast.success("Video uploaded successfully!", {
        position: "bottom-right",
        autoClose: 3000,
        transition: Bounce,
      });
      reset();
      queryClient.invalidateQueries({ queryKey: ["feed"] });
      if (onUploadSuccess) onUploadSuccess();
      onClose();
    },
    onError: (error: AxiosError<any>) => {
      toast.error(error.response?.data?.message || "Failed to upload video", {
        position: "bottom-right",
        autoClose: 3000,
        transition: Bounce,
      });
    },
  });

  if (!isOpen) return null;

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const maxSize = 100 * 1024 * 1024; // 100MB

      if (file.size > maxSize) {
        toast.error("Video file size exceeds 100MB limit", {
          position: "bottom-right",
          autoClose: 3000,
          transition: Bounce,
        });
        if (videoInputRef.current) {
          videoInputRef.current.value = "";
        }
        return;
      }

      setValue("videoFile", file, { shouldValidate: true });
    }
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setValue("thumbnailFile", e.target.files[0], { shouldValidate: true });
    }
  };

  const onSubmit: SubmitHandler<UploadVideoFormData> = async (data) => {
    if (!data.videoFile || !data.thumbnailFile) {
      toast.error("Please select both a video and a thumbnail.");
      return;
    }

    try {
      // Upload Video
      const videoResponse = await uploadVideo(data.videoFile, {
        folder: "videos"
      });

      // Upload Thumbnail
      const thumbnailResponse = await uploadThumbnail(data.thumbnailFile, {
        folder: "thumbnails"
      });

      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);

      // Append video data
      formData.append("videoFile", JSON.stringify({
        url: videoResponse.secure_url, // Cloudinary uses secure_url
        public_id: videoResponse.public_id,
        duration: videoResponse.duration || 0, // Cloudinary returns duration for videos
      }));

      // Append thumbnail data
      formData.append("thumbnail", JSON.stringify({
        url: thumbnailResponse.secure_url,
        public_id: thumbnailResponse.public_id
      }));

      uploadMutation.mutate(formData);

    } catch (error) {
      console.error("Upload to Cloudinary failed", error);
      toast.error("Failed to upload files to Cloudinary. Check your configuration.");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
      <div
        className="absolute inset-0"
        onClick={!uploadMutation.isPending ? onClose : undefined}
      ></div>

      <div className="bg-[#1a1a1a] w-full max-w-lg rounded-2xl p-6 shadow-2xl ring-1 ring-white/10 relative z-10 flex flex-col max-h-[90vh] overflow-y-auto border border-white/5">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-white text-xl font-bold tracking-tight">Upload Video</h2>
          <button
            onClick={onClose}
            disabled={uploadMutation.isPending || isVideoUploading || isThumbnailUploading}
            className="text-gray-400 hover:text-white transition-colors disabled:opacity-50 p-1 hover:bg-white/10 rounded-full"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Video File Input */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Video File
            </label>
            <div
              onClick={() => videoInputRef.current?.click()}
              className={`
                border border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 group
                ${videoFile
                  ? "border-white/20 bg-white/5"
                  : "border-gray-700 hover:border-gray-500 bg-black/20 hover:bg-black/40"
                }
              `}
            >
              <input
                type="file"
                ref={videoInputRef}
                onChange={handleVideoChange}
                accept="video/*"
                className="hidden"
              />
              {videoFile ? (
                <div className="text-center">
                  <Film className="w-10 h-10 text-white mx-auto mb-2" />
                  <p className="text-sm text-white font-medium truncate max-w-[200px]">
                    {videoFile.name}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">Selected</p>
                </div>
              ) : (
                <div className="text-center">
                  <div className="bg-white/5 p-3 rounded-full mb-3 group-hover:bg-white/10 transition-colors inline-block">
                    <Upload className="w-6 h-6 text-gray-400 group-hover:text-white" />
                  </div>
                  <p className="text-sm text-gray-300 font-medium">Click to upload video</p>
                  <p className="text-xs text-gray-500 mt-1">
                    MP4, WebM (Max 100MB)
                  </p>
                </div>
              )}
            </div>
            {errors.videoFile && (
              <p className="text-red-500 text-xs mt-1">
                Video file is required
              </p>
            )}

            {isVideoUploading && (
              <div className="mt-2">
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>Uploading Video...</span>
                  <span>{Math.round(videoProgress)}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-blue-500 h-full transition-all duration-300"
                    style={{ width: `${videoProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Thumbnail File Input */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Thumbnail
            </label>
            <div
              onClick={() => thumbnailInputRef.current?.click()}
              className={`
                border border-dashed rounded-xl p-4 flex items-center justify-center cursor-pointer transition-all duration-200 group
                ${thumbnailFile
                  ? "border-white/20 bg-white/5"
                  : "border-gray-700 hover:border-gray-500 bg-black/20 hover:bg-black/40"
                }
              `}
            >
              <input
                type="file"
                ref={thumbnailInputRef}
                onChange={handleThumbnailChange}
                accept="image/*"
                className="hidden"
              />
              {thumbnailFile ? (
                <div className="flex items-center gap-3">
                  <ImageIcon className="w-5 h-5 text-white" />
                  <span className="text-sm text-white truncate">
                    {thumbnailFile.name}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-gray-400 group-hover:text-gray-300">
                  <ImageIcon className="w-5 h-5" />
                  <span className="text-sm">Upload Thumbnail</span>
                </div>
              )}
            </div>
            {isThumbnailUploading && (
              <div className="mt-2">
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>Uploading Thumbnail...</span>
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

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Title
            </label>
            <input
              type="text"
              placeholder="Video title"
              className="w-full bg-black/40 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:ring-1 focus:ring-white/20 focus:border-white/20 outline-none transition-all placeholder:text-gray-600"
              {...register("title", { required: "Title is required" })}
            />
            {errors.title && (
              <p className="text-red-500 text-xs mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Description
            </label>
            <textarea
              placeholder="Tell viewers about your video"
              rows={4}
              className="w-full bg-black/40 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:ring-1 focus:ring-white/20 focus:border-white/20 outline-none transition-all placeholder:text-gray-600 resize-none"
              {...register("description", {
                required: "Description is required",
              })}
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={uploadMutation.isPending || isVideoUploading || isThumbnailUploading}
            className="w-full bg-[#2a2a2a] hover:bg-[#3f3f3f] disabled:bg-slate-800 disabled:text-gray-600 text-white font-semibold py-3 rounded-xl text-sm transition-all flex justify-center items-center shadow-lg shadow-black/20"
          >
            {uploadMutation.isPending || isVideoUploading || isThumbnailUploading ? (
              <>
                <span className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                Uploading...
              </>
            ) : (
              "Upload Video"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

