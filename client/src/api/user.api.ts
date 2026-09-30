import client from "./axiosClient";
import type {
  ApiResponse,
  AuthResponse,
  ChangePasswordData,
  LoginData,
  UpdateAccountData,
  User,
  UserChannelProfile,
  Video,
} from "./types";

const loginUser = async (data: LoginData): Promise<ApiResponse<AuthResponse>> => {
  const res = await client.post("/users/login", data);
  return res.data;
};

const registerUser = async (data: FormData): Promise<ApiResponse<{ user: User }>> => {
  const res = await client.post("/users/register", data);
  return res.data;
};

const getUser = async (): Promise<ApiResponse<User>> => {
  const res = await client.get("/users/current-user");
  return res.data;
};

const logoutUser = async (): Promise<ApiResponse<{}>> => {
  const res = await client.post("/users/logout");
  return res.data;
};

const updateUser = async (data: UpdateAccountData): Promise<ApiResponse<User>> => {
  const res = await client.patch("/users/update-account", data);
  return res.data;
};

const refreshToken = async (): Promise<ApiResponse<AuthResponse>> => {
  const res = await client.post("/users/refresh-token");
  return res.data;
};

const changePassword = async (data: ChangePasswordData): Promise<ApiResponse<{}>> => {
  const res = await client.post("/users/change-password", data);
  return res.data;
};

const forgotPassword = async (data: { email: string }): Promise<ApiResponse<{}>> => {
  const res = await client.post("/users/forgot-password", data);
  return res.data;
};

const avatarUpload = async (file: File): Promise<ApiResponse<User>> => {
  const formData = new FormData();
  formData.append("avatar", file);

  const res = await client.patch("/users/avatar", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

const coverUpload = async (file: File): Promise<ApiResponse<User>> => {
  const formData = new FormData();
  formData.append("coverImage", file);

  const res = await client.patch("/users/cover-image", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

const getHistory = async (): Promise<ApiResponse<Video[]>> => {
  const res = await client.get("/users/history");
  return res.data;
};

const getUserChannelProfile = async (
  username: string
): Promise<ApiResponse<UserChannelProfile>> => {
  const res = await client.get(`/users/c/${username}`);
  return res.data;
};


const getUserChannelData = async (
  username: string
): Promise<UserChannelProfile> => {
  const res = await client.get(`/users/c/${username}`);
  return res.data.data;
};

export {
  loginUser,
  registerUser,
  getUser,
  logoutUser,
  updateUser,
  refreshToken,
  changePassword,
  forgotPassword,
  avatarUpload,
  coverUpload,
  getHistory,
  getUserChannelProfile,
  getUserChannelData,
};
