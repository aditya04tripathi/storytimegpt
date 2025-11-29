import { useRouter } from "expo-router";
import { FlatList } from "react-native";
import { Card } from "@/components/common/Card";
import { Stack, Text, View } from "@/components/ui";
import { useStoryStore } from "@/state/storyStore";

export default function LibraryScreen() {
	const router = useRouter();
	const { stories } = useStoryStore();

	return (
		<View variant="default" padding="lg">
			<FlatList
				data={stories}
				keyExtractor={(item) => item.id}
				renderItem={({ item }) => (
					<Card
						onPress={() => router.push(`/library/${item.id}`)}
						title={item.title}
						subtitle={item.status}
					/>
				)}
				ListEmptyComponent={
					<View variant="default">
						<Stack direction="column" spacing="sm" align="center">
							<Text variant="default" size="2xl" weight="bold">
								No stories yet
							</Text>
							<Text variant="muted" size="base" style={{ textAlign: "center" }}>
								Generate your first story from the home screen
							</Text>
						</Stack>
					</View>
				}
			/>
		</View>
	);
}
