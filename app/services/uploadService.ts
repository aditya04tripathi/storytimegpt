import api from "@/api/axios";

export class UploadService {
	async uploadFile(
		uri: string,
		type: "image" | "audio" | "video",
	): Promise<string> {
		// TODO: Implement file upload to backend
		const formData = new FormData();
		const filename = uri.split("/").pop() || "file";
		const fileType = `application/${type}`;

		formData.append("file", {
			uri,
			type: fileType,
			name: filename,
		} as any);

		try {
			const response = await api.post("/upload", formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});

			return response.url;
		} catch (error) {
			console.error("Upload error:", error);
			throw error;
		}
	}
}

export const uploadService = new UploadService();
