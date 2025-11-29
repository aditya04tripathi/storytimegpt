import type { ReactNode } from "react";
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
	right?: ReactNode;
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
	right,
}: InputProps) {
	return (
		<View style={styles.container}>
			{label && <Text style={styles.label}>{label}</Text>}
			<View style={styles.inputWrapper}>
				<TextInput
					style={[
						styles.input,
						error && styles.inputError,
						disabled && styles.inputDisabled,
						multiline && styles.inputMultiline,
						right && styles.inputWithRight,
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
				{right && <View style={styles.rightContainer}>{right}</View>}
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
	inputWrapper: {
		position: "relative",
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
	inputWithRight: {
		paddingRight: 50,
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
	rightContainer: {
		position: "absolute",
		right: Spacing.sm,
		top: 0,
		bottom: 0,
		justifyContent: "center",
		alignItems: "center",
	},
	errorText: {
		fontSize: Typography.fontSize.sm,
		color: Colors.destructive,
		marginTop: Spacing.xs,
	},
});
