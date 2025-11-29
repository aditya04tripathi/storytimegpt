import { Switch as RNSwitch } from "react-native";
import { Colors } from "@/theme/colors";

type SwitchProps = {
	value: boolean;
	onValueChange: (value: boolean) => void;
	disabled?: boolean;
};

export function Switch({
	value,
	onValueChange,
	disabled = false,
}: SwitchProps) {
	return (
		<RNSwitch
			value={value}
			onValueChange={onValueChange}
			disabled={disabled}
			trackColor={{
				false: Colors.muted,
				true: Colors.primary,
			}}
			thumbColor={value ? Colors.primaryForeground : Colors.mutedForeground}
			ios_backgroundColor={Colors.muted}
		/>
	);
}
