import { View as RNView, StyleSheet, type ViewProps } from "react-native";
import { Colors } from "@/theme/colors";
import { Radius } from "@/theme/radius";
import { Shadows } from "@/theme/shadows";
import { Spacing } from "@/theme/spacing";

type ViewVariant = "default" | "card" | "muted" | "primary" | "accent";

type StyledViewProps = ViewProps & {
	variant?: ViewVariant;
	padding?: keyof typeof Spacing;
	paddingX?: keyof typeof Spacing;
	paddingY?: keyof typeof Spacing;
	rounded?: keyof typeof Radius;
	shadow?: "sm" | "md" | "lg" | "xl" | null;
	children?: React.ReactNode;
	onPress?: () => void;
};

export function View({
	variant = "default",
	padding,
	paddingX,
	paddingY,
	rounded,
	shadow,
	style,
	children,
	...props
}: StyledViewProps) {
	const variantStyles = {
		default: {},
		card: styles.card,
		muted: styles.muted,
		primary: styles.primary,
		accent: styles.accent,
	};

	const paddingStyle = padding ? { padding: Spacing[padding] } : {};
	const paddingXStyle = paddingX
		? { paddingHorizontal: Spacing[paddingX] }
		: {};
	const paddingYStyle = paddingY ? { paddingVertical: Spacing[paddingY] } : {};
	const roundedStyle = rounded ? { borderRadius: Radius[rounded] } : {};
	const shadowStyle = shadow ? Shadows[shadow] : {};

	return (
		<RNView
			onPress={props.onPress ? props.onPress : undefined}
			style={[
				styles.base,
				variantStyles[variant],
				paddingStyle,
				paddingXStyle,
				paddingYStyle,
				roundedStyle,
				shadowStyle,
				style,
			]}
			{...props}
		>
			{children}
		</RNView>
	);
}

const styles = StyleSheet.create({
	base: {
		backgroundColor: Colors.background,
		flex: 1,
	},
	card: {
		backgroundColor: Colors.card,
	},
	muted: {
		backgroundColor: Colors.muted,
	},
	primary: {
		backgroundColor: Colors.primary,
	},
	accent: {
		backgroundColor: Colors.accent,
	},
});
