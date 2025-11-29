import { Text, StyleSheet, type TextProps } from "react-native";
import { Colors } from "@/theme/colors";
import { Typography as TypographyTheme } from "@/theme/typography";

type TypographyProps = TextProps & {
	variant?: "h1" | "h2" | "h3" | "h4" | "body" | "small" | "caption";
	color?: keyof typeof Colors;
};

export function Typography({
	variant = "body",
	color,
	style,
	...props
}: TypographyProps) {
	const colorValue = color ? Colors[color as keyof typeof Colors] : Colors.foreground;

	return (
		<Text
			style={[
				styles.base,
				styles[variant],
				{ color: colorValue },
				style,
			]}
			{...props}
		/>
	);
}

const styles = StyleSheet.create({
	base: {
		color: Colors.foreground,
	},
	h1: {
		fontSize: TypographyTheme.fontSize["4xl"],
		fontWeight: TypographyTheme.fontWeight.bold,
		lineHeight: TypographyTheme.lineHeight.tight * TypographyTheme.fontSize["4xl"],
	},
	h2: {
		fontSize: TypographyTheme.fontSize["3xl"],
		fontWeight: TypographyTheme.fontWeight.bold,
		lineHeight: TypographyTheme.lineHeight.tight * TypographyTheme.fontSize["3xl"],
	},
	h3: {
		fontSize: TypographyTheme.fontSize["2xl"],
		fontWeight: TypographyTheme.fontWeight.semibold,
		lineHeight: TypographyTheme.lineHeight.snug * TypographyTheme.fontSize["2xl"],
	},
	h4: {
		fontSize: TypographyTheme.fontSize.xl,
		fontWeight: TypographyTheme.fontWeight.semibold,
		lineHeight: TypographyTheme.lineHeight.snug * TypographyTheme.fontSize.xl,
	},
	body: {
		fontSize: TypographyTheme.fontSize.base,
		fontWeight: TypographyTheme.fontWeight.normal,
		lineHeight: TypographyTheme.lineHeight.normal * TypographyTheme.fontSize.base,
	},
	small: {
		fontSize: TypographyTheme.fontSize.sm,
		fontWeight: TypographyTheme.fontWeight.normal,
		lineHeight: TypographyTheme.lineHeight.normal * TypographyTheme.fontSize.sm,
	},
	caption: {
		fontSize: TypographyTheme.fontSize.xs,
		fontWeight: TypographyTheme.fontWeight.normal,
		lineHeight: TypographyTheme.lineHeight.normal * TypographyTheme.fontSize.xs,
	},
});

