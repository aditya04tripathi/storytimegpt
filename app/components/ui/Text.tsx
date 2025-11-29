import { Text as RNText, StyleSheet, type TextProps } from "react-native";
import { Colors } from "@/theme/colors";
import { Typography } from "@/theme/typography";

type TextVariant =
	| "default"
	| "muted"
	| "primary"
	| "destructive"
	| "secondary";

type StyledTextProps = TextProps & {
	variant?: TextVariant;
	size?: keyof typeof Typography.fontSize;
	weight?: keyof typeof Typography.fontWeight;
	children: React.ReactNode;
};

export function Text({
	variant = "default",
	size = "base",
	weight = "normal",
	style,
	children,
	...props
}: StyledTextProps) {
	const variantStyles = {
		default: styles.default,
		muted: styles.muted,
		primary: styles.primary,
		destructive: styles.destructive,
		secondary: styles.secondary,
	};

	return (
		<RNText
			style={[
				styles.base,
				variantStyles[variant],
				{
					fontSize: Typography.fontSize[size],
					fontWeight: Typography.fontWeight[weight],
				},
				style,
			]}
			{...props}
		>
			{children}
		</RNText>
	);
}

const styles = StyleSheet.create({
	base: {
		color: Colors.foreground,
	},
	default: {
		color: Colors.foreground,
	},
	muted: {
		color: Colors.mutedForeground,
	},
	primary: {
		color: Colors.primary,
	},
	destructive: {
		color: Colors.destructive,
	},
	secondary: {
		color: Colors.secondaryForeground,
	},
});
