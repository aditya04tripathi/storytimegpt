import type { ViewProps } from "react-native";
import { StyleSheet, View } from "react-native";
import { Colors } from "@/theme/colors";
import { Spacing } from "@/theme/spacing";

type ContainerProps = ViewProps & {
	children: React.ReactNode;
	padding?: keyof typeof Spacing;
	maxWidth?: number;
};

export function Container({
	children,
	padding = "md",
	maxWidth,
	style,
	...props
}: ContainerProps) {
	const paddingValue: number = Spacing[padding] as number;
	return (
		<View
			style={[
				styles.container,
				{ padding: paddingValue },
				maxWidth ? { maxWidth } : undefined,
				style,
			]}
			{...props}
		>
			{children}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.background,
	},
});
