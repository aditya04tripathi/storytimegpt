import * as SecureStore from "expo-secure-store";
import {
	createUserWithEmailAndPassword,
	type User as FirebaseUser,
	onAuthStateChanged,
	sendPasswordResetEmail,
	signInWithEmailAndPassword,
	signOut,
	type Unsubscribe,
	updateProfile,
} from "firebase/auth";
import { auth } from "../firebase";

export async function signIn(
	email: string,
	password: string,
): Promise<FirebaseUser> {
	try {
		const userCredential = await signInWithEmailAndPassword(
			auth,
			email,
			password,
		);
		const user = userCredential.user;

		const token = await user.getIdToken();
		await SecureStore.setItemAsync("firebaseIdToken", token);

		return user;
	} catch (error: any) {
		throw new Error(error.message || "Failed to sign in");
	}
}

export async function signUp(
	email: string,
	password: string,
	name?: string,
): Promise<FirebaseUser> {
	try {
		const userCredential = await createUserWithEmailAndPassword(
			auth,
			email,
			password,
		);
		const user = userCredential.user;

		if (name) {
			await updateProfile(user, { displayName: name });
		}

		const token = await user.getIdToken();
		await SecureStore.setItemAsync("firebaseIdToken", token);

		return user;
	} catch (error: any) {
		throw new Error(error.message || "Failed to sign up");
	}
}

export async function signOutUser(): Promise<void> {
	try {
		await signOut(auth);
		await SecureStore.deleteItemAsync("firebaseIdToken");
	} catch (error: any) {
		throw new Error(error.message || "Failed to sign out");
	}
}

export async function sendPasswordReset(email: string): Promise<void> {
	try {
		await sendPasswordResetEmail(auth, email);
	} catch (error: any) {
		throw new Error(error.message || "Failed to send password reset email");
	}
}

export async function updateUserProfile(
	user: FirebaseUser,
	name?: string,
	photoURL?: string,
): Promise<void> {
	try {
		const updates: { displayName?: string; photoURL?: string } = {};
		if (name !== undefined) updates.displayName = name;
		if (photoURL !== undefined) updates.photoURL = photoURL;

		await updateProfile(user, updates);
	} catch (error: any) {
		throw new Error(error.message || "Failed to update profile");
	}
}

export function getCurrentUser(): FirebaseUser | null {
	return auth.currentUser;
}

export function onAuthStateChange(
	callback: (user: FirebaseUser | null) => void,
): Unsubscribe {
	return onAuthStateChanged(auth, async (user) => {
		if (user) {
			try {
				const token = await user.getIdToken();
				await SecureStore.setItemAsync("firebaseIdToken", token);
			} catch (error) {
				console.error("Failed to store Firebase token:", error);
			}
		} else {
			try {
				await SecureStore.deleteItemAsync("firebaseIdToken");
			} catch (error) {
				console.error("Failed to clear Firebase token:", error);
			}
		}
		callback(user);
	});
}

export async function getIdToken(forceRefresh = false): Promise<string | null> {
	const user = auth.currentUser;
	if (!user) return null;

	try {
		return await user.getIdToken(forceRefresh);
	} catch (error: any) {
		throw new Error(error.message || "Failed to get ID token");
	}
}
