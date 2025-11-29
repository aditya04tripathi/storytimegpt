import { useRouter } from "expo-router";
import { Button } from "@/components/common/Button";
import { Spacer, Stack, Text, View } from "@/components/ui";
import { useAuthStore } from "@/state/authStore";

export default function SubscriptionScreen() {
	const router = useRouter();
	const { user } = useAuthStore();

	return (
		<View variant="default" padding="lg">
			<Stack direction="column" justify="center" align="stretch">
				<Text
					style={{ textAlign: "center" }}
					variant="default"
					size="4xl"
					weight="bold"
				>
					Subscription
				</Text>
				<Text style={{ textAlign: "center" }} variant="muted" size="base">
					Current Plan: {user?.subscriptionTier || "free"}
				</Text>
				<Spacer size="sm" />
				<Button
					title="Upgrade Plan"
					onPress={() => router.push("/modals/payment")}
				/>
			</Stack>
		</View>
	);
}
