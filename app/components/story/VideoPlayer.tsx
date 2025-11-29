import { ResizeMode, Video } from "expo-av";
import { View } from "@/components/ui";
import { Spacing } from "@/theme/spacing";

type VideoPlayerProps = {
	source: { uri: string };
};

export function VideoPlayer({ source }: VideoPlayerProps) {
	return (
		<View
			variant="default"
			style={{
				marginVertical: Spacing.md,
			}}
		>
			<Video
				source={source}
				style={{
					width: "100%",
					height: 200,
				}}
				useNativeControls
				resizeMode={ResizeMode.CONTAIN}
			/>
		</View>
	);
}
