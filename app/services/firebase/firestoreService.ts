import { ref, set } from "firebase/database";
import {
	collection,
	deleteDoc,
	doc,
	getDoc,
	getDocs,
	orderBy,
	query,
	serverTimestamp,
	setDoc,
	Timestamp,
	updateDoc,
	where,
} from "firebase/firestore";
import type { Story, StorySummary, User } from "@/api/types";
import { logError } from "@/services/errorLogger";
import { db, realtimeDb } from "../firebase";

const COLLECTIONS = {
	USERS: "users",
	STORIES: "stories",
	STORY_JOBS: "storyJobs",
} as const;

export async function getUser(userId: string): Promise<User | null> {
	try {
		const userDoc = await getDoc(doc(db, COLLECTIONS.USERS, userId));
		if (!userDoc.exists()) {
			return null;
		}

		const data = userDoc.data();
		return {
			id: userDoc.id,
			email: data.email,
			name: data.name,
			subscriptionTier: data.subscriptionTier || "free",
			photoURL: data.photoURL,
			ageGroup: data.ageGroup || "child",
			languageProficiency: data.languageProficiency || "beginner",
			favoriteGenres: data.favoriteGenres || [],
			lastLoginAt: data.lastLoginAt,
			createdAt: data.createdAt,
			updatedAt: data.updatedAt,
		} as User;
	} catch (error: any) {
		throw new Error(error.message || "Failed to get user");
	}
}

export async function setUser(
	userId: string,
	userData: Partial<User>,
): Promise<void> {
	try {
		const userRef = doc(db, COLLECTIONS.USERS, userId);
		await setDoc(
			userRef,
			{
				...userData,
				updatedAt: serverTimestamp(),
			},
			{ merge: true },
		);
	} catch (error: any) {
		throw new Error(error.message || "Failed to set user");
	}
}

export async function updateUser(
	userId: string,
	updates: Partial<User>,
): Promise<void> {
	try {
		const userRef = doc(db, COLLECTIONS.USERS, userId);
		await updateDoc(userRef, {
			...updates,
			updatedAt: Timestamp.now(),
		});
	} catch (error: any) {
		throw new Error(error.message || "Failed to update user");
	}
}

export async function updateSubscriptionTier(
	userId: string,
	tier: "free" | "silver" | "gold" | "platinum",
): Promise<void> {
	try {
		await updateUser(userId, { subscriptionTier: tier });
	} catch (error: any) {
		throw new Error(error.message || "Failed to update subscription tier");
	}
}

export async function createStory(
	userId: string,
	storyData: {
		title: string;
		text?: string;
		images?: string[];
		audio?: string;
		videos?: string[];
		status?: "pending" | "processing" | "completed" | "failed";
	},
): Promise<string> {
	try {
		const storiesRef = collection(db, COLLECTIONS.STORIES);
		const storyRef = doc(storiesRef);
		const storyId = storyRef.id;

		await setDoc(storyRef, {
			userId,
			title: storyData.title,
			text: storyData.text || "",
			images: storyData.images || [],
			audio: storyData.audio || null,
			videos: storyData.videos || [],
			status: storyData.status || "pending",
			createdAt: Timestamp.now(),
			updatedAt: Timestamp.now(),
		});

		const userRef = doc(db, COLLECTIONS.USERS, userId);
		const userDoc = await getDoc(userRef);
		const userData = userDoc.data();
		const storyIds = userData?.storyIds || [];

		if (!storyIds.includes(storyId)) {
			await updateDoc(userRef, {
				storyIds: [...storyIds, storyId],
				updatedAt: Timestamp.now(),
			});
		}

		return storyId;
	} catch (error: any) {
		throw new Error(error.message || "Failed to create story");
	}
}

