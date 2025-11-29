import { Text, StyleSheet } from "react-native";
import { Colors } from "@/theme/colors";
import { Typography } from "@/theme/typography";
import { Spacing } from "@/theme/spacing";

type LabelProps = {
	children: React.ReactNode;
	required?: boolean;
	error?: boolean;
};

export function Label({ children, required, error }: LabelProps) {
	return (
		<Text style={[styles.label, error && styles.labelError]}>
			{children}
			{required && <Text style={styles.required}> *</Text>}
		</Text>
	);
}

const styles = StyleSheet.create({
	label: {
		fontSize: Typography.fontSize.sm,
		fontWeight: Typography.fontWeight.medium,
		color: Colors.foreground,
		marginBottom: Spacing.xs,
	},
	labelError: {
		color: Colors.destructive,
	},
	required: {
		color: Colors.destructive,
	},
});

