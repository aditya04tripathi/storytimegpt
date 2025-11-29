export type ApiResponse<T> = {
	success: boolean;
	error?: string;
	data?: T;
};

export type User = {
	id: string;
	email: string;
	name?: string;
	subscriptionTier: "free" | "silver" | "gold" | "platinum";
};

export type Media = {
	url: string;
	type: "image" | "audio" | "video";
};

export type StorySummary = {
	id: string;
	title: string;
	thumbnail?: string;
	createdAt: string;
	status: "pending" | "processing" | "completed" | "failed";
};

export type Story = {
	id: string;
	title: string;
	text: string;
	images: Media[];
	audio?: Media;
	videos?: Media[];
	createdAt: string;
	status: "pending" | "processing" | "completed" | "failed";
};

export type LoginRequest = {
	email: string;
	password: string;
};

export type RegisterRequest = {
	email: string;
	password: string;
	name?: string;
};

export type LoginResponse = {
	token: string;
	user: User;
};

export type StoryGenerateRequest = {
	prompt: string;
	title?: string;
};

export type StoryGenerateResponse = {
	jobId: string;
	storyId: string;
};

