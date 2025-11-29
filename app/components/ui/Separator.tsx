import { StyleSheet, View } from "react-native";
import { Colors } from "@/theme/colors";

type SeparatorProps = {
	orientation?: "horizontal" | "vertical";
	margin?: number;
};

export function Separator({
	orientation = "horizontal",
	margin,
}: SeparatorProps) {
	return (
		<View
			style={[
				styles.separator,
				orientation === "horizontal" ? styles.horizontal : styles.vertical,
				margin !== undefined && {
					marginVertical: orientation === "horizontal" ? margin : 0,
					marginHorizontal: orientation === "vertical" ? margin : 0,
				},
			]}
		/>
	);
}

const styles = StyleSheet.create({
	separator: {
		backgroundColor: Colors.border,
	},
	horizontal: {
		height: 1,
		width: "100%",
	},
	vertical: {
		width: 1,
		height: "100%",
	},
});
