import { Link } from "react-router-dom";
import { Video, Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { loginUser } from "../api/user.api";
import { setAccessToken } from "../api/axiosClient";
import { useMutation } from "@tanstack/react-query";
import { Bounce, toast } from "react-toastify";

import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addUser } from "../store/slices/userSlice";

type LoginFormData = {
  identifier: string;
  password: string;
};

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const [showPassword, setShowPassword] = useState(false);

  const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      dispatch(addUser(data?.data?.user));
      if (data?.data?.accessToken) {
        setAccessToken(data.data.accessToken);
      }
      navigate("/");
      toast.success("Login successful", {
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
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Login failed", {
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

  const onSubmit = (data: LoginFormData) => {
    const identifier = data.identifier.trim();

    const payload = isEmail(identifier)
      ? { email: identifier, password: data.password }
      : { username: identifier, password: data.password };

    loginMutation.mutate(payload);
  };

  return (
    <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0 bg-gray-50 dark:bg-gray-900">
      <Link
        to="/"
        className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
      >
        <div className="bg-white text-black p-1 rounded-lg mr-2">
          <Video size={24} fill="currentColor" />
        </div>
        VStream
      </Link>
      <div className="w-full bg-black rounded-xl shadow border border-white/5 md:mt-0 sm:max-w-md xl:p-0">
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 className="text-xl font-bold leading-tight tracking-tight text-white md:text-2xl">
            Sign in to your account
          </h1>
          <form
            className="space-y-4 md:space-y-6"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div>
              <label
                htmlFor="username"
                className="block mb-2 text-sm font-medium text-gray-300"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                className="bg-[#1a1a1a] border border-gray-800 text-white sm:text-sm rounded-lg focus:ring-1 focus:ring-white/20 focus:border-white/20 block w-full p-2.5 placeholder-gray-500"
                placeholder="Username or Email"
                {...register("identifier", {
                  required: "Username or email is required",
                  minLength: {
                    value: 3,
                    message: "Must be at least 3 characters",
                  },
                })}
              />
              {errors.identifier && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.identifier.message}
                </p>
              )}
            </div>
            <div className="relative">
              <label
                htmlFor="password"
                className="block mb-2 text-sm font-medium text-gray-300"
              >
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="••••••••"
                className="bg-[#1a1a1a] border border-gray-800 text-white sm:text-sm rounded-lg focus:ring-1 focus:ring-white/20 focus:border-white/20 block w-full p-2.5 placeholder-gray-500 pr-10"
                {...register("password", { required: "Password is required" })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 pt-7 text-gray-400 hover:text-white"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full text-white bg-[#2a2a2a] hover:bg-[#3f3f3f] font-semibold rounded-xl text-sm px-5 py-3 text-center transition-all shadow-lg shadow-black/20"
            >
              Sign in
            </button>
            <p className="text-sm font-light text-gray-500 dark:text-gray-400">
              Don’t have an account yet?{" "}
              <Link
                to="/register"
                className="font-medium text-white hover:underline decoration-white/20 hover:decoration-white"
              >
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
