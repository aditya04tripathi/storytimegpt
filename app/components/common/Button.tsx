import {
	ActivityIndicator,
	type StyleProp,
	StyleSheet,
	Text,
	TouchableOpacity,
	type ViewStyle,
} from "react-native";
import { Colors } from "@/theme/colors";
import { Radius } from "@/theme/radius";
import { Spacing } from "@/theme/spacing";
import { Typography } from "@/theme/typography";

type ButtonProps = {
	title: string;
	onPress: () => void;
	variant?: "primary" | "outline" | "danger";
	loading?: boolean;
	disabled?: boolean;
	style?: StyleProp<ViewStyle>;
};

export function Button({
	title,
	onPress,
	variant = "primary",
	loading = false,
	disabled = false,
	style,
}: ButtonProps) {
	return (
		<TouchableOpacity
			style={[
				styles.button,
				variant === "outline" && styles.buttonOutline,
				variant === "danger" && styles.buttonDanger,
				(disabled || loading) && styles.buttonDisabled,
				style,
			]}
			onPress={onPress}
			disabled={disabled || loading}
		>
			{loading ? (
				<ActivityIndicator color={variant === "outline" ? "#007AFF" : "#fff"} />
			) : (
				<Text
					style={[
						styles.text,
						variant === "outline" && styles.textOutline,
						variant === "danger" && styles.textDanger,
					]}
				>
					{title}
				</Text>
			)}
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	button: {
		backgroundColor: Colors.primary,
		paddingVertical: Spacing.md,
		paddingHorizontal: Spacing.lg,
		borderRadius: Radius.lg,
		alignItems: "center",
		justifyContent: "center",
		minHeight: 44,
	},
	buttonOutline: {
		backgroundColor: "transparent",
		borderWidth: 1,
		borderColor: Colors.primary,
	},
	buttonDanger: {
		backgroundColor: Colors.destructive,
	},
	buttonDisabled: {
		opacity: 0.5,
	},
	text: {
		color: Colors.primaryForeground,
		fontSize: Typography.fontSize.base,
		fontWeight: Typography.fontWeight.semibold,
	},
	textOutline: {
		color: Colors.primary,
	},
	textDanger: {
		color: Colors.destructiveForeground,
	},
});
