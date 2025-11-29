import type { User as FirebaseUser } from "firebase/auth";
import { useEffect, useState } from "react";
import { onAuthStateChange } from "@/services/firebase/authService";
import { useAuthStore } from "@/state/authStore";

/**
 * Hook to monitor Firebase Auth state changes
 * Follows the React Navigation auth flow pattern
 */
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

/**
 * Hook to check if user is signed in
 * Used for conditional screen rendering
 */
export function useIsSignedIn() {
	const { isAuthenticated } = useAuthStore();
	return isAuthenticated;
}

/**
 * Hook to check if user is signed out
 * Used for conditional screen rendering
 */
export function useIsSignedOut() {
	const { isAuthenticated } = useAuthStore();
	return !isAuthenticated;
}
