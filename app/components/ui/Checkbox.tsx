import { TouchableOpacity, View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/theme/colors";
import { Radius } from "@/theme/radius";
import { Spacing } from "@/theme/spacing";

type CheckboxProps = {
	checked: boolean;
	onChange: (checked: boolean) => void;
	label?: string;
	disabled?: boolean;
};

export function Checkbox({ checked, onChange, label, disabled = false }: CheckboxProps) {
	return (
		<TouchableOpacity
			style={styles.container}
			onPress={() => !disabled && onChange(!checked)}
			disabled={disabled}
			activeOpacity={0.7}
		>
			<View
				style={[
					styles.checkbox,
					checked && styles.checkboxChecked,
					disabled && styles.checkboxDisabled,
				]}
			>
				{checked && (
					<Ionicons name="checkmark" size={16} color={Colors.primaryForeground} />
				)}
			</View>
			{label && (
				<View style={styles.labelContainer}>
				</View>
			)}
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		alignItems: "center",
	},
	checkbox: {
		width: 20,
		height: 20,
		borderWidth: 2,
		borderColor: Colors.border,
		borderRadius: Radius.sm,
		backgroundColor: Colors.input,
		justifyContent: "center",
		alignItems: "center",
	},
	checkboxChecked: {
		backgroundColor: Colors.primary,
		borderColor: Colors.primary,
	},
	checkboxDisabled: {
		opacity: 0.5,
	},
	labelContainer: {
		marginLeft: Spacing.sm,
	},
});

