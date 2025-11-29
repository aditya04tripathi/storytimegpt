import {
	deleteObject,
	getDownloadURL,
	getMetadata,
	ref,
	type UploadTaskSnapshot,
	uploadBytes,
	uploadBytesResumable,
} from "firebase/storage";
import { storage } from "../firebase";

export async function uploadImage(
	file: Blob | Uint8Array | ArrayBuffer,
	storyId: string,
	index: number,
	onProgress?: (progress: number) => void,
): Promise<string> {
	try {
		const fileName = `image_${index}.jpg`;
		const storageRef = ref(storage, `images/${storyId}/${fileName}`);

		if (onProgress) {
			const uploadTask = uploadBytesResumable(storageRef, file);
			return new Promise((resolve, reject) => {
				uploadTask.on(
					"state_changed",
					(snapshot: UploadTaskSnapshot) => {
						const progress =
							(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
						onProgress(progress);
					},
					(error) => {
						reject(new Error(error.message || "Failed to upload image"));
					},
					async () => {
						const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
						resolve(downloadURL);
					},
				);
			});
		} else {
			await uploadBytes(storageRef, file);
			return await getDownloadURL(storageRef);
		}
	} catch (error: any) {
		throw new Error(error.message || "Failed to upload image");
	}
}

export async function uploadAudio(
	file: Blob | Uint8Array | ArrayBuffer,
	storyId: string,
	onProgress?: (progress: number) => void,
): Promise<string> {
	try {
		const fileName = "audio.mp3";
		const storageRef = ref(storage, `audio/${storyId}/${fileName}`);

		if (onProgress) {
			const uploadTask = uploadBytesResumable(storageRef, file);
			return new Promise((resolve, reject) => {
				uploadTask.on(
					"state_changed",
					(snapshot: UploadTaskSnapshot) => {
						const progress =
							(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
						onProgress(progress);
					},
					(error) => {
						reject(new Error(error.message || "Failed to upload audio"));
					},
					async () => {
						const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
						resolve(downloadURL);
					},
				);
			});
		} else {
			await uploadBytes(storageRef, file);
			return await getDownloadURL(storageRef);
		}
	} catch (error: any) {
		throw new Error(error.message || "Failed to upload audio");
	}
}

export async function uploadVideo(
	file: Blob | Uint8Array | ArrayBuffer,
	storyId: string,
	index: number,
	onProgress?: (progress: number) => void,
): Promise<string> {
	try {
		const fileName = `video_${index}.mp4`;
		const storageRef = ref(storage, `video/${storyId}/${fileName}`);

		if (onProgress) {
			const uploadTask = uploadBytesResumable(storageRef, file);
			return new Promise((resolve, reject) => {
				uploadTask.on(
					"state_changed",
					(snapshot: UploadTaskSnapshot) => {
						const progress =
							(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
						onProgress(progress);
					},
					(error) => {
						reject(new Error(error.message || "Failed to upload video"));
					},
					async () => {
						const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
						resolve(downloadURL);
					},
				);
			});
		} else {
			await uploadBytes(storageRef, file);
			return await getDownloadURL(storageRef);
		}
	} catch (error: any) {
		throw new Error(error.message || "Failed to upload video");
	}
}

export async function getDownloadURLForPath(path: string): Promise<string> {
	try {
		const storageRef = ref(storage, path);
		return await getDownloadURL(storageRef);
	} catch (error: any) {
		throw new Error(error.message || "Failed to get download URL");
	}
}

export async function deleteFile(path: string): Promise<void> {
	try {
		const storageRef = ref(storage, path);
		await deleteObject(storageRef);
	} catch (error: any) {
		throw new Error(error.message || "Failed to delete file");
	}
}

export async function getFileMetadata(path: string): Promise<{
	size: number;
	contentType: string;
	timeCreated: string;
	updated: string;
}> {
	try {
		const storageRef = ref(storage, path);
		const metadata = await getMetadata(storageRef);
		return {
			size: metadata.size,
			contentType: metadata.contentType || "",
			timeCreated: metadata.timeCreated || "",
			updated: metadata.updated || "",
		};
	} catch (error: any) {
		throw new Error(error.message || "Failed to get file metadata");
	}
}
