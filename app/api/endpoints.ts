const API_BASE_URL =
	process.env.EXPO_PUBLIC_API_BASE_URL || "https://api.example.com";

export const endpoints = {
	auth: {
		login: `${API_BASE_URL}/auth/login`,
		register: `${API_BASE_URL}/auth/register`,
		refresh: `${API_BASE_URL}/auth/refresh`,
		logout: `${API_BASE_URL}/auth/logout`,
	},
	story: {
		generate: `${API_BASE_URL}/story/generate`,
		getById: (id: string) => `${API_BASE_URL}/story/${id}`,
		getStatus: (id: string) => `${API_BASE_URL}/story/status/${id}`,
		list: `${API_BASE_URL}/story`,
	},
	user: {
		profile: `${API_BASE_URL}/user/profile`,
		update: `${API_BASE_URL}/user/profile`,
	},
	subscription: {
		tiers: `${API_BASE_URL}/subscription/tiers`,
		upgrade: `${API_BASE_URL}/subscription/upgrade`,
	},
} as const;

