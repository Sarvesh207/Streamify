import { useState } from "react";
import { changePassword } from "../../api/user.api";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";
import type { ChangePasswordData } from "../../api/types";
import type { AxiosError } from "axios";

type ChangePasswordForm = {
  oldPassword: string;
  newPassword: string;
};

export default function PasswordTab() {
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { isDirty },
  } = useForm<ChangePasswordForm>({
    defaultValues: {
      oldPassword: "",
      newPassword: "",
    },
  });
  const updatePasswordMutation = useMutation({
    mutationFn: changePassword,
    onSuccess: (data) => {
      reset();
      toast.success(data.message ?? "Password  successfully");
    },
    onError: (error: AxiosError<any>) => {
      toast.error(
        error?.response?.data?.message ?? "Failed to update Passward"
      );
    },
  });

  const onSubmit = (data: ChangePasswordData) => {
    updatePasswordMutation.mutate(data);
  };

  return (
    <div className="border border-gray-800 rounded-xl p-6  animate-fade-in">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col md:flex-row justify-between gap-4 border-b border-gray-800 pb-6 mb-6">
          <div className="md:w-1/3">
            <h3 className="font-semibold text-white">Password</h3>
            <p className="text-sm text-gray-400 mt-1">
              Please enter your current password to change your password.
            </p>
          </div>
          <div className="md:w-2/3 space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-400 uppercase">
                Old password
              </label>
              <div className="relative">
                <input
                  id="oldPassward"
                  type={showOldPassword ? "text" : "password"}
                  {...register("oldPassword")}
                  className="w-full bg-black border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:ring-1 focus:ring-purple-500 outline-none transition-all placeholder:text-gray-600 tracking-widest pr-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowOldPassword(!showOldPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showOldPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              <p className="text-xs text-gray-500">
                Your new password must be more than 8 characters.
              </p>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-400 uppercase">
                New password
              </label>
              <div className="relative">
                <input
                  id="newPassward"
                  type={showNewPassword ? "text" : "password"}
                  {...register("newPassword")}
                  className="w-full bg-black border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:ring-1 focus:ring-purple-500 outline-none transition-all placeholder:text-gray-600 tracking-widest pr-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showNewPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button className="px-4 py-2 text-gray-400 hover:text-white transition-colors text-sm font-medium">
            Cancel
          </button>
          <button
            type="submit"
            disabled={!isDirty || updatePasswordMutation.isPending}
            className="px-4 py-2 bg-[#2a2a2a] hover:bg-[#3f3f3f] text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
          >
            {updatePasswordMutation.isPending
              ? "Updating..."
              : "Update password"}
          </button>
        </div>
      </form>
    </div>
  );
}
