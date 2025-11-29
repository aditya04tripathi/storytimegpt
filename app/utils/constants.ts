export const constants = {
	API_BASE_URL:
		process.env.EXPO_PUBLIC_API_BASE_URL || "https://api.example.com",
	STORAGE_KEYS: {
		ACCESS_TOKEN: "accessToken",
		REFRESH_TOKEN: "refreshToken",
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

