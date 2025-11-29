import {
	SafeAreaView as RNSafeAreaView,
	StyleSheet,
	type ViewProps,
} from "react-native";
import { Colors } from "@/theme/colors";

type StyledSafeAreaViewProps = ViewProps & {
	children: React.ReactNode;
};

export function SafeAreaView({
	children,
	style,
	...props
}: StyledSafeAreaViewProps) {
	return (
		<RNSafeAreaView style={[styles.container, style]} {...props}>
			{children}
		</RNSafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.background,
	},
});
