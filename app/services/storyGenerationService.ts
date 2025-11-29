import type { AxiosError } from "axios";
import axios, { isAxiosError } from "axios";
import type { StoryGenerateRequest, StoryGenerateResponse } from "@/api/types";
import { logError } from "@/services/errorLogger";
import { constants } from "@/utils/constants";

const API_BASE_URL =
	process.env.EXPO_PUBLIC_API_BASE_URL || constants.API_BASE_URL;

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

async function sleep(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

async function generateStoryWithRetry(
	request: StoryGenerateRequest,
	retryCount = 0,
): Promise<StoryGenerateResponse> {
	try {
		const response = await axios.post<StoryGenerateResponse>(
			`${API_BASE_URL}/story`,
			request,
			{
				headers: {
					"Content-Type": "application/json",
				},
				timeout: 60000,
				validateStatus: (status) => status === 200 || status === 500,
			},
		);

		if (response.status === 200) {
			if (response.data.okay) {
				if (!response.data.story || !response.data.story.trim()) {
					const error = new Error(
						"Story generation succeeded but no story content was returned",
					);
					await logError(error, "high", {
						action: "story_generation",
						metadata: { request },
					});
					throw error;
				}
				if (!response.data.title || !response.data.title.trim()) {
					const error = new Error(
						"Story generation succeeded but no title was returned",
					);
					await logError(error, "high", {
						action: "story_generation",
						metadata: { request },
					});
					throw error;
				}
				return response.data;
			}
			const errorMsg =
				response.data?.error ||
				response.data?.message ||
				"Story generation failed";
			const error = new Error(errorMsg);
			await logError(error, "high", {
				action: "story_generation",
				metadata: { request, response: response.data },
			});
			throw error;
		}

		if (response.status === 500) {
			if (retryCount < MAX_RETRIES) {
				const delay = RETRY_DELAY * 2 ** retryCount;
				await sleep(delay);
				return generateStoryWithRetry(request, retryCount + 1);
			}
			const error = new Error(
				response.data?.error ||
					"Story generation failed after multiple retries",
			);
			await logError(error, "critical", {
				action: "story_generation",
				metadata: { request, retryCount, status: response.status },
			});
			throw error;
		}

		const error = new Error(`Unexpected status code: ${response.status}`);
		await logError(error, "high", {
			action: "story_generation",
			metadata: { request, status: response.status },
		});
		throw error;
	} catch (error) {
		if (isAxiosError(error)) {
			const axiosError = error as AxiosError<StoryGenerateResponse>;

			if (axiosError.response?.status === 500) {
				if (retryCount < MAX_RETRIES) {
					const delay = RETRY_DELAY * 2 ** retryCount;
					await sleep(delay);
					return generateStoryWithRetry(request, retryCount + 1);
				}
				throw new Error(
					axiosError.response?.data?.error ||
						"Story generation failed after multiple retries",
				);
			}

			if (axiosError.response?.status === 200) {
				const data = axiosError.response.data;
				if (data?.okay) {
					if (!data.story || !data.story.trim()) {
						const error = new Error(
							"Story generation succeeded but no story content was returned",
						);
						await logError(error, "high", {
							action: "story_generation",
							metadata: { request },
						});
						throw error;
					}
					if (!data.title || !data.title.trim()) {
						const error = new Error(
							"Story generation succeeded but no title was returned",
						);
						await logError(error, "high", {
							action: "story_generation",
							metadata: { request },
						});
						throw error;
					}
					return data;
				}
				const errorMsg =
					data?.error || data?.message || "Story generation failed";
				const error = new Error(errorMsg);
				await logError(error, "high", {
					action: "story_generation",
					metadata: { request, response: data },
				});
				throw error;
			}

			if (axiosError.code === "ECONNABORTED") {
				if (retryCount < MAX_RETRIES) {
					const delay = RETRY_DELAY * 2 ** retryCount;
					await sleep(delay);
					return generateStoryWithRetry(request, retryCount + 1);
				}
				const timeoutError = new Error("Request timeout after multiple retries");
				await logError(timeoutError, "critical", {
					action: "story_generation",
					metadata: { request, retryCount, code: axiosError.code },
				});
				throw timeoutError;
			}

			const networkError = new Error(
				axiosError.response?.data?.error ||
					axiosError.message ||
					"Network error occurred",
			);
			await logError(networkError, "high", {
				action: "story_generation",
				metadata: {
					request,
					status: axiosError.response?.status,
					code: axiosError.code,
				},
			});
			throw networkError;
		}

		if (error instanceof Error) {
			await logError(error, "medium", {
				action: "story_generation",
				metadata: { request },
			});
			throw error;
		}

		const unknownError = new Error("Unknown error occurred during story generation");
		await logError(unknownError, "high", {
			action: "story_generation",
			metadata: { request, errorType: typeof error },
		});
		throw unknownError;
	}
}

export async function generateStory(
	request: StoryGenerateRequest,
): Promise<StoryGenerateResponse> {
	return generateStoryWithRetry(request);
}
