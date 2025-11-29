import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Alert, RefreshControl } from "react-native";
import type { Story } from "@/api/types";
import { Button } from "@/components/common/Button";
import { AudioPlayer } from "@/components/story/AudioPlayer";
import { InlineImage } from "@/components/story/InlineImage";
import {
	Pressable,
	SafeAreaView,
	ScrollView,
	Stack,
	Text,
	View,
} from "@/components/ui";
import {
	deleteStory,
	getStory,
	removeStoryFromUser,
} from "@/services/firebase/firestoreService";
import { logError } from "@/services/errorLogger";
import { useAuthStore } from "@/state/authStore";
import { Colors } from "@/theme";

export default function StoryDetailScreen() {
	const { storyId } = useLocalSearchParams<{ storyId: string }>();
	const router = useRouter();
	const { user } = useAuthStore();
	const [story, setStory] = useState<Story | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isRefreshing, setIsRefreshing] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const loadStory = useCallback(async () => {
		if (!storyId) {
			setIsLoading(false);
			setError("Story ID is required");
			return;
		}

		try {
			setError(null);
			const storyData = await getStory(storyId);
			if (!storyData) {
				setError("Story not found");
			} else {
				setStory(storyData);
			}
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : "Failed to load story";
			setError(errorMessage);
			await logError(err, "medium", {
				screen: "story_detail",
				action: "load_story",
				metadata: { storyId },
				userId: user?.id,
			}, user?.id);
		} finally {
			setIsLoading(false);
			setIsRefreshing(false);
		}
	}, [storyId]);

	useEffect(() => {
		setIsLoading(true);
		loadStory();
	}, [loadStory]);

	const onRefresh = useCallback(() => {
		setIsRefreshing(true);
		loadStory();
	}, [loadStory]);

	const handleDelete = useCallback(() => {
		if (!story || !user?.id) return;

		Alert.alert(
			"Delete Story",
			`Are you sure you want to delete "${story.title}"? This action cannot be undone.`,
			[
				{
					text: "Cancel",
					style: "cancel",
				},
				{
					text: "Delete",
					style: "destructive",
					onPress: async () => {
						try {
							setIsDeleting(true);
							setError(null);
							await Promise.all([
								deleteStory(story.id),
								removeStoryFromUser(user.id, story.id),
							]);
							router.back();
						} catch (err) {
							const errorMessage =
								err instanceof Error ? err.message : "Failed to delete story";
							setError(errorMessage);
							await logError(err, "high", {
								screen: "story_detail",
								action: "delete_story",
								metadata: { storyId: story.id },
								userId: user?.id,
							}, user?.id);
						} finally {
							setIsDeleting(false);
						}
					},
				},
			],
		);
	}, [story, user?.id, router]);

	const refreshControl = (
		<RefreshControl
			refreshing={isRefreshing}
			onRefresh={onRefresh}
			tintColor={Colors.primary}
			colors={[Colors.primary]}
		/>
	);

	if (isLoading && !isRefreshing) {
		return (
			<View
				variant="default"
				padding="lg"
				style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
			>
				<ActivityIndicator size="large" color={Colors.primary} />
				<Text variant="muted" size="base" style={{ marginTop: 16 }}>
					Loading story...
				</Text>
			</View>
		);
	}

	if (error || !story) {
		return (
			<ScrollView contentPadding="lg" refreshControl={refreshControl}>
				<View
					variant="default"
					style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
				>
					<Text variant="default" size="lg" weight="semibold">
						{error || "Story not found"}
					</Text>
				</View>
			</ScrollView>
		);
	}

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
			<ScrollView contentPadding="lg" refreshControl={refreshControl}>
				<Stack direction="column" spacing="lg" align="stretch">
					{story.text && (
						<Stack direction="column" spacing="md" align="stretch">
							<Stack
								direction="row"
								spacing="md"
								align="center"
								justify="start"
							>
								<Pressable variant="primary" onPress={() => router.back()}>
									<Ionicons
										name="chevron-back"
										size={20}
										color={Colors.foreground}
										onPress={() => router.back()}
									/>
								</Pressable>
								<Text variant="default" size="lg" weight="semibold">
									{story.title}
								</Text>
								{/* <Button
									title={isSpeaking ? "Pause" : "Play"}
									onPress={handleTextToSpeech}
									variant="outline"
									style={{
										paddingHorizontal: Spacing.md,
										paddingVertical: Spacing.sm,
										minHeight: 36,
									}}
								/> */}
							</Stack>
							{/* <StoryText text={story.text} /> */}
							<Text variant="default" size="base">
								{story.text}
							</Text>
						</Stack>
					)}

					{story.images && story.images.length > 0 && (
						<Stack direction="column" spacing="md" align="stretch">
							{story.images.map((image, index) => (
								<View
									key={`${image.url}-${index}`}
									variant="card"
									rounded="lg"
									style={{
										backgroundColor: Colors.card,
										borderWidth: 1,
										borderColor: Colors.border,
										overflow: "hidden",
									}}
								>
									<InlineImage source={{ uri: image.url }} />
								</View>
							))}
						</Stack>
					)}

					{story.audio && (
						<View
							variant="card"
							padding="lg"
							rounded="lg"
							style={{
								backgroundColor: Colors.card,
								borderWidth: 1,
								borderColor: Colors.border,
							}}
						>
							<AudioPlayer source={{ uri: story.audio.url }} />
						</View>
					)}

					{error && (
						<View
							variant="card"
							padding="md"
							rounded="md"
							style={{ backgroundColor: Colors.destructive }}
						>
							<Text
								variant="default"
								size="sm"
								style={{ color: Colors.destructiveForeground }}
							>
								{error}
							</Text>
						</View>
					)}

					<View>
						<Button
							title="Delete Story"
							onPress={handleDelete}
							variant="danger"
							loading={isDeleting}
							disabled={isDeleting}
						/>
					</View>
				</Stack>
			</ScrollView>
		</SafeAreaView>
	);
}
