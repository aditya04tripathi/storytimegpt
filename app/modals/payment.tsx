import { useRouter } from "expo-router";
import { Button } from "@/components/common/Button";
import { Spacer, Stack, Text, View } from "@/components/ui";

export default function PaymentModal() {
	const router = useRouter();

	return (
		<View variant="default" padding="lg" style={{ flex: 1 }}>
			<Stack direction="column" spacing="md">
				<Text variant="default" size="3xl" weight="bold">
					Upgrade Subscription
				</Text>
				<Text variant="muted" size="base">
					Choose a plan that works best for you
				</Text>
				<Spacer size="xl" />
				<Button title="Close" onPress={() => router.back()} variant="outline" />
			</Stack>
		</View>
	);
}
