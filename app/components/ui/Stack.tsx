import {
	type FlexAlignType,
	StyleSheet,
	View,
	type ViewProps,
} from "react-native";
import { Spacing } from "@/theme/spacing";

type StackProps = ViewProps & {
	children: React.ReactNode;
	direction?: "row" | "column";
	spacing?: keyof typeof Spacing;
	align?: "start" | "center" | "end" | "stretch";
	justify?: "start" | "center" | "end" | "between" | "around" | "evenly";
	wrap?: boolean;
	expand?: boolean;
};

export function Stack({
	children,
	direction = "column",
	spacing = "sm",
	align = "stretch",
	justify = "start",
	wrap = false,
	expand = true,
	style,
	...props
}: StackProps) {
	const alignMap: Record<string, FlexAlignType> = {
		start: "flex-start",
		center: "center",
		end: "flex-end",
		stretch: "stretch",
	};

	const justifyMap: Record<
		string,
		| "flex-start"
		| "center"
		| "flex-end"
		| "space-between"
		| "space-around"
		| "space-evenly"
	> = {
		start: "flex-start",
		center: "center",
		end: "flex-end",
		between: "space-between",
		around: "space-around",
		evenly: "space-evenly",
	};

	const spacingValue: number = Spacing[spacing] as number;
	return (
		<View
			style={[
				styles.stack,
				{
					flex: expand ? 1 : undefined,
					flexDirection: direction,
					alignItems: alignMap[align],
					justifyContent: justifyMap[justify],
					flexWrap: wrap ? "wrap" : "nowrap",
					gap: spacingValue,
				},
				style,
			]}
			{...props}
		>
			{children}
		</View>
	);
}

const styles = StyleSheet.create({
	stack: {},
});
