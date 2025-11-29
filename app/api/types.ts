import type { FieldValue } from "firebase/firestore";

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
	ageGroup: "child" | "teen" | "adult" | "senior";
	languageProficiency: "beginner" | "intermediate" | "advanced" | "native";
	favoriteGenres: string[];
	photoURL?: string;
	lastLoginAt: FieldValue;
	createdAt: FieldValue;
	updatedAt: FieldValue;
};

export type Media = {
	url: string;
	type: "image" | "audio" | "video";
};

export type StorySummary = {
	id: string;
	title: string;
	thumbnail?: string;
	createdAt: FieldValue;
	status: "pending" | "processing" | "completed" | "failed";
};

export type Story = {
	id: string;
	title: string;
	settingPlace: string;
	protagonistName: string;
	text: string;
	images: Media[];
	audio?: Media;
	videos?: Media[];
	createdAt: FieldValue;
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
	title?: string;
	prompt: string;
	protagonist_name: string;
	age_group: "child" | "teen" | "adult" | "senior";
	language_proficiency: "beginner" | "intermediate" | "advanced" | "native";
	story_length: "short" | "medium" | "long";
	genre?: string;
	tone?: string;
	setting?: string;
};

export type StoryGenerateResponse = {
	message: string | undefined;
	okay: boolean;
	protagonist_name: string;
	title: string;
	story: string;
	setting_place: string;
	error?: string;
};
