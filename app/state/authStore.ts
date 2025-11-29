import type { User as FirebaseUser } from "firebase/auth";
import { create } from "zustand";
import type { User } from "@/api/types";
import { signOutUser } from "@/services/firebase/authService";
import { getUser, setUser } from "@/services/firebase/firestoreService";

type AuthState = {
	user: User | undefined;
	firebaseUser: FirebaseUser | null;
	isAuthenticated: boolean;
	isLoading: boolean;
	setFirebaseUser: (firebaseUser: FirebaseUser | null) => Promise<void>;
	setLoading: (isLoading: boolean) => void;
	logout: () => Promise<void>;
	refreshUser: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set, get) => ({
	user: undefined,
	firebaseUser: null,
	isAuthenticated: false,
	isLoading: true,
	setFirebaseUser: async (firebaseUser) => {
		if (firebaseUser) {
			try {
				let userData = await getUser(firebaseUser.uid);

				if (!userData) {
					await setUser(firebaseUser.uid, {
						id: firebaseUser.uid,
						email: firebaseUser.email || "",
						name: firebaseUser.displayName || undefined,
						subscriptionTier: "free",
					});
					userData = await getUser(firebaseUser.uid);
				}

				set({
					firebaseUser,
					user: userData || undefined,
					isAuthenticated: true,
				});
			} catch (error) {
				console.error("Failed to fetch user data:", error);
				set({
					firebaseUser,
					user: undefined,
					isAuthenticated: false,
				});
			}
		} else {
			set({
				firebaseUser: null,
				user: undefined,
				isAuthenticated: false,
			});
		}
	},
	setLoading: (isLoading) => set({ isLoading }),
	logout: async () => {
		try {
			await signOutUser();
			set({
				firebaseUser: null,
				user: undefined,
				isAuthenticated: false,
			});
		} catch (error) {
			console.error("Failed to sign out:", error);
			set({
				firebaseUser: null,
				user: undefined,
				isAuthenticated: false,
			});
		}
	},
	refreshUser: async () => {
		const { firebaseUser } = get();
		if (firebaseUser) {
			const userData = await getUser(firebaseUser.uid);
			set({ user: userData || undefined, isAuthenticated: !!userData });
		} else {
			set({ user: undefined });
		}
	},
}));
