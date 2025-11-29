import { useCallback } from "react";
import api from "@/api/axios";
import { useAuthStore } from "@/state/authStore";

export function useAxiosAuth() {
	const { logout } = useAuthStore();

	const authenticatedRequest = useCallback(
		async <T>(
			method: "get" | "post" | "put" | "delete",
			url: string,
			data?: any
		): Promise<T> => {
			try {
				const response = await api[method](url, data);
				return response;
			} catch (error: any) {
				if (error.response?.status === 401) {
					await logout();
				}
				throw error;
			}
		},
		[logout]
	);

	return { authenticatedRequest };
}

