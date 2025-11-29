import { View } from "react-native";
import { Spacing } from "@/theme/spacing";

type SpacerProps = {
	size?: keyof typeof Spacing;
	horizontal?: boolean;
};

export function Spacer({ size = "md", horizontal = false }: SpacerProps) {
	const spacingValue: number = Spacing[size] as number;
	return (
		<View
			style={horizontal ? { width: spacingValue } : { height: spacingValue }}
		/>
	);
}
