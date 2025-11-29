export const validators = {
	email: (email: string): boolean => {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	},

	password: (password: string): { valid: boolean; error?: string } => {
		if (password.length < 8) {
			return { valid: false, error: "Password must be at least 8 characters" };
		}
		if (!/[A-Z]/.test(password)) {
			return {
				valid: false,
				error: "Password must contain at least one uppercase letter",
			};
		}
		if (!/[a-z]/.test(password)) {
			return {
				valid: false,
				error: "Password must contain at least one lowercase letter",
			};
		}
		if (!/[0-9]/.test(password)) {
			return {
				valid: false,
				error: "Password must contain at least one number",
			};
		}
		return { valid: true };
	},

	required: (value: string): boolean => {
		return value.trim().length > 0;
	},

	// Firebase-specific validators
	storyPrompt: (prompt: string): boolean => {
		const trimmed = prompt.trim();
		return trimmed.length >= 10 && trimmed.length <= 500;
	},

	storyTitle: (title: string): boolean => {
		const trimmed = title.trim();
		return trimmed.length >= 1 && trimmed.length <= 100;
	},

	fileSize: (size: number, type: "image" | "audio" | "video"): boolean => {
		const limits = {
			image: 5 * 1024 * 1024, // 5MB
			audio: 50 * 1024 * 1024, // 50MB
			video: 200 * 1024 * 1024, // 200MB
		};
		return size <= limits[type];
	},

	mimeType: (mimeType: string, type: "image" | "audio" | "video"): boolean => {
		const validTypes = {
			image: ["image/jpeg", "image/png", "image/webp"],
			audio: ["audio/mpeg", "audio/mp3", "audio/wav", "audio/ogg"],
			video: ["video/mp4", "video/webm", "video/ogg"],
		};
		return validTypes[type].includes(mimeType);
	},

	subscriptionTier: (
		tier: string,
	): tier is "free" | "silver" | "gold" | "platinum" => {
		return ["free", "silver", "gold", "platinum"].includes(tier);
	},

	storyStatus: (
		status: string,
	): status is "pending" | "processing" | "completed" | "failed" => {
		return ["pending", "processing", "completed", "failed"].includes(status);
	},

	userId: (userId: string): boolean => {
		// Firebase UIDs are typically 28 characters alphanumeric
		return /^[a-zA-Z0-9]{20,}$/.test(userId);
	},
};
