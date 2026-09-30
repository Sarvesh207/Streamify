import { useEffect } from "react";
import { AlertTriangle, X } from "lucide-react";
import { useDeleteVideo } from "../hooks/useVideoMutations";
import type { Video } from "../api/types";

interface DeleteConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    video: Video | null;
}

export default function DeleteConfirmModal({
    isOpen,
    onClose,
    video,
}: DeleteConfirmModalProps) {
    const deleteVideoMutation = useDeleteVideo();

    // Handle ESC key to close modal
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape" && !deleteVideoMutation.isPending) {
                onClose();
            }
        };
        if (isOpen) {
            document.addEventListener("keydown", handleEsc);
        }
        return () => document.removeEventListener("keydown", handleEsc);
    }, [isOpen, onClose, deleteVideoMutation.isPending]);

    if (!isOpen || !video) return null;

    const handleDelete = () => {
        deleteVideoMutation.mutate(video._id, {
            onSuccess: () => {
                onClose();
            },
        });
    };

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-modal-title"
            aria-describedby="delete-modal-description"
        >
            <div
                className="absolute inset-0"
                onClick={!deleteVideoMutation.isPending ? onClose : undefined}
            ></div>

            <div className="bg-[#1a1a1a] w-full max-w-md rounded-2xl p-6 shadow-2xl ring-1 ring-white/10 relative z-10 border border-white/5">
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                            <AlertTriangle className="w-5 h-5 text-red-400" />
                        </div>
                        <h2 id="delete-modal-title" className="text-white text-lg font-bold">
                            Delete Video
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        disabled={deleteVideoMutation.isPending}
                        className="text-gray-400 hover:text-white transition-colors disabled:opacity-50 p-1 hover:bg-white/10 rounded-full"
                        aria-label="Close modal"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="mb-6">
                    <p id="delete-modal-description" className="text-gray-400 text-sm mb-3">
                        Are you sure you want to delete this video? This action cannot be undone.
                    </p>

                    {/* Video Preview */}
                    <div className="bg-black/40 rounded-lg p-3 flex items-center gap-3 border border-gray-800">
                        <img
                            src={video.thumbnail.url}
                            alt=""
                            className="w-16 h-10 rounded object-cover"
                        />
                        <div className="flex-1 min-w-0">
                            <p className="text-white text-sm font-medium truncate">
                                {video.title}
                            </p>
                            <p className="text-gray-500 text-xs">
                                {video.views} views
                            </p>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={deleteVideoMutation.isPending}
                        className="flex-1 bg-gray-800 hover:bg-gray-700 disabled:bg-gray-900 disabled:text-gray-600 text-white font-medium py-3 rounded-xl text-sm transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleDelete}
                        disabled={deleteVideoMutation.isPending}
                        className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-900 disabled:text-gray-400 text-white font-semibold py-3 rounded-xl text-sm transition-all flex justify-center items-center"
                    >
                        {deleteVideoMutation.isPending ? (
                            <>
                                <span className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                                Deleting...
                            </>
                        ) : (
                            "Delete Video"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
