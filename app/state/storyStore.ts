import { create } from "zustand";
import type { Story } from "@/api/types";

type StoryState = {
	stories: Story[];
	loading: boolean;
	error: string | null;
	setStories: (stories: Story[]) => void;
	addStory: (story: Story) => void;
	updateStory: (id: string, updates: Partial<Story>) => void;
	getStory: (id: string) => Story | undefined;
	setLoading: (loading: boolean) => void;
	setError: (error: string | null) => void;
};

export const useStoryStore = create<StoryState>((set, get) => ({
	stories: [],
	loading: false,
	error: null,
	setStories: (stories) => set({ stories }),
	addStory: (story) =>
		set((state) => ({
			stories: [...state.stories, story],
		})),
	updateStory: (id, updates) =>
		set((state) => ({
			stories: state.stories.map((story) =>
				story.id === id ? { ...story, ...updates } : story,
			),
		})),
	getStory: (id) => get().stories.find((story) => story.id === id),
	setLoading: (loading) => set({ loading }),
	setError: (error) => set({ error }),
}));
