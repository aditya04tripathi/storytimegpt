import type { Timestamp } from "firebase/firestore";

export const formatters = {
	date: (date: string | Date): string => {
		const d = typeof date === "string" ? new Date(date) : date;
		return d.toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	},

	timeAgo: (date: string | Date): string => {
		const d = typeof date === "string" ? new Date(date) : date;
		const now = new Date();
		const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000);

		if (diffInSeconds < 60) {
			return "just now";
		}

		const diffInMinutes = Math.floor(diffInSeconds / 60);
		if (diffInMinutes < 60) {
			return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`;
		}

		const diffInHours = Math.floor(diffInMinutes / 60);
		if (diffInHours < 24) {
			return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
		}

		const diffInDays = Math.floor(diffInHours / 24);
		if (diffInDays < 30) {
			return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
		}

		return formatters.date(d);
	},

	currency: (amount: number, currency: string = "USD"): string => {
		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency,
		}).format(amount);
	},

	firestoreTimestamp: (timestamp: Timestamp | Date | string): string => {
		if (typeof timestamp === "string") {
			return timestamp;
		}
		if (timestamp instanceof Date) {
			return timestamp.toISOString();
		}
		if (timestamp && typeof timestamp === "object" && "toDate" in timestamp) {
			return timestamp.toDate().toISOString();
		}
		return new Date().toISOString();
	},

	fileSize: (bytes: number): string => {
		if (bytes === 0) return "0 Bytes";
		const k = 1024;
		const sizes = ["Bytes", "KB", "MB", "GB"];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return Math.round((bytes / k ** i) * 100) / 100 + " " + sizes[i];
	},

	duration: (seconds: number): string => {
		const hours = Math.floor(seconds / 3600);
		const minutes = Math.floor((seconds % 3600) / 60);
		const secs = Math.floor(seconds % 60);

		if (hours > 0) {
			return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
		}
		return `${minutes}:${secs.toString().padStart(2, "0")}`;
	},

	subscriptionTier: (tier: "free" | "silver" | "gold" | "platinum"): string => {
		const tierNames = {
			free: "Free",
			silver: "Silver",
			gold: "Gold",
			platinum: "Platinum",
		};
		return tierNames[tier];
	},

	storyStatus: (
		status: "pending" | "processing" | "completed" | "failed",
	): string => {
		const statusNames = {
			pending: "Pending",
			processing: "Processing",
			completed: "Completed",
			failed: "Failed",
		};
		return statusNames[status];
	},

	truncate: (text: string, maxLength: number): string => {
		if (text.length <= maxLength) return text;
		return text.substring(0, maxLength - 3) + "...";
	},

	errorMessage: (error: unknown): string => {
		if (error instanceof Error) {
			return error.message;
		}
		if (typeof error === "string") {
			return error;
		}
		return "An unexpected error occurred";
	},
};
