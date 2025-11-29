import { useRouter } from "expo-router";
import { Button } from "@/components/common/Button";
import { Divider, Spacer, Stack, Text, View } from "@/components/ui";
import { useAuthStore } from "@/state/authStore";

export default function ProfileScreen() {
	const { user, logout } = useAuthStore();
	const router = useRouter();

	const handleLogout = async () => {
		await logout();
		router.replace("/auth/login");
	};

	return (
		<View variant="default" padding="lg">
			<Stack direction="column" justify="center" align="stretch">
				<Text variant="default" size="4xl" weight="bold">
					{user ? user.name : "User not found."}
				</Text>
				{user && (
					<>
						<Stack direction="column" spacing="md">
							<Stack direction="column" spacing="xs">
								<Text variant="muted" size="sm">
									Email:
								</Text>
								<Text variant="default" size="base" weight="medium">
									{user.email}
								</Text>
							</Stack>
							<Divider />
							<Stack direction="column" spacing="xs">
								<Text variant="muted" size="sm">
									Name:
								</Text>
								<Text variant="default" size="base" weight="medium">
									{user.name || "Not set"}
								</Text>
							</Stack>
							<Divider />
							<Stack direction="column" spacing="xs">
								<Text variant="muted" size="sm">
									Subscription:
								</Text>
								<Text variant="default" size="base" weight="medium">
									{user.subscriptionTier}
								</Text>
							</Stack>
						</Stack>
						<Spacer size="xl" />
					</>
				)}
				<Button title="Logout" onPress={handleLogout} variant="danger" />
			</Stack>
		</View>
	);
}
