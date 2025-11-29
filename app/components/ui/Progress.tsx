import { View, Text, StyleSheet } from "react-native";
import { Colors } from "@/theme/colors";
import { Radius } from "@/theme/radius";
import { Spacing } from "@/theme/spacing";
import { Typography } from "@/theme/typography";

type ProgressProps = {
	value: number; // 0-100
	showLabel?: boolean;
	label?: string;
};

export function Progress({ value, showLabel = false, label }: ProgressProps) {
	const clampedValue = Math.max(0, Math.min(100, value));

	return (
		<View style={styles.container}>
			{showLabel && (
				<View style={styles.labelContainer}>
					<Text style={styles.label}>{label || `${Math.round(clampedValue)}%`}</Text>
				</View>
			)}
			<View style={styles.track}>
				<View style={[styles.fill, { width: `${clampedValue}%` }]} />
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		width: "100%",
	},
	labelContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginBottom: Spacing.xs,
	},
	label: {
		fontSize: Typography.fontSize.sm,
		color: Colors.foreground,
	},
	track: {
		height: 8,
		backgroundColor: Colors.muted,
		borderRadius: Radius.full,
		overflow: "hidden",
	},
	fill: {
		height: "100%",
		backgroundColor: Colors.primary,
		borderRadius: Radius.full,
	},
});

