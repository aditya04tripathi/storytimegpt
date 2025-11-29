import type { Timestamp } from "firebase/firestore";

export interface UserDocument {
	id: string;
	email: string;
	name?: string;
	subscriptionTier: "free" | "silver" | "gold" | "platinum";
	createdAt: Timestamp;
	updatedAt: Timestamp;
}

export interface StoryDocument {
	id: string;
	userId: string;
	title: string;
	text: string;
	images: string[];
	audio?: string;
	videos?: string[];
	status: "pending" | "processing" | "completed" | "failed";
	createdAt: Timestamp;
	updatedAt: Timestamp;
}

export interface StoryJobDocument {
	id: string;
	userId: string;
	storyId: string;
	prompt: string;
	title?: string;
	status: "pending" | "processing" | "completed" | "failed";
	progress: number;
	error?: string;
	createdAt: Timestamp;
	updatedAt: Timestamp;
}

export interface SubscriptionTierDocument {
	id: string;
	name: "free" | "silver" | "gold" | "platinum";
	displayName: string;
	description: string;
	price: number;
	features: string[];
	maxStoriesPerMonth?: number;
	maxStoryLength?: number;
	includesAudio: boolean;
	includesVideo: boolean;
	createdAt: Timestamp;
	updatedAt: Timestamp;
}

export interface StorageMetadata {
	size: number;
	contentType: string;
	timeCreated: string;
	updated: string;
	customMetadata?: Record<string, string>;
}

export interface ImageMetadata extends StorageMetadata {
	width?: number;
	height?: number;
}

export interface AudioMetadata extends StorageMetadata {
	duration?: number;
	bitrate?: number;
}

export interface VideoMetadata extends StorageMetadata {
	duration?: number;
	width?: number;
	height?: number;
	bitrate?: number;
}

export type StoragePath =
	| `images/${string}/${string}`
	| `audio/${string}/${string}`
	| `video/${string}/${string}`;
