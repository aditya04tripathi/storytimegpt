import { create } from "zustand";
import * as SecureStore from "expo-secure-store";
import { User } from "@/api/types";

type AuthState = {
	user: User | undefined;
	isAuthenticated: boolean;
	setUser: (user: User | undefined) => void;
	logout: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
	user: undefined,
	isAuthenticated: false,
	setUser: (user) =>
		set({
			user,
			isAuthenticated: !!user,
		}),
	logout: async () => {
		await SecureStore.deleteItemAsync("accessToken");
		await SecureStore.deleteItemAsync("refreshToken");
		set({ user: undefined, isAuthenticated: false });
	},
}));

