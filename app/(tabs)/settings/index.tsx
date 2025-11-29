import { Card } from "@/components/common/Card";
import { ScrollView, Stack, Text } from "@/components/ui";

export default function SettingsScreen() {
	return (
		<ScrollView contentPadding="md">
			<Stack direction="column" spacing="sm">
				<Text variant="default" size="3xl" weight="bold">
					Settings
				</Text>
				<Card
					title="Notifications"
					subtitle="Manage notification preferences"
				/>
				<Card title="Offline Mode" subtitle="Configure offline reading" />
				<Card title="Privacy" subtitle="Privacy and data settings" />
				<Card title="About" subtitle="App version and information" />
			</Stack>
		</ScrollView>
	);
}
