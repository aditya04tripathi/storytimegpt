import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { ApiResponse } from "./types";

const BASE_URL =
	process.env.EXPO_PUBLIC_API_BASE_URL || "https://api.example.com";

const api = axios.create({
	baseURL: BASE_URL,
	timeout: 30000,
	headers: {
		"Content-Type": "application/json",
	},
});

api.interceptors.request.use(
	async (config) => {
		const token = await SecureStore.getItemAsync("accessToken");
		if (token && config.headers) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

let isRefreshing = false;
let failedQueue: (() => void)[] = [];

api.interceptors.response.use(
	(response) => {
		const body = response.data as ApiResponse<any>;
		if (body && typeof body.success === "boolean") {
			if (!body.success) {
				return Promise.reject(new Error(body.error || "Unknown error"));
			}
			return body.data;
		}
		return response.data;
	},
	async (error) => {
		const originalRequest = error.config;

		if (error.response?.status === 401 && !originalRequest._retry) {
			if (isRefreshing) {
				return new Promise((resolve) => {
					failedQueue.push(() => {
						resolve(api(originalRequest));
					});
				});
			}

			originalRequest._retry = true;
			isRefreshing = true;

			try {
				const refreshToken = await SecureStore.getItemAsync("refreshToken");
				if (!refreshToken) {
					throw new Error("No refresh token");
				}

				const response = await axios.post(`${BASE_URL}/auth/refresh`, {
					token: refreshToken,
				});

				const { token } = response.data;
				await SecureStore.setItemAsync("accessToken", token);

				failedQueue.forEach((cb) => cb());
				failedQueue = [];
				isRefreshing = false;

				originalRequest.headers["Authorization"] = `Bearer ${token}`;
				return api(originalRequest);
			} catch (refreshError) {
				isRefreshing = false;
				await SecureStore.deleteItemAsync("accessToken");
				await SecureStore.deleteItemAsync("refreshToken");
				return Promise.reject(refreshError);
			}
		}

		const message =
			error?.response?.data?.error || error.message || "Network error";
		return Promise.reject(new Error(message));
	}
);

export default api;

