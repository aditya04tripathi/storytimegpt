import { useLocalSearchParams } from "expo-router";
import { AudioPlayer } from "@/components/story/AudioPlayer";
import { InlineImage } from "@/components/story/InlineImage";
import { StoryText } from "@/components/story/StoryText";
import { ScrollView, Stack, Text, View } from "@/components/ui";
import { useStoryStore } from "@/state/storyStore";

export default function StoryDetailScreen() {
	const { storyId } = useLocalSearchParams<{ storyId: string }>();
	const { getStory } = useStoryStore();
	const story = getStory(storyId);

	if (!story) {
		return (
			<View
				variant="default"
				padding="lg"
				style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
			>
				<Text variant="default" size="lg">
					Story not found
				</Text>
			</View>
		);
	}

	return (
		<ScrollView contentPadding="md">
			<Stack direction="column" spacing="md">
				<Text variant="default" size="2xl" weight="bold">
					{story.title}
				</Text>
				<StoryText text={story.text} />
				{story.images.map((image, index) => (
					<InlineImage
						key={`${image.url}-${index}`}
						source={{ uri: image.url }}
					/>
				))}
				{story.audio && <AudioPlayer source={{ uri: story.audio.url }} />}
			</Stack>
		</ScrollView>
	);
}
