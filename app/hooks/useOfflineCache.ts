import { useCallback } from "react";
import type { Story } from "@/api/types";
import { useStoryStore } from "@/state/storyStore";

export function useOfflineCache() {
	const { stories } = useStoryStore();

	const cacheStory = useCallback(async (story: Story) => {
		// TODO: Implement SQLite caching
		// Store story metadata and text in SQLite
		// Cache media files to file system
	}, []);

	const getCachedStory = useCallback(
		async (storyId: string): Promise<Story | null> => {
			// TODO: Retrieve from SQLite
			const story = stories.find((s) => s.id === storyId);
			return story || null;
		},
		[stories],
	);

	const isCached = useCallback(
		async (storyId: string): Promise<boolean> => {
			const story = await getCachedStory(storyId);
			return !!story;
		},
		[getCachedStory],
	);

	return {
		cacheStory,
		getCachedStory,
		isCached,
	};
}
