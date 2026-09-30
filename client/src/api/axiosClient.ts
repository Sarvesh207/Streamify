import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { API_BASE_URL } from "../config";

let _accessToken: string | null = null;


console.log("API_BASE_URL", API_BASE_URL, import.meta.env.VITE_API_BASE_URL);
export const setAccessToken = (token: string | null) => {
    _accessToken = token;
};

export const getAccessToken = () => _accessToken;

const client = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
});

type FailedQueueItem = {
    resolve: (token: string | null) => void;
    reject: (error: any) => void;
};

let isRefreshing = false;
let failedQueue: FailedQueueItem[] = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });

    failedQueue = [];
};

client.interceptors.request.use(
    (config) => {
        if (_accessToken) {
            config.headers.Authorization = `Bearer ${_accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

client.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        if (!originalRequest) {
            return Promise.reject(error);
        }

        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            !originalRequest.url?.includes("/users/refresh-token") &&
            !originalRequest.url?.includes("/users/login")
        ) {
            if (isRefreshing) {
                return new Promise<string | null>((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        if (token) {
                            originalRequest.headers.Authorization = `Bearer ${token}`;
                        }
                        return client(originalRequest);
                    })
                    .catch((err) => {
                        return Promise.reject(err);
                    });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const response = await axios.post(
                    `${API_BASE_URL}/users/refresh-token`,
                    {},
                    { withCredentials: true }
                );

                const newAccessToken = response.data?.data?.accessToken;

                if (!newAccessToken) {
                    throw new Error("No access token in refresh response");
                }

                setAccessToken(newAccessToken);
                processQueue(null, newAccessToken);

                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return client(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);
                setAccessToken(null);
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default client;