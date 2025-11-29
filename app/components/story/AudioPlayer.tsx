import { Ionicons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import { useEffect, useState } from "react";
import { Pressable, Text, View } from "@/components/ui";
import { logError } from "@/services/errorLogger";
import { Colors } from "@/theme/colors";
import { Spacing } from "@/theme/spacing";

type AudioPlayerProps = {
	source: { uri: string };
};

export function AudioPlayer({ source }: AudioPlayerProps) {
	const [sound, setSound] = useState<Audio.Sound | null>(null);
	const [isPlaying, setIsPlaying] = useState(false);
	const [position] = useState(0);
	const [duration, setDuration] = useState(0);

	useEffect(() => {
		return () => {
			sound?.unloadAsync();
		};
	}, [sound]);

	const loadAudio = async () => {
		try {
			const { sound: audioSound } = await Audio.Sound.createAsync(source);
			setSound(audioSound);
			const status = await audioSound.getStatusAsync();
			if (status.isLoaded) {
				setDuration(status.durationMillis || 0);
			}
		} catch (error) {
			await logError(error, "medium", {
				component: "AudioPlayer",
				action: "load_audio",
				metadata: { source: source.uri },
			});
		}
	};

	const togglePlayback = async () => {
		if (!sound) {
			await loadAudio();
			return;
		}

		if (isPlaying) {
			await sound.pauseAsync();
		} else {
			await sound.playAsync();
		}
		setIsPlaying(!isPlaying);
	};

	return (
		<View
			variant="muted"
			padding="md"
			rounded="lg"
			style={{
				flexDirection: "row",
				alignItems: "center",
				marginVertical: Spacing.md,
			}}
		>
			<Pressable variant="ghost" onPress={togglePlayback} padding="sm">
				<Ionicons
					name={isPlaying ? "pause" : "play"}
					size={24}
					color={Colors.primary}
				/>
			</Pressable>
			<Text variant="muted" size="sm">
				{Math.floor(position / 1000)}s / {Math.floor(duration / 1000)}s
			</Text>
		</View>
	);
}
