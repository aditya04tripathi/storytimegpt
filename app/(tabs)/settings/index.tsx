import { useRouter } from "expo-router";
import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { ScrollView, Spacer, Stack, Text } from "@/components/ui";
import { signOutUser } from "@/services/firebase/authService";

export default function SettingsScreen() {
	const router = useRouter();

	return (
		<ScrollView contentPadding="lg">
			<Stack
				direction="column"
				spacing="none"
				justify="between"
				align="stretch"
				expand
			>
				<Stack direction="column" spacing="md" align="stretch" expand={false}>
					<Stack direction="column" spacing="xs" align="start">
						<Text variant="default" size="4xl" weight="bold">
							Settings
						</Text>
						<Text variant="muted" size="base">
							Manage your account and preferences
						</Text>
					</Stack>

					<Stack direction="column" spacing="md" align="stretch">
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
				</Stack>

				<Spacer size="md" />

				<Button variant="danger" title="Logout" onPress={() => signOutUser()} />
			</Stack>
		</ScrollView>
	);
}
