import { View, Text, StyleSheet } from "react-native";
import { Colors } from "@/theme/colors";
import { Radius } from "@/theme/radius";
import { Spacing } from "@/theme/spacing";
import { Typography } from "@/theme/typography";

type BadgeProps = {
	children: React.ReactNode;
	variant?: "default" | "primary" | "secondary" | "destructive" | "outline";
};

export function Badge({ children, variant = "default" }: BadgeProps) {
	return (
		<View style={[styles.badge, styles[`badge${variant.charAt(0).toUpperCase() + variant.slice(1)}`]]}>
			<Text style={[styles.text, styles[`text${variant.charAt(0).toUpperCase() + variant.slice(1)}`]]}>
				{children}
			</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	badge: {
		paddingHorizontal: Spacing.sm,
		paddingVertical: Spacing.xs,
		borderRadius: Radius.full,
		alignSelf: "flex-start",
	},
	badgeDefault: {
		backgroundColor: Colors.secondary,
	},
	badgePrimary: {
		backgroundColor: Colors.primary,
	},
	badgeSecondary: {
		backgroundColor: Colors.accent,
	},
	badgeDestructive: {
		backgroundColor: Colors.destructive,
	},
	badgeOutline: {
		backgroundColor: "transparent",
		borderWidth: 1,
		borderColor: Colors.border,
	},
	text: {
		fontSize: Typography.fontSize.xs,
		fontWeight: Typography.fontWeight.medium,
	},
	textDefault: {
		color: Colors.secondaryForeground,
	},
	textPrimary: {
		color: Colors.primaryForeground,
	},
	textSecondary: {
		color: Colors.accentForeground,
	},
	textDestructive: {
		color: Colors.destructiveForeground,
	},
	textOutline: {
		color: Colors.foreground,
	},
});

