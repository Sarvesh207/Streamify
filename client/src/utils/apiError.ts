import type { AxiosError } from "axios";
import { toast } from "react-toastify";

// Surfaces the server's ApiError message, falling back to a generic one
export const toastApiError = (error: unknown, fallback: string) => {
  const message = (error as AxiosError<{ message?: string }>)?.response?.data?.message;
  toast.error(message || fallback);
};