export async function getStory(storyId: string): Promise<Story | null> {
	try {
		const storyDoc = await getDoc(doc(db, COLLECTIONS.STORIES, storyId));
		if (!storyDoc.exists()) {
			return null;
		}

		const data = storyDoc.data();
		return {
			id: storyDoc.id,
			title: data.title,
			text: data.text,
			images: (data.images || []).map((url: string) => ({
				url,
				type: "image" as const,
			})),
			audio: data.audio
				? {
						url: data.audio,
						type: "audio" as const,
					}
				: undefined,
			videos: (data.videos || []).map((url: string) => ({
				url,
				type: "video" as const,
			})),
			createdAt:
				data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
			status: data.status || "pending",
			settingPlace: data.settingPlace || "",
			protagonistName: data.protagonistName || "",
		} as Story;
	} catch (error: any) {
		throw new Error(error.message || "Failed to get story");
	}
}

export async function getUserStories(userId: string): Promise<StorySummary[]> {
	try {
		const storiesRef = collection(db, COLLECTIONS.STORIES);
		const q = query(
			storiesRef,
			where("userId", "==", userId),
			orderBy("createdAt", "desc"),
		);

		const querySnapshot = await getDocs(q);
		return querySnapshot.docs.map((doc) => {
			const data = doc.data();
			return {
				id: doc.id,
				title: data.title,
				thumbnail: data.images?.[0] || undefined,
				createdAt:
					data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
				status: data.status || "pending",
			} as StorySummary;
		});
	} catch (error: any) {
		throw new Error(error.message || "Failed to get user stories");
	}
}

export async function updateStory(
	storyId: string,
	updates: Partial<Story>,
): Promise<void> {
	try {
		const storyRef = doc(db, COLLECTIONS.STORIES, storyId);
		const storyDoc = await getDoc(storyRef);

		if (!storyDoc.exists()) {
			await logError(
				new Error(`Story ${storyId} does not exist, skipping update`),
				"low",
				{
					action: "update_story",
					metadata: { storyId },
				},
			);
			return;
		}

		const firestoreUpdates: any = {
			updatedAt: Timestamp.now(),
		};

		if (updates.title !== undefined) firestoreUpdates.title = updates.title;
		if (updates.text !== undefined) firestoreUpdates.text = updates.text;
		if (updates.status !== undefined) firestoreUpdates.status = updates.status;
		if (updates.images !== undefined)
			firestoreUpdates.images = updates.images.map((img) => img.url);
		if (updates.audio !== undefined)
			firestoreUpdates.audio = updates.audio?.url || null;
		if (updates.videos !== undefined)
			firestoreUpdates.videos = updates.videos.map((vid) => vid.url);

		await updateDoc(storyRef, firestoreUpdates);
	} catch (error: any) {
		if (error.message?.includes("No document to update")) {
			await logError(
				new Error(`Story ${storyId} does not exist, skipping update`),
				"low",
				{
					action: "update_story",
					metadata: { storyId },
				},
			);
			return;
		}
		await logError(error, "high", {
			action: "update_story",
			metadata: { storyId },
		});
		throw new Error(error.message || "Failed to update story");
	}
}

export async function updateStoryStatus(
	storyId: string,
	status: "pending" | "processing" | "completed" | "failed",
): Promise<void> {
	try {
		await updateStory(storyId, { status });
	} catch (error: any) {
		if (error.message?.includes("does not exist")) {
			await logError(
				new Error(`Story ${storyId} does not exist, skipping status update`),
				"low",
				{
					action: "update_story_status",
					metadata: { storyId, status },
				},
			);
			return;
		}
		await logError(error, "high", {
			action: "update_story_status",
			metadata: { storyId, status },
		});
		throw new Error(error.message || "Failed to update story status");
	}
}

export async function deleteStory(storyId: string): Promise<void> {
	try {
		await deleteDoc(doc(db, COLLECTIONS.STORIES, storyId));
	} catch (error: any) {
		throw new Error(error.message || "Failed to delete story");
	}
}

