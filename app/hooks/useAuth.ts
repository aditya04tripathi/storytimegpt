import { serverTimestamp } from "firebase/firestore";
import { sha256 } from "react-native-sha256";
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
		await setUser(firebaseUser.uid, {
			lastLoginAt: serverTimestamp(),
		});
		await setFirebaseUser(firebaseUser);
	};

	const register = async (email: string, password: string, name?: string) => {
		const firebaseUser = await signUp(email, password, name);
		const emailHash = await sha256(email);
		const photoURL = `https://gravatar.com/avatar/${emailHash}?d=identicon`;

		await updateProfile(name, photoURL);
		if (firebaseUser) {
			await setUser(firebaseUser.uid, {
				id: firebaseUser.uid,
				email: firebaseUser.email || "",
				name: name || firebaseUser.displayName || undefined,
				subscriptionTier: "free",
				photoURL: photoURL,
				ageGroup: "child",
				languageProficiency: "advanced",
				favoriteGenres: [],
				createdAt: serverTimestamp(),
				lastLoginAt: serverTimestamp(),
				updatedAt: serverTimestamp(),
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
