import { useAuthStore } from "@/state/authStore";
import * as SecureStore from "expo-secure-store";
import api from "@/api/axios";
import { endpoints } from "@/api/endpoints";
import { LoginRequest, RegisterRequest, LoginResponse } from "@/api/types";

export function useAuth() {
	const { setUser } = useAuthStore();

	const login = async (email: string, password: string) => {
		const response = await api.post<LoginResponse>(endpoints.auth.login, {
			email,
			password,
		} as LoginRequest);

		await SecureStore.setItemAsync("accessToken", response.token);
		setUser(response.user);
	};

	const register = async (
		email: string,
		password: string,
		name?: string
	) => {
		const response = await api.post<LoginResponse>(endpoints.auth.register, {
			email,
			password,
			name,
		} as RegisterRequest);

		await SecureStore.setItemAsync("accessToken", response.token);
		setUser(response.user);
	};

	return {
		login,
		register,
	};
}

