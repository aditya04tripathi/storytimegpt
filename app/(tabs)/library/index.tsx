import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
	ActivityIndicator,
	Alert,
	FlatList,
	RefreshControl,
	TouchableOpacity,
} from "react-native";
import type { StorySummary } from "@/api/types";
import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { ScrollView, Stack, Text, View } from "@/components/ui";
import {
	deleteStory,
	getUserStories,
	removeStoryFromUser,
} from "@/services/firebase/firestoreService";
import { logError } from "@/services/errorLogger";
import { useAuthStore } from "@/state/authStore";
import { Colors } from "@/theme";
import { Spacing } from "@/theme/spacing";

export default function LibraryScreen() {
	const router = useRouter();
	const { user } = useAuthStore();
	const [stories, setStories] = useState<StorySummary[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isRefreshing, setIsRefreshing] = useState(false);
	const [deletingStoryId, setDeletingStoryId] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);

	const loadStories = useCallback(async () => {
		if (!user?.id) {
			setIsLoading(false);
			return;
		}

		try {
			setError(null);
			const userStories = await getUserStories(user.id);
			setStories(userStories);
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : "Failed to load stories";
			setError(errorMessage);
			await logError(err, "medium", {
				screen: "library",
				action: "load_stories",
				userId: user?.id,
			}, user?.id);
		} finally {
			setIsLoading(false);
			setIsRefreshing(false);
		}
	}, [user?.id]);

	useEffect(() => {
		setIsLoading(true);
		loadStories();
	}, [loadStories]);

	const onRefresh = useCallback(() => {
		setIsRefreshing(true);
		loadStories();
	}, [loadStories, user?.id]);

	const handleDelete = useCallback(
		(story: StorySummary) => {
			if (!user?.id) return;

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
								setDeletingStoryId(story.id);
								setError(null);
								await Promise.all([
									deleteStory(story.id),
									removeStoryFromUser(user.id, story.id),
								]);
								setStories((prev) => prev.filter((s) => s.id !== story.id));
							} catch (err) {
								const errorMessage =
									err instanceof Error ? err.message : "Failed to delete story";
								setError(errorMessage);
								await logError(err, "high", {
									screen: "library",
									action: "delete_story",
									metadata: { storyId: story.id },
									userId: user?.id,
								}, user?.id);
							} finally {
								setDeletingStoryId(null);
							}
						},
					},
				],
			);
		},
		[user?.id],
	);

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
			<ScrollView contentPadding="lg" refreshControl={refreshControl}>
				<Stack direction="column" spacing="lg" align="stretch">
					<Text variant="default" size="4xl" weight="bold">
						Your Stories
					</Text>
					<Stack direction="column" spacing="md" align="center">
						<ActivityIndicator size="large" color={Colors.primary} />
						<Text variant="muted" size="base">
							Loading stories...
						</Text>
					</Stack>
				</Stack>
			</ScrollView>
		);
	}

	if (error) {
		return (
			<ScrollView contentPadding="lg" refreshControl={refreshControl}>
				<Stack direction="column" spacing="lg" align="stretch">
					<Text variant="default" size="4xl" weight="bold">
						Your Stories
					</Text>
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
				</Stack>
			</ScrollView>
		);
	}

	if (!stories || stories.length === 0) {
		return (
			<ScrollView contentPadding="lg" refreshControl={refreshControl}>
				<Stack direction="column" spacing="lg" align="stretch">
					<Stack direction="column" spacing="xs" align="center">
						<Ionicons
							name="information-circle-outline"
							size={48}
							color={Colors.foreground}
						/>
						<Text variant="default" size="2xl" weight="bold">
							No stories yet
						</Text>
						<Text variant="muted" size="base" style={{ textAlign: "center" }}>
							Generate your first story from the home screen
						</Text>
					</Stack>
					<Button
						variant="primary"
						title="Generate Story"
						onPress={() => {
							router.push("/");
						}}
					/>
				</Stack>
			</ScrollView>
		);
	}

	return (
		<ScrollView contentPadding="lg" refreshControl={refreshControl}>
			<Stack direction="column" spacing="lg" align="stretch">
				<Text variant="default" size="4xl" weight="bold">
					Your Stories
				</Text>
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
				<FlatList
					data={stories}
					keyExtractor={(item) => item.id}
					renderItem={({ item }) => (
						<View
							style={{
								marginBottom: Spacing.md,
								flexDirection: "row",
								alignItems: "center",
								gap: Spacing.sm,
							}}
						>
							<View style={{ flex: 1 }}>
								<Card
									onPress={() => router.push(`/library/${item.id}`)}
									title={item.title}
									subtitle={item.status}
								/>
							</View>
							<TouchableOpacity
								onPress={() => handleDelete(item)}
								disabled={deletingStoryId === item.id}
								style={{
									padding: Spacing.md,
									justifyContent: "center",
									alignItems: "center",
									opacity: deletingStoryId === item.id ? 0.5 : 1,
								}}
							>
								{deletingStoryId === item.id ? (
									<ActivityIndicator size="small" color={Colors.destructive} />
								) : (
									<Ionicons
										name="trash-outline"
										size={24}
										color={Colors.destructive}
									/>
								)}
							</TouchableOpacity>
						</View>
					)}
					scrollEnabled={false}
				/>
			</Stack>
		</ScrollView>
	);
}
