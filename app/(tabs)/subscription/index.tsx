import { useRef, useState } from "react";
import {
	Dimensions,
	type NativeScrollEvent,
	type NativeSyntheticEvent,
	ScrollView as RNScrollView,
	StyleSheet,
} from "react-native";
import { Button } from "@/components/common/Button";
import { ScrollView, Spacer, Stack, Text, View } from "@/components/ui";
import { updateSubscriptionTier } from "@/services/firebase/firestoreService";
import { useAuthStore } from "@/state/authStore";
import { Colors } from "@/theme/colors";
import { Radius } from "@/theme/radius";
import { Shadows } from "@/theme/shadows";
import { Spacing } from "@/theme/spacing";
import { Typography } from "@/theme/typography";
import { STORY_LIMITS } from "@/utils/constants";
import { formatters } from "@/utils/formatters";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const HORIZONTAL_PADDING = Spacing.lg;
const CARD_SPACING = Spacing.md;
const CARD_WIDTH = SCREEN_WIDTH - HORIZONTAL_PADDING * 2;
const SNAP_INTERVAL = CARD_WIDTH + CARD_SPACING;

type PricingTier = {
	id: "free" | "silver" | "gold" | "platinum";
	title: string;
	description: string;
	price: number;
	pricePeriod: string;
	features: string[];
	limits: (typeof STORY_LIMITS)[keyof typeof STORY_LIMITS];
};

const pricingTiers: PricingTier[] = [
	{
		id: "free",
		title: "Free",
		description: "Perfect for getting started",
		price: 0,
		pricePeriod: "forever",
		features: [
			`${STORY_LIMITS.free.maxStoriesPerMonth} stories per month`,
			`Up to ${STORY_LIMITS.free.maxStoryLength} words per story`,
			"Text-only stories",
			"Basic vocabulary",
		],
		limits: STORY_LIMITS.free,
	},
	{
		id: "silver",
		title: "Silver",
		description: "For regular readers",
		price: 4.99,
		pricePeriod: "month",
		features: [
			`${STORY_LIMITS.silver.maxStoriesPerMonth} stories per month`,
			`Up to ${STORY_LIMITS.silver.maxStoryLength} words per story`,
			"Audio narration",
			"Enhanced vocabulary",
		],
		limits: STORY_LIMITS.silver,
	},
	{
		id: "gold",
		title: "Gold",
		description: "For avid story lovers",
		price: 9.99,
		pricePeriod: "month",
		features: [
			`${STORY_LIMITS.gold.maxStoriesPerMonth} stories per month`,
			`Up to ${STORY_LIMITS.gold.maxStoryLength} words per story`,
			"Audio narration",
			"Video content",
			"Premium vocabulary",
		],
		limits: STORY_LIMITS.gold,
	},
	{
		id: "platinum",
		title: "Platinum",
		description: "Unlimited everything",
		price: 19.99,
		pricePeriod: "month",
		features: [
			"Unlimited stories",
			"Unlimited story length",
			"Audio narration",
			"Video content",
			"Premium vocabulary",
			"Priority support",
		],
		limits: STORY_LIMITS.platinum,
	},
];

type PricingCardProps = {
	tier: PricingTier;
	isCurrentPlan: boolean;
	onSelect: () => void;
	isLoading: boolean;
};

function PricingCard({
	tier,
	isCurrentPlan,
	onSelect,
	isLoading,
}: PricingCardProps) {
	return (
		<View style={styles.card}>
			{isCurrentPlan && (
				<View style={styles.badge}>
					<Text style={styles.badgeText}>Current Plan</Text>
				</View>
			)}
			<Stack direction="column" spacing="md" align="stretch">
				<Stack direction="column" spacing="xs" align="center">
					<Text variant="default" size="2xl" weight="bold">
						{tier.title}
					</Text>
					<Text variant="muted" size="sm" style={{ textAlign: "center" }}>
						{tier.description}
					</Text>
				</Stack>

				<Stack direction="column" spacing="xs" align="center">
					<View style={styles.priceContainer}>
						<Text
							variant="default"
							size="4xl"
							weight="bold"
							style={styles.priceText}
						>
							{formatters.currency(tier.price)}
						</Text>
						{tier.price > 0 && (
							<Text variant="muted" size="base" style={styles.pricePeriod}>
								/{tier.pricePeriod}
							</Text>
						)}
					</View>
				</Stack>

				<View style={styles.divider} />

				<Stack direction="column" spacing="sm" align="stretch">
					{tier.features.map((feature) => (
						<Stack key={feature} direction="row" spacing="sm" align="start">
							<Text variant="default" size="base" style={styles.checkmark}>
								✓
							</Text>
							<Text variant="muted" size="sm" style={{ flex: 1 }}>
								{feature}
							</Text>
						</Stack>
					))}
				</Stack>

				<Spacer size="md" />

				<Button
					title={
						isCurrentPlan
							? "Current Plan"
							: isLoading
								? "Upgrading..."
								: "Select Plan"
					}
					onPress={onSelect}
					variant={isCurrentPlan ? "outline" : "primary"}
					disabled={isCurrentPlan || isLoading}
				/>
			</Stack>
		</View>
	);
}

