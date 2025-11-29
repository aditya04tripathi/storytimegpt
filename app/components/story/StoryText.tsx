import { useState } from "react";
import { Text, View } from "@/components/ui";
import { Typography } from "@/theme/typography";
import { VocabularyPopup } from "./VocabularyPopup";

type StoryTextProps = {
	text: string;
};

export function StoryText({ text }: StoryTextProps) {
	const [selectedWord, setSelectedWord] = useState<string | null>(null);

	const words = text.split(/\s+/);

	const handleWordPress = (word: string) => {
		// TODO: Get word position for popup
		setSelectedWord(word);
	};

	return (
		<View variant="default" style={{ marginBottom: 16 }}>
			<Text
				variant="default"
				size="base"
				style={{
					lineHeight: Typography.lineHeight.normal * Typography.fontSize.base,
				}}
			>
				{words.map((word, index) => {
					const uniqueKey = `${word}-${index}-${text.substring(0, 10)}`;
					return (
						<Text
							key={uniqueKey}
							variant="default"
							onPress={() => handleWordPress(word)}
						>
							{word}{" "}
						</Text>
					);
				})}
			</Text>
			{selectedWord && (
				<VocabularyPopup
					word={selectedWord}
					onClose={() => setSelectedWord(null)}
				/>
			)}
		</View>
	);
}
