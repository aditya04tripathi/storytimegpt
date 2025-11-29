import { Button } from "@/components/common/Button";
import { Spacer, Stack, Text, View } from "@/components/ui";

export default function HomeScreen() {
	return (
		<View variant="default" padding="lg">
			<Stack direction="column" align="center" justify="center">
				<Text variant="default" size="4xl" weight="bold">
					StorytimeGPT
				</Text>
				<Text variant="muted" size="base">
					Generate your personalized stories
				</Text>
				<Spacer size="sm" />
				<Button
					title="Generate Story"
					onPress={() => {
						// TODO: Implement story generation
					}}
				/>
			</Stack>
		</View>
	);
}