export async function removeStoryFromUser(
	userId: string,
	storyId: string,
): Promise<void> {
	try {
		const userRef = doc(db, COLLECTIONS.USERS, userId);
		const userDoc = await getDoc(userRef);
		const userData = userDoc.data();
		const storyIds = userData?.storyIds || [];

		if (storyIds.includes(storyId)) {
			await updateDoc(userRef, {
				storyIds: storyIds.filter((id: string) => id !== storyId),
				updatedAt: Timestamp.now(),
			});
		}
	} catch (error: any) {
		throw new Error(error.message || "Failed to remove story from user");
	}
}

export async function deleteStoryJob(jobId: string): Promise<void> {
	try {
		await deleteDoc(doc(db, COLLECTIONS.STORY_JOBS, jobId));
	} catch (error: any) {
		throw new Error(error.message || "Failed to delete story job");
	}
}

export async function cleanupFailedStoryGeneration(
	userId: string,
	storyId: string,
	jobId: string,
): Promise<void> {
	try {
		await Promise.all([
			deleteStory(storyId),
			removeStoryFromUser(userId, storyId),
			deleteStoryJob(jobId),
		]);
	} catch (error: any) {
		await logError(error, "critical", {
			action: "cleanup_failed_story_generation",
			metadata: { userId, storyId, jobId },
			userId,
		}, userId);
		throw new Error(
			error.message || "Failed to cleanup failed story generation",
		);
	}
}

export async function createStoryJob(
	userId: string,
	prompt: string,
	title?: string,
): Promise<{ jobId: string; storyId: string }> {
	try {
		const storyId = await createStory(userId, {
			title: title || "Untitled Story",
			status: "pending",
		});

		const jobsRef = collection(db, COLLECTIONS.STORY_JOBS);
		const jobRef = doc(jobsRef);

		await setDoc(jobRef, {
			userId,
			storyId,
			prompt,
			title: title || "Untitled Story",
			status: "pending",
			progress: 0,
			createdAt: Timestamp.now(),
			updatedAt: Timestamp.now(),
		});

		const jobId = jobRef.id;

		const statusRef = ref(realtimeDb, `storyJobs/${jobId}/status`);
		const progressRef = ref(realtimeDb, `storyJobs/${jobId}/progress`);
		const userIdRef = ref(realtimeDb, `storyJobs/${jobId}/userId`);

		await Promise.all([
			set(statusRef, "pending"),
			set(progressRef, 0),
			set(userIdRef, userId),
		]);

		return {
			jobId,
			storyId,
		};
	} catch (error: any) {
		throw new Error(error.message || "Failed to create story job");
	}
}

export async function getStoryJob(jobId: string): Promise<{
	id: string;
	userId: string;
	storyId: string;
	prompt: string;
	title?: string;
	status: "pending" | "processing" | "completed" | "failed";
	progress: number;
	error?: string;
	createdAt: string;
	updatedAt: string;
} | null> {
	try {
		const jobDoc = await getDoc(doc(db, COLLECTIONS.STORY_JOBS, jobId));
		if (!jobDoc.exists()) {
			return null;
		}

		const data = jobDoc.data();
		return {
			id: jobDoc.id,
			userId: data.userId,
			storyId: data.storyId,
			prompt: data.prompt,
			title: data.title,
			status: data.status || "pending",
			progress: data.progress || 0,
			error: data.error,
			createdAt:
				data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
			updatedAt:
				data.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
		};
	} catch (error: any) {
		throw new Error(error.message || "Failed to get story job");
	}
}

export async function updateStoryJob(
	jobId: string,
	updates: {
		status?: "pending" | "processing" | "completed" | "failed";
		progress?: number;
		error?: string;
	},
): Promise<void> {
	try {
		const jobRef = doc(db, COLLECTIONS.STORY_JOBS, jobId);
		await updateDoc(jobRef, {
			...updates,
			updatedAt: Timestamp.now(),
		});
	} catch (error: any) {
		throw new Error(error.message || "Failed to update story job");
	}
}
