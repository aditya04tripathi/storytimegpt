// Firebase Collection names
export const FIREBASE_COLLECTIONS = {
	USERS: "users",
	STORIES: "stories",
	STORY_JOBS: "storyJobs",
	SUBSCRIPTIONS: "subscriptions",
} as const;

// Firebase Storage bucket paths
export const FIREBASE_STORAGE_PATHS = {
	IMAGES: "images",
	AUDIO: "audio",
	VIDEO: "video",
} as const;

// Firebase Realtime Database paths
export const FIREBASE_REALTIME_PATHS = {
	STORY_JOBS: "storyJobs",
	USER_NOTIFICATIONS: "users",
} as const;

// File size limits (in bytes)
export const FILE_SIZE_LIMITS = {
	IMAGE: 5 * 1024 * 1024, // 5MB
	AUDIO: 50 * 1024 * 1024, // 50MB
	VIDEO: 200 * 1024 * 1024, // 200MB
} as const;

// Story generation limits by subscription tier
export const STORY_LIMITS = {
	free: {
		maxStoriesPerMonth: 3,
		maxStoryLength: 500,
		includesAudio: false,
		includesVideo: false,
	},
	silver: {
		maxStoriesPerMonth: 10,
		maxStoryLength: 1000,
		includesAudio: true,
		includesVideo: false,
	},
	gold: {
		maxStoriesPerMonth: 50,
		maxStoryLength: 2000,
		includesAudio: true,
		includesVideo: true,
	},
	platinum: {
		maxStoriesPerMonth: -1, // Unlimited
		maxStoryLength: -1, // Unlimited
		includesAudio: true,
		includesVideo: true,
	},
} as const;

// Story status values
export const STORY_STATUS = {
	PENDING: "pending",
	PROCESSING: "processing",
	COMPLETED: "completed",
	FAILED: "failed",
} as const;

export const constants = {
	API_BASE_URL:
		process.env.EXPO_PUBLIC_API_BASE_URL || "https://api.example.com",
	STORAGE_KEYS: {
		ACCESS_TOKEN: "accessToken",
		REFRESH_TOKEN: "refreshToken",
		FIREBASE_ID_TOKEN: "firebaseIdToken",
		USER: "user",
	},
	POLLING: {
		INITIAL_DELAY: 2000,
		MAX_DELAY: 10000,
		BACKOFF_MULTIPLIER: 1.5,
	},
	CACHE: {
		MAX_SIZE: 100 * 1024 * 1024, // 100MB
		MAX_AGE: 7 * 24 * 60 * 60 * 1000, // 7 days
	},
	SUBSCRIPTION_TIERS: {
		FREE: "free",
		SILVER: "silver",
		GOLD: "gold",
		PLATINUM: "platinum",
	} as const,
} as const;
