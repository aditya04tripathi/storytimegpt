import {
	type PressableProps,
	Pressable as RNPressable,
	StyleSheet,
	type ViewStyle,
} from "react-native";
import { Colors } from "@/theme/colors";
import { Radius } from "@/theme/radius";
import { Spacing } from "@/theme/spacing";

type PressableVariant = "default" | "primary" | "outline" | "ghost";

type StyledPressableProps = PressableProps & {
	variant?: PressableVariant;
	padding?: keyof typeof Spacing;
	rounded?: keyof typeof Radius;
	children: React.ReactNode;
};

export function Pressable({
	variant = "default",
	padding = "md",
	rounded = "lg",
	style,
	children,
	...props
}: StyledPressableProps) {
	const variantStyles = {
		default: styles.default,
		primary: styles.primary,
		outline: styles.outline,
		ghost: styles.ghost,
	};

	const paddingValue: number = Spacing[padding] as number;
	const roundedValue: number = Radius[rounded] as number;
	return (
		<RNPressable
			style={({ pressed }): ViewStyle[] => [
				variantStyles[variant],
				{
					padding: paddingValue,
					borderRadius: roundedValue,
					opacity: pressed ? 0.7 : 1,
				},
				style as ViewStyle,
			]}
			{...props}
		>
			{children}
		</RNPressable>
	);
}

const styles = StyleSheet.create({
	default: {
		backgroundColor: Colors.accent,
	},
	primary: {
		backgroundColor: Colors.primary,
	},
	outline: {
		backgroundColor: "transparent",
		borderWidth: 1,
		borderColor: Colors.border,
	},
	ghost: {
		backgroundColor: "transparent",
	},
});
