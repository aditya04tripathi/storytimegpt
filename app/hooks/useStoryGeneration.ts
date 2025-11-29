import { useCallback } from "react";
import api from "@/api/axios";
import { endpoints } from "@/api/endpoints";
import type {
	Story,
	StoryGenerateRequest,
	StoryGenerateResponse,
} from "@/api/types";
import { logError } from "@/services/errorLogger";
import { useStoryStore } from "@/state/storyStore";

export function useStoryGeneration() {
	const { addStory, updateStory, setLoading, setError } = useStoryStore();

	const generate = useCallback(
		async (prompt: string, title?: string) => {
			setLoading(true);
			setError(null);

			try {
				const response = await api.post<StoryGenerateResponse>(
					endpoints.story.generate,
					{ prompt, title } as StoryGenerateRequest,
				);

				const { jobId, storyId } = response;

				const optimisticStory: Story = {
					id: storyId,
					title: title || prompt.substring(0, 50),
					text: "",
					images: [],
					createdAt: new Date().toISOString(),
					status: "pending",
				};

				addStory(optimisticStory);

				pollStatus(storyId);

				return { jobId, storyId };
			} catch (error: any) {
				setError(error.message || "Failed to generate story");
				throw error;
			} finally {
				setLoading(false);
			}
		},
		[addStory, setLoading, setError, pollStatus],
	);

	const pollStatus = useCallback(
		async (storyId: string) => {
			let delay = 2000;
			const maxDelay = 10000;

			while (true) {
				await new Promise((resolve) => setTimeout(resolve, delay));

				try {
					const story = await api.get<Story>(endpoints.story.getById(storyId));
					updateStory(storyId, story);

					if (story.status === "completed" || story.status === "failed") {
						break;
					}

					delay = Math.min(maxDelay, delay * 1.5);
				} catch (error) {
					await logError(error, "medium", {
						action: "poll_story_status",
						metadata: { storyId },
					});
					break;
				}
			}
		},
		[updateStory],
	);

	return { generate };
}
