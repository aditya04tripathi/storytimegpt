import { ActivityIndicator } from "react-native";
import { View } from "@/components/ui";
import { Colors } from "@/theme/colors";

type LottieLoadingProps = {
	size?: "small" | "large";
};

export function LottieLoading({ size = "large" }: LottieLoadingProps) {
	// TODO: Replace with Lottie animation
	return (
		<View
			variant="default"
			style={{
				flex: 1,
				justifyContent: "center",
				alignItems: "center",
			}}
		>
			<ActivityIndicator size={size} color={Colors.primary} />
		</View>
	);
}
