import { StyleSheet, Text, TextInput, View } from "react-native";
import { Colors } from "@/theme/colors";
import { Radius } from "@/theme/radius";
import { Spacing } from "@/theme/spacing";
import { Typography } from "@/theme/typography";

type InputProps = {
	label?: string;
	error?: string;
	placeholder?: string;
	value: string;
	onChangeText: (text: string) => void;
	secureTextEntry?: boolean;
	keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
	autoCapitalize?: "none" | "sentences" | "words" | "characters";
	autoCorrect?: boolean;
	multiline?: boolean;
	numberOfLines?: number;
	disabled?: boolean;
};

export function Input({
	label,
	error,
	placeholder,
	value,
	onChangeText,
	secureTextEntry = false,
	keyboardType = "default",
	autoCapitalize = "sentences",
	autoCorrect = true,
	multiline = false,
	numberOfLines = 1,
	disabled = false,
}: InputProps) {
	return (
		<View style={styles.container}>
			{label && <Text style={styles.label}>{label}</Text>}
			<TextInput
				style={[
					styles.input,
					error && styles.inputError,
					disabled && styles.inputDisabled,
					multiline && styles.inputMultiline,
				]}
				placeholder={placeholder}
				placeholderTextColor={Colors.mutedForeground}
				value={value}
				onChangeText={onChangeText}
				secureTextEntry={secureTextEntry}
				keyboardType={keyboardType}
				autoCapitalize={autoCapitalize}
				autoCorrect={autoCorrect}
				multiline={multiline}
				numberOfLines={numberOfLines}
				editable={!disabled}
			/>
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
	input: {
		backgroundColor: Colors.input,
		borderColor: Colors.border,
		borderWidth: 1,
		borderRadius: Radius.lg,
		paddingHorizontal: Spacing.md,
		paddingVertical: Spacing.sm,
		fontSize: Typography.fontSize.base,
		color: Colors.foreground,
		minHeight: 44,
	},
	inputMultiline: {
		minHeight: 100,
		textAlignVertical: "top",
	},
	inputError: {
		borderColor: Colors.destructive,
	},
	inputDisabled: {
		opacity: 0.5,
	},
	errorText: {
		fontSize: Typography.fontSize.sm,
		color: Colors.destructive,
		marginTop: Spacing.xs,
	},
});
