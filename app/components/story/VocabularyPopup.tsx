import { Ionicons } from "@expo/vector-icons";
import { Modal } from "react-native";
import { Pressable, Stack, Text, View } from "@/components/ui";
import { Colors } from "@/theme/colors";
import { Spacing } from "@/theme/spacing";

type VocabularyPopupProps = {
	word: string;
	onClose: () => void;
};

export function VocabularyPopup({ word, onClose }: VocabularyPopupProps) {
	const definition = `Definition for "${word}" would appear here.`;

	return (
		<Modal visible={true} transparent animationType="fade">
			<Pressable
				variant="ghost"
				style={{
					flex: 1,
					backgroundColor: "rgba(0, 0, 0, 0.5)",
					justifyContent: "center",
					alignItems: "center",
				}}
				onPress={onClose}
			>
				<View
					variant="card"
					padding="lg"
					rounded="lg"
					style={{
						width: "80%",
						maxWidth: 400,
					}}
				>
					<Stack
						direction="row"
						spacing="md"
						justify="between"
						align="center"
						style={{ marginBottom: Spacing.sm }}
					>
						<Text variant="default" size="xl" weight="bold">
							{word}
						</Text>
						<Pressable variant="ghost" onPress={onClose} padding="xs">
							<Ionicons name="close" size={24} color={Colors.foreground} />
						</Pressable>
					</Stack>
					<Text variant="muted" size="base">
						{definition}
					</Text>
				</View>
			</Pressable>
		</Modal>
	);
}
