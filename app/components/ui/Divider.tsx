import { Spacing } from "@/theme/spacing";
import { Separator } from "./Separator";

type DividerProps = {
	margin?: keyof typeof Spacing;
	orientation?: "horizontal" | "vertical";
};

export function Divider({
	margin = "md",
	orientation = "horizontal",
}: DividerProps) {
	const marginValue: number = Spacing[margin] as number;
	return <Separator orientation={orientation} margin={marginValue} />;
}
