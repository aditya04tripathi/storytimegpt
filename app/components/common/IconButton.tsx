import { TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type IconButtonProps = {
	name: keyof typeof Ionicons.glyphMap;
	size?: number;
	color?: string;
	onPress: () => void;
};

export function IconButton({
	name,
	size = 24,
	color = "#007AFF",
	onPress,
}: IconButtonProps) {
	return (
		<TouchableOpacity style={styles.button} onPress={onPress}>
			<Ionicons name={name} size={size} color={color} />
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	button: {
		padding: 8,
	},
});

