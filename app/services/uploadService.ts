import * as FileSystem from "expo-file-system";
import {
	uploadAudio,
	uploadImage,
	uploadVideo,
} from "./firebase/storageService";

export class UploadService {
	private async uriToBlob(uri: string): Promise<Blob> {
		const base64 = await FileSystem.readAsStringAsync(uri, {
			encoding: "base64",
		});

		const fileInfo = await FileSystem.getInfoAsync(uri);
		const mimeType =
			fileInfo.uri.endsWith(".jpg") || fileInfo.uri.endsWith(".jpeg")
				? "image/jpeg"
				: fileInfo.uri.endsWith(".png")
					? "image/png"
					: fileInfo.uri.endsWith(".mp3")
						? "audio/mpeg"
						: fileInfo.uri.endsWith(".mp4")
							? "video/mp4"
							: "application/octet-stream";

		const byteCharacters = atob(base64);
		const byteNumbers = new Array(byteCharacters.length);
		for (let i = 0; i < byteCharacters.length; i++) {
			byteNumbers[i] = byteCharacters.charCodeAt(i);
		}
		const byteArray = new Uint8Array(byteNumbers);
		return new Blob([byteArray], { type: mimeType });
	}

	async uploadFile(
		uri: string,
		type: "image" | "audio" | "video",
		storyId: string,
		index: number = 0,
		onProgress?: (progress: number) => void,
	): Promise<string> {
		try {
			const blob = await this.uriToBlob(uri);

			switch (type) {
				case "image":
					return await uploadImage(blob, storyId, index, onProgress);
				case "audio":
					return await uploadAudio(blob, storyId, onProgress);
				case "video":
					return await uploadVideo(blob, storyId, index, onProgress);
				default:
					throw new Error(`Unsupported file type: ${type}`);
			}
		} catch (error) {
			console.error("Upload error:", error);
			throw error instanceof Error ? error : new Error("Failed to upload file");
		}
	}
}

export const uploadService = new UploadService();