export default function SubscriptionScreen() {
	const { user, refreshUser } = useAuthStore();
	const scrollViewRef = useRef<RNScrollView>(null);
	const [currentIndex, setCurrentIndex] = useState(0);
	const [isLoading, setIsLoading] = useState(false);

	const currentTier = user?.subscriptionTier || "free";

	const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
		const offsetX = event.nativeEvent.contentOffset.x;
		const index = Math.round(offsetX / SNAP_INTERVAL);
		setCurrentIndex(index);
	};

	const handleSelectPlan = async (
		tierId: "free" | "silver" | "gold" | "platinum",
	) => {
		if (tierId === currentTier) return;
		setIsLoading(true);
		await updateSubscriptionTier(
			user!.id,
			tierId as "free" | "silver" | "gold" | "platinum",
		);
		await refreshUser();
		setIsLoading(false);
	};

	return (
		<View variant="default" style={{ flex: 1 }}>
			<ScrollView contentPadding="lg" contentContainerStyle={styles.container}>
				<Stack direction="column" spacing="none" align="stretch">
					<Stack direction="column" spacing="xs" align="center">
						<Text variant="default" size="4xl" weight="bold">
							Subscription Plans
						</Text>
						<Text variant="muted" size="base" style={{ textAlign: "center" }}>
							Choose the plan that&apos;s right for you
						</Text>
					</Stack>

					<View style={styles.carouselContainer}>
						<RNScrollView
							ref={scrollViewRef}
							horizontal
							pagingEnabled={false}
							snapToInterval={SNAP_INTERVAL}
							snapToAlignment="start"
							decelerationRate="fast"
							showsHorizontalScrollIndicator={false}
							onScroll={handleScroll}
							scrollEventThrottle={16}
							contentContainerStyle={styles.carouselContent}
						>
							{pricingTiers.map((tier, index) => (
								<View
									key={tier.id}
									style={[
										styles.cardWrapper,
										index === pricingTiers.length - 1 && styles.lastCardWrapper,
									]}
								>
									<PricingCard
										isLoading={isLoading}
										tier={tier}
										isCurrentPlan={tier.id === currentTier}
										onSelect={() => handleSelectPlan(tier.id)}
									/>
								</View>
							))}
						</RNScrollView>

						<View style={styles.pagination}>
							{pricingTiers.map((tier, index) => (
								<View
									key={tier.id}
									style={[
										styles.dot,
										index === currentIndex && styles.dotActive,
									]}
								/>
							))}
						</View>
					</View>
				</Stack>
			</ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		paddingBottom: Spacing.xl,
	},
	carouselContainer: {
		marginVertical: Spacing.lg,
	},
	carouselContent: {
		paddingLeft: 0,
		paddingRight: 0,
	},
	cardWrapper: {
		width: CARD_WIDTH,
		marginRight: CARD_SPACING,
	},
	lastCardWrapper: {
		marginRight: 0,
	},
	card: {
		backgroundColor: Colors.card,
		borderRadius: Radius.xl,
		padding: Spacing.lg,
		minHeight: 500,
		borderWidth: 2,
		borderColor: Colors.border,
		...Shadows.lg,
	},
	badge: {
		position: "absolute",
		top: Spacing.md,
		right: Spacing.md,
		backgroundColor: Colors.primary,
		paddingHorizontal: Spacing.sm,
		paddingVertical: Spacing.xs,
		borderRadius: Radius.full,
		zIndex: 1,
	},
	badgeText: {
		color: Colors.primaryForeground,
		fontSize: Typography.fontSize.xs,
		fontWeight: Typography.fontWeight.semibold,
	},
	divider: {
		height: 1,
		backgroundColor: Colors.border,
		marginVertical: Spacing.md,
	},
	checkmark: {
		color: Colors.primary,
		fontWeight: Typography.fontWeight.bold,
	},
	priceContainer: {
		flexDirection: "row",
		alignItems: "baseline",
		gap: Spacing.xs,
		backgroundColor: Colors.card,
	},
	priceText: {
		color: Colors.foreground,
	},
	pricePeriod: {
		marginLeft: Spacing.xs,
		color: Colors.mutedForeground,
	},
	pagination: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		marginTop: Spacing.lg,
		gap: Spacing.sm,
	},
	dot: {
		width: 8,
		height: 8,
		borderRadius: 4,
		backgroundColor: Colors.muted,
	},
	dotActive: {
		backgroundColor: Colors.primary,
		width: 24,
	},
});
