import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import {
  Camera,
  Loader2,
  Upload
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Bounce, toast } from "react-toastify";
import { avatarUpload, coverUpload, updateUser } from "../../api/user.api";
import type { RootState } from "../../store/store";

type UpdateUserData = {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  description: string;
};

export default function MyDetailsTab() {
  const [headerImage, setHeaderImage] = useState<string | undefined>();
  const [avatarImage, setAvatarImage] = useState<string | undefined>();

  const user = useSelector((store: RootState) => store.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      reset({
        firstName: user.fullName.split(" ")[0] ?? " ",
        lastName: user.fullName.split(" ")[1] ?? " ",
        email: user.email ?? " ",
        username: user.username ?? " ",
        description: user?.description ?? "",
      });
    }
  }, [user]);

  const updateUserMutation = useMutation({
    mutationFn: updateUser,
    onSuccess: (data) => {
      const userUpdatedData = data.data;

      const [firstName = "", lastName = ""] =
        userUpdatedData?.fullName?.split(" ") ?? [];

      reset({
        firstName: firstName ?? " ",
        lastName: lastName ?? " ",
        email: userUpdatedData?.email ?? " ",
        username: userUpdatedData?.username ?? " ",
        description: userUpdatedData?.description ?? "",
      });

      toast.success(data?.message ?? "Account details updated successfully", {
        position: "bottom-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    },
    onError: (error: AxiosError<any>) => {
      toast.error(error?.response?.data?.message ?? "user update failed", {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    },
  });

  const updateAvatarMutation = useMutation({
    mutationFn: avatarUpload,
    onSuccess: (data) => {
      setAvatarImage(data?.data?.avatar?.url);
      toast.success("Avatar updated");
    },
    onError: () => {
      toast.error("avatar image upload failed");
    },
  });

  const updateCoverMutation = useMutation({
    mutationFn: coverUpload,
    onSuccess: (data) => {
      setHeaderImage(data?.data?.coverImage?.url);
      toast.success("Cover updated");
    },
    onError: () => {
      toast.error("cover image upload failed");
    },
  });

  const {
    register,
    handleSubmit,
    formState: { isDirty, errors },
    reset,
  } = useForm<UpdateUserData>({
    defaultValues: {
      username: "",
      email: "",
      description: "",
      firstName: "",
      lastName: "",
    },
  });

  const onSubmit = (data: UpdateUserData) => {
    const updateData = {
      username: data.username,
      email: data.email,
      description: data.description,
      fullName: `${data.firstName} ${data.lastName}`,
    };
    updateUserMutation.mutate(updateData);
  };

  function handleCoverUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Only images are allowed");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Max file size is 5MB");
      return;
    }
    updateCoverMutation.mutate(file);
  }
  function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {

    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Only images are allowed");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Max file size is 5MB");
      return;
    }
    updateAvatarMutation.mutate(file);
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Image Section */}
      <div className="relative group">
        <div className="w-full h-48 md:h-64 rounded-xl overflow-hidden bg-gradient-to-r from-pink-500 via-orange-400 to-cyan-400 relative">
          <img
            src={headerImage ?? user?.coverImage?.url}
            alt="Cover"
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <label className="cursor-pointer bg-white/20 hover:bg-white/30 backdrop-blur-md p-3 rounded-full transition-all text-white">
              {updateCoverMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Camera size={24} />
              )}
              <input
                type="file"
                className="hidden"
                onChange={handleCoverUpload}
                accept="image/*"
              />
            </label>
          </div>
        </div>

        {/* Profile Avatar & Info Overlay */}
        <div className="flex bg-black -mt-12 mx-4 md:ml-8 relative z-10 p-4 rounded-xl items-start gap-4 max-w-2xl">
          <div className="relative shrink-0">
            <img
              src={avatarImage ?? user?.avatar?.url}
              alt="Avatar"
              className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-black object-cover"
            />
            <label className="absolute bottom-0 right-0 bg-white text-black p-1.5 rounded-full cursor-pointer hover:bg-gray-200 transition-colors shadow-lg border-2 border-black">
              {updateAvatarMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Upload size={14} />
              )}
              <input
                type="file"
                className="hidden"
                onChange={handleAvatarUpload}
                accept="image/*"
              />
            </label>
          </div>
          <div className="flex-1 pt-2 md:pt-4">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold text-white">
                  {user?.fullName}
                </h2>
                <p className="text-gray-400 text-sm">{user?.username}</p>
              </div>
              <button
                onClick={() => navigate("/profile")}
                className="hidden md:block bg-[#2a2a2a] hover:bg-[#3f3f3f] text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-colors"
              >
                View profile
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Personal Info Form */}
      <div className="border border-gray-800 rounded-xl p-6 space-y-6">
        <div className="flex flex-col md:flex-row justify-between gap-4 border-b border-gray-800 pb-6">
          <div className="md:w-1/3">
            <h3 className="font-semibold text-white">Personal info</h3>
            <p className="text-sm text-gray-400 mt-1">
              Update your photo and personal details.
            </p>
          </div>
          <div className="md:w-2/3 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-400 uppercase">
                  First name
                </label>
                <input
                  id="firstName"
                  type="text"
                  {...register("firstName")}
                  className="w-full bg-black border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:ring-1 focus:ring-purple-500 outline-none transition-all"
                />
                {errors.firstName && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.firstName.message}
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-400 uppercase">
                  Last name
                </label>
                <input
                  id="lastName"
                  type="text"
                  {...register("lastName")}
                  className="w-full bg-black border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:ring-1 focus:ring-purple-500 outline-none transition-all"
                />
                {errors.lastName && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-400 uppercase">
                Email address
              </label>
              <div className="relative">
                <MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                <input
                  type="email"
                  id="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Please enter a valid email address",
                    },
                  })}
                  className="w-full bg-black border border-gray-700 rounded-lg pl-10 pr-4 py-2.5 text-white focus:ring-1 focus:ring-purple-500 outline-none"
                />

                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Profile Section */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="md:w-1/3">
              <h3 className="font-semibold text-white">Profile</h3>
              <p className="text-sm text-gray-400 mt-1">
                Update your portfolio and bio.
              </p>
            </div>
            <div className="md:w-2/3 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-400 uppercase">
                  Username
                </label>
                <div className="flex rounded-lg overflow-hidden border border-gray-700 focus-within:ring-1 focus-within:ring-purple-500">
                  <span className="bg-gray-900 text-gray-400 px-3 py-2.5 text-sm border-r border-gray-700 select-none">
                    vidplay.com/
                  </span>
                  <input
                    id="username"
                    type="text"
                    {...register("username", {
                      required: "Username is required",
                      minLength: {
                        value: 3,
                        message: "Username must be at least 3 characters",
                      },
                      maxLength: {
                        value: 20,
                        message: "Username must be less than 20 characters",
                      },
                      pattern: {
                        value: /^[a-zA-Z0-9_]+$/,
                        message:
                          "Only letters, numbers and underscores allowed",
                      },
                    })}
                    className="flex-1 bg-black px-3 py-2.5 text-white outline-none"
                  />
                </div>
                {errors.username && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.username.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-400 uppercase">
                  Description
                </label>
                <textarea
                  id="description"
                  {...register("description", {
                    maxLength: {
                      value: 200,
                      message: "Max 200 characters allowed",
                    },
                  })}
                  rows={4}
                  className="w-full bg-black border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:ring-1 focus:ring-purple-500 outline-none transition-all"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
            <button className="px-4 py-2 text-gray-400 hover:text-white transition-colors text-sm font-medium">
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isDirty || updateUserMutation.isPending}
              className="px-4 py-2 bg-[#2a2a2a] hover:bg-[#3f3f3f] text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
            >
              {updateUserMutation.isPending ? "Saving..." : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function MailIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}
