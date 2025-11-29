import { Image, type ImageSource } from "expo-image";
import { View } from "@/components/ui";
import { Radius } from "@/theme/radius";
import { Spacing } from "@/theme/spacing";

type InlineImageProps = {
	source: ImageSource;
	alt?: string;
};

export function InlineImage({ source, alt }: InlineImageProps) {
	return (
		<View
			variant="default"
			style={{
				marginVertical: Spacing.md,
				alignItems: "center",
			}}
		>
			<Image
				source={source}
				style={{
					width: "100%",
					height: 200,
					borderRadius: Radius.lg,
				}}
				contentFit="contain"
				accessibilityLabel={alt}
			/>
		</View>
	);
}
