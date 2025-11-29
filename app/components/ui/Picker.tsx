import { Picker as RNPicker } from "@react-native-picker/picker";
import { Platform, StyleSheet, Text, View } from "react-native";
import { Colors } from "@/theme/colors";
import { Radius } from "@/theme/radius";
import { Spacing } from "@/theme/spacing";
import { Typography } from "@/theme/typography";

type PickerItem<T> = {
	label: string;
	value: T;
};

type PickerProps<T> = {
	label?: string;
	error?: string;
	selectedValue: T;
	onValueChange: (value: T) => void;
	items: PickerItem<T>[];
	disabled?: boolean;
	placeholder?: string;
};

export function Picker<T extends string | number>({
	label,
	error,
	selectedValue,
	onValueChange,
	items,
	disabled = false,
	placeholder,
}: PickerProps<T>) {
	return (
		<View style={styles.container}>
			{label && <Text style={styles.label}>{label}</Text>}
			<View
				style={[
					styles.pickerContainer,
					error && styles.pickerError,
					disabled && styles.pickerDisabled,
				]}
			>
				<RNPicker
					selectedValue={selectedValue}
					onValueChange={onValueChange}
					style={styles.picker}
					enabled={!disabled}
					dropdownIconColor={Colors.foreground}
				>
					{placeholder && (
						<RNPicker.Item
							label={placeholder}
							value={null as unknown as T}
							enabled={false}
						/>
					)}
					{items.map((item) => (
						<RNPicker.Item
							key={String(item.value)}
							label={item.label}
							value={item.value}
							color={Platform.OS === "ios" ? Colors.foreground : undefined}
						/>
					))}
				</RNPicker>
			</View>
			{error && <Text style={styles.errorText}>{error}</Text>}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		marginBottom: Spacing.none,
	},
	label: {
		fontSize: Typography.fontSize.sm,
		fontWeight: Typography.fontWeight.medium,
		color: Colors.foreground,
		marginBottom: Spacing.sm,
	},
	pickerContainer: {
		backgroundColor: Colors.input,
		borderColor: Colors.border,
		borderWidth: 1,
		borderRadius: Radius.lg,
		overflow: "hidden",
		minHeight: 44,
	},
	picker: {
		color: Colors.foreground,
		height: Platform.OS === "ios" ? 200 : 44,
	},
	pickerError: {
		borderColor: Colors.destructive,
	},
	pickerDisabled: {
		opacity: 0.5,
	},
	errorText: {
		fontSize: Typography.fontSize.sm,
		color: Colors.destructive,
		marginTop: Spacing.xs,
	},
});
