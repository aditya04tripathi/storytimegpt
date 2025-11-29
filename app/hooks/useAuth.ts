import {
	sendPasswordReset,
	signIn,
	signUp,
	updateUserProfile,
} from "@/services/firebase/authService";
import { setUser } from "@/services/firebase/firestoreService";
import { useAuthStore } from "@/state/authStore";

export function useAuth() {
	const { setFirebaseUser } = useAuthStore();

	const login = async (email: string, password: string) => {
		const firebaseUser = await signIn(email, password);
		await setFirebaseUser(firebaseUser);
	};

	const register = async (email: string, password: string, name?: string) => {
		const firebaseUser = await signUp(email, password, name);
		await updateProfile(name);

		if (firebaseUser) {
			await setUser(firebaseUser.uid, {
				id: firebaseUser.uid,
				email: firebaseUser.email || "",
				name: name || firebaseUser.displayName || undefined,
				subscriptionTier: "free",
			});
		}

		await setFirebaseUser(firebaseUser);
	};

	const resetPassword = async (email: string) => {
		await sendPasswordReset(email);
	};

	const updateProfile = async (name?: string, photoURL?: string) => {
		const { firebaseUser } = useAuthStore.getState();
		if (firebaseUser) {
			await updateUserProfile(firebaseUser, name, photoURL);
			await setFirebaseUser(firebaseUser);
		}
	};

	return {
		login,
		register,
		resetPassword,
		updateProfile,
	};
}
