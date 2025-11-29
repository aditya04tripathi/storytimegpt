import { useRouter } from "expo-router";
import { Card } from "@/components/common/Card";
import { ScrollView, Spacer, Stack, Text, View } from "@/components/ui";

export default function SettingsScreen() {
	const router = useRouter();

	return (
		<View variant="default" padding="lg">
			<ScrollView>
				<Stack direction="column" spacing="sm">
					<Text variant="default" size="4xl" weight="bold">
						Settings
					</Text>
					<Spacer size="md" />
					<Card
						title="Notifications"
						subtitle="Manage notification preferences"
					/>
					<Card title="Offline Mode" subtitle="Configure offline reading" />
					<Card
						onPress={() => router.push("/modals/privacy")}
						title="Privacy"
						subtitle="Privacy and data settings"
					/>
					<Card
						onPress={() => router.push("/modals/about")}
						title="About"
						subtitle="App version and information"
					/>
				</Stack>
			</ScrollView>
		</View>
	);
}
