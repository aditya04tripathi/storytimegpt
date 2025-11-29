import {
	off,
	onValue,
	ref,
	remove,
	set,
	type Unsubscribe,
} from "firebase/database";
import { realtimeDb } from "../firebase";

export function subscribeToStoryStatus(
	jobId: string,
	callback: (status: {
		status: "pending" | "processing" | "completed" | "failed";
		progress: number;
		error?: string;
	}) => void,
): Unsubscribe {
	const statusRef = ref(realtimeDb, `storyJobs/${jobId}/status`);
	const progressRef = ref(realtimeDb, `storyJobs/${jobId}/progress`);
	const errorRef = ref(realtimeDb, `storyJobs/${jobId}/error`);

	const currentStatus: any = {
		status: "pending",
		progress: 0,
	};

	const unsubscribeStatus = onValue(statusRef, (snapshot) => {
		const status = snapshot.val();
		if (status) {
			currentStatus.status = status;
			callback(currentStatus);
		}
	});

	const unsubscribeProgress = onValue(progressRef, (snapshot) => {
		const progress = snapshot.val();
		if (progress !== null && progress !== undefined) {
			currentStatus.progress = progress;
			callback(currentStatus);
		}
	});

	const unsubscribeError = onValue(errorRef, (snapshot) => {
		const error = snapshot.val();
		if (error) {
			currentStatus.error = error;
			callback(currentStatus);
		}
	});

	return () => {
		off(statusRef);
		off(progressRef);
		off(errorRef);
		unsubscribeStatus();
		unsubscribeProgress();
		unsubscribeError();
	};
}

export async function updateStoryStatusRealtime(
	jobId: string,
	status: "pending" | "processing" | "completed" | "failed",
): Promise<void> {
	try {
		const statusRef = ref(realtimeDb, `storyJobs/${jobId}/status`);
		await set(statusRef, status);
	} catch (error: any) {
		throw new Error(error.message || "Failed to update story status");
	}
}

export async function updateStoryProgressRealtime(
	jobId: string,
	progress: number,
): Promise<void> {
	try {
		const progressRef = ref(realtimeDb, `storyJobs/${jobId}/progress`);
		await set(progressRef, Math.max(0, Math.min(100, progress)));
	} catch (error: any) {
		throw new Error(error.message || "Failed to update story progress");
	}
}

export async function setStoryErrorRealtime(
	jobId: string,
	error: string,
): Promise<void> {
	try {
		const errorRef = ref(realtimeDb, `storyJobs/${jobId}/error`);
		await set(errorRef, error);
	} catch (error: any) {
		throw new Error(error.message || "Failed to set story error");
	}
}

export function subscribeToUserNotificationsRealtime(
	userId: string,
	callback: (
		notifications: {
			id: string;
			message: string;
			type: string;
			timestamp: number;
			read: boolean;
		}[],
	) => void,
): Unsubscribe {
	const notificationsRef = ref(realtimeDb, `users/${userId}/notifications`);

	return onValue(notificationsRef, (snapshot) => {
		const data = snapshot.val();
		if (data) {
			const notifications = Object.entries(data).map(
				([id, notification]: [string, any]) => ({
					id,
					message: notification.message || "",
					type: notification.type || "info",
					timestamp: notification.timestamp || Date.now(),
					read: notification.read || false,
				}),
			);
			callback(notifications);
		} else {
			callback([]);
		}
	});
}

export function unsubscribeRealtime(path: string): void {
	const dbRef = ref(realtimeDb, path);
	off(dbRef);
}

export async function deleteStoryJobRealtime(jobId: string): Promise<void> {
	try {
		const jobRef = ref(realtimeDb, `storyJobs/${jobId}`);
		await remove(jobRef);
	} catch (error: any) {
		throw new Error(
			error.message || "Failed to delete story job from Realtime Database",
		);
	}
}
