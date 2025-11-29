import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Colors } from "@/theme/colors";
import { Radius } from "@/theme/radius";
import { Shadows } from "@/theme/shadows";
import { Spacing } from "@/theme/spacing";
import { Typography } from "@/theme/typography";

type CardProps = {
	title: string;
	subtitle?: string;
	onPress?: () => void;
	children?: React.ReactNode;
};

export function Card({ title, subtitle, onPress, children }: CardProps) {
	const Component = onPress ? TouchableOpacity : View;

	return (
		<Component
			style={styles.card}
			onPress={onPress}
			activeOpacity={onPress ? 0.7 : 1}
		>
			<Text style={styles.title}>{title}</Text>
			{subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
			{children}
		</Component>
	);
}

const styles = StyleSheet.create({
	card: {
		backgroundColor: Colors.card,
		borderRadius: Radius.lg,
		padding: Spacing.md,
		...Shadows.md,
	},
	title: {
		fontSize: Typography.fontSize.lg,
		fontWeight: Typography.fontWeight.semibold,
		color: Colors.cardForeground,
		marginBottom: Spacing.xs,
	},
	subtitle: {
		fontSize: Typography.fontSize.sm,
		color: Colors.mutedForeground,
	},
});
