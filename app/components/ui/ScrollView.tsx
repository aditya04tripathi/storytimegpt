import {
	ScrollView as RNScrollView,
	type ScrollViewProps,
	StyleSheet,
} from "react-native";
import { Colors } from "@/theme/colors";
import { Spacing } from "@/theme/spacing";

type StyledScrollViewProps = ScrollViewProps & {
	children: React.ReactNode;
	contentPadding?: keyof typeof Spacing;
};

export function ScrollView({
	children,
	contentPadding,
	contentContainerStyle,
	style,
	...props
}: StyledScrollViewProps) {
	const paddingValue: number | undefined = contentPadding
		? (Spacing[contentPadding] as number)
		: undefined;
	const paddingStyle = paddingValue ? { padding: paddingValue } : {};

	return (
		<RNScrollView
			style={[styles.scrollView, style]}
			contentContainerStyle={[
				styles.content,
				paddingStyle,
				contentContainerStyle,
			]}
			{...props}
		>
			{children}
		</RNScrollView>
	);
}

const styles = StyleSheet.create({
	scrollView: {
		backgroundColor: Colors.background,
	},
	content: {
		flexGrow: 1,
	},
});
