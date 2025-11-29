export const FIREBASE_COLLECTIONS = {
	USERS: "users",
	STORIES: "stories",
	STORY_JOBS: "storyJobs",
	SUBSCRIPTIONS: "subscriptions",
} as const;

export const FIREBASE_STORAGE_PATHS = {
	IMAGES: "images",
	AUDIO: "audio",
	VIDEO: "video",
} as const;

export const FIREBASE_REALTIME_PATHS = {
	STORY_JOBS: "storyJobs",
	USER_NOTIFICATIONS: "users",
} as const;

export const FILE_SIZE_LIMITS = {
	IMAGE: 5 * 1024 * 1024,
	AUDIO: 50 * 1024 * 1024,
	VIDEO: 200 * 1024 * 1024,
} as const;

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
		maxStoriesPerMonth: -1,
		maxStoryLength: -1,
		includesAudio: true,
		includesVideo: true,
	},
} as const;

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
		MAX_SIZE: 100 * 1024 * 1024,
		MAX_AGE: 7 * 24 * 60 * 60 * 1000,
	},
	SUBSCRIPTION_TIERS: {
		FREE: "free",
		SILVER: "silver",
		GOLD: "gold",
		PLATINUM: "platinum",
	} as const,
} as const;
