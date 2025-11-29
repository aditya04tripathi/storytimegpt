import { Timestamp } from "firebase/firestore";

/**
 * User document structure in Firestore
 */
export interface UserDocument {
	id: string;
	email: string;
	name?: string;
	subscriptionTier: "free" | "silver" | "gold" | "platinum";
	createdAt: Timestamp;
	updatedAt: Timestamp;
}

/**
 * Story document structure in Firestore
 */
export interface StoryDocument {
	id: string;
	userId: string;
	title: string;
	text: string;
	images: string[]; // Storage paths
	audio?: string; // Storage path
	videos?: string[]; // Storage paths
	status: "pending" | "processing" | "completed" | "failed";
	createdAt: Timestamp;
	updatedAt: Timestamp;
}

/**
 * Story job document structure in Firestore
 */
export interface StoryJobDocument {
	id: string;
	userId: string;
	storyId: string;
	prompt: string;
	title?: string;
	status: "pending" | "processing" | "completed" | "failed";
	progress: number; // 0-100
	error?: string;
	createdAt: Timestamp;
	updatedAt: Timestamp;
}

/**
 * Subscription tier document structure in Firestore
 */
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

/**
 * Storage metadata for uploaded files
 */
export interface StorageMetadata {
	size: number;
	contentType: string;
	timeCreated: string;
	updated: string;
	customMetadata?: Record<string, string>;
}

/**
 * Image file metadata
 */
export interface ImageMetadata extends StorageMetadata {
	width?: number;
	height?: number;
}

/**
 * Audio file metadata
 */
export interface AudioMetadata extends StorageMetadata {
	duration?: number; // Duration in seconds
	bitrate?: number;
}

/**
 * Video file metadata
 */
export interface VideoMetadata extends StorageMetadata {
	duration?: number; // Duration in seconds
	width?: number;
	height?: number;
	bitrate?: number;
}

/**
 * Storage path structure
 */
export type StoragePath =
	| `images/${string}/${string}` // images/{storyId}/{fileName}
	| `audio/${string}/${string}` // audio/{storyId}/{fileName}
	| `video/${string}/${string}`; // video/{storyId}/{fileName}

