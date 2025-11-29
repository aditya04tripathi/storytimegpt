import type { User as FirebaseUser } from "firebase/auth";
import { useEffect, useState } from "react";
import { onAuthStateChange } from "@/services/firebase/authService";
import { useAuthStore } from "@/state/authStore";

export function useAuthState() {
	const { setFirebaseUser, setLoading, isLoading } = useAuthStore();
	const [isInitializing, setIsInitializing] = useState(true);

	useEffect(() => {
		const unsubscribe = onAuthStateChange(
			async (firebaseUser: FirebaseUser | null) => {
				await setFirebaseUser(firebaseUser);
				setIsInitializing(false);
				setLoading(false);
			},
		);

		return () => {
			unsubscribe();
		};
	}, [setFirebaseUser, setLoading]);

	return {
		isLoading: isLoading || isInitializing,
	};
}

export function useIsSignedIn() {
	const { isAuthenticated } = useAuthStore();
	return isAuthenticated;
}

export function useIsSignedOut() {
	const { isAuthenticated } = useAuthStore();
	return !isAuthenticated;
}
