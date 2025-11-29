import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/theme/colors";
import { Radius } from "@/theme/radius";
import { Spacing } from "@/theme/spacing";
import { Typography } from "@/theme/typography";

type AlertProps = {
	title?: string;
	description?: string;
	variant?: "default" | "destructive" | "success";
	icon?: keyof typeof Ionicons.glyphMap;
	children?: React.ReactNode;
};

export function Alert({
	title,
	description,
	variant = "default",
	icon,
	children,
}: AlertProps) {
	const iconName =
		icon ||
		(variant === "destructive"
			? "alert-circle"
			: variant === "success"
			? "checkmark-circle"
			: "information-circle");

	const variantColors = {
		default: {
			bg: Colors.muted,
			border: Colors.border,
			text: Colors.foreground,
			icon: Colors.foreground,
		},
		destructive: {
			bg: Colors.destructive,
			border: Colors.destructive,
			text: Colors.destructiveForeground,
			icon: Colors.destructiveForeground,
		},
		success: {
			bg: Colors.primary,
			border: Colors.primary,
			text: Colors.primaryForeground,
			icon: Colors.primaryForeground,
		},
	};

	const colors = variantColors[variant];

	return (
		<View style={[styles.container, { backgroundColor: colors.bg, borderColor: colors.border }]}>
			{iconName && (
				<Ionicons name={iconName} size={20} color={colors.icon} style={styles.icon} />
			)}
			<View style={styles.content}>
				{title && <Text style={[styles.title, { color: colors.text }]}>{title}</Text>}
				{description && (
					<Text style={[styles.description, { color: colors.text }]}>{description}</Text>
				)}
				{children}
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		padding: Spacing.md,
		borderRadius: Radius.lg,
		borderWidth: 1,
		marginBottom: Spacing.md,
	},
	icon: {
		marginRight: Spacing.sm,
	},
	content: {
		flex: 1,
	},
	title: {
		fontSize: Typography.fontSize.base,
		fontWeight: Typography.fontWeight.semibold,
		marginBottom: Spacing.xs,
	},
	description: {
		fontSize: Typography.fontSize.sm,
		lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.sm,
	},
});

