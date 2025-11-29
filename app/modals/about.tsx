import Constants from "expo-constants";
import { Link } from "expo-router";
import { SafeAreaView, ScrollView, Stack, Text } from "@/components/ui";
import { Colors } from "@/theme";

export default function AboutModal() {
	const appVersion = Constants.expoConfig?.version || "1.0.0";
	const buildNumber =
		Constants.expoConfig?.ios?.buildNumber ||
		Constants.expoConfig?.android?.versionCode ||
		"N/A";

	return (
		<SafeAreaView>
			<ScrollView contentPadding="lg">
				<Stack direction="column" spacing="lg">
					<Stack direction="column" spacing="sm">
						<Text variant="default" size="4xl" weight="bold">
							About StorytimeGPT
						</Text>
						<Text variant="muted" weight="bold" size="base">
							Version {appVersion} (Build {buildNumber})
						</Text>
					</Stack>

					<Stack direction="column" spacing="sm">
						<Text variant="default" size="xl" weight="semibold">
							Overview
						</Text>
						<Text variant="muted" size="base">
							StorytimeGPT is a cross-platform mobile application that enables
							users to generate personalized stories using AI, read stories with
							rich media (images, audio, video), access vocabulary definitions
							and interactive learning features, work offline with cached
							content, and manage subscriptions and profiles.
						</Text>
					</Stack>

					<Stack direction="column" spacing="sm">
						<Text variant="default" size="xl" weight="semibold">
							Technology
						</Text>
						<Text variant="muted" size="base">
							Built with Expo for seamless cross-platform development (iOS,
							Android, Web). Powered by Firebase for authentication, database,
							storage, and real-time updates.
						</Text>
					</Stack>

					<Stack direction="column" spacing="sm">
						<Text variant="default" size="xl" weight="semibold">
							Key Features
						</Text>
						<Text variant="muted" size="base">
							AI-powered story generation
						</Text>
						<Text variant="muted" size="base">
							Rich media support (images, audio, video)
						</Text>
						<Text variant="muted" size="base">
							Interactive vocabulary learning
						</Text>
						<Text variant="muted" size="base">
							Offline reading with cached content
						</Text>
						<Text variant="muted" size="base">
							Subscription management
						</Text>
						<Text variant="muted" size="base">
							Personalized user profiles
						</Text>
					</Stack>

					<Stack direction="column" spacing="sm">
						<Text variant="default" size="xl" weight="semibold">
							Creator
						</Text>
						<Text variant="muted" size="base">
							StorytimeGPT is developed and maintained by{" "}
							<Link
								style={{ color: Colors.primary }}
								href="https://adityatripathi.dev"
							>
								Aditya Tripathi
							</Link>
							.
						</Text>
					</Stack>

					<Stack direction="column" spacing="sm">
						<Text variant="default" size="xl" weight="semibold">
							Contact & Support
						</Text>
						<Text variant="muted" size="base">
							Website:{" "}
							<Link
								style={{ color: Colors.primary }}
								href="https://adityatripathi.dev"
							>
								https://adityatripathi.dev
							</Link>
						</Text>
						<Text variant="muted" size="base">
							GitHub:{" "}
							<Link
								style={{ color: Colors.primary }}
								href="https://github.com/aditya04tripathi/storytimegpt"
							>
								https://github.com/aditya04tripathi/storytimegpt
							</Link>
						</Text>
						<Text variant="muted" size="base">
							Issues:{" "}
							<Link
								style={{ color: Colors.primary }}
								href="https://github.com/aditya04tripathi/storytimegpt/issues"
							>
								Report a bug or request a feature
							</Link>
						</Text>
					</Stack>

					<Stack direction="column" spacing="sm">
						<Text variant="default" size="xl" weight="semibold">
							License
						</Text>
						<Text variant="muted" size="base">
							This project is licensed under the MIT License with Commons Clause
							restriction. See the{" "}
							<Link
								style={{ color: Colors.primary }}
								href="https://github.com/aditya04tripathi/storytimegpt/blob/main/LICENSE"
							>
								LICENSE
							</Link>{" "}
							file for details.
						</Text>
					</Stack>

					<Stack direction="column" spacing="sm">
						<Text variant="default" size="xl" weight="semibold">
							Open Source
						</Text>
						<Text variant="muted" size="base">
							This project is open source. You can view the source code, learn
							from it, and contribute to its development. However, use,
							modification, and redistribution require explicit written
							permission from the creator.
						</Text>
					</Stack>
				</Stack>
			</ScrollView>
		</SafeAreaView>
	);
}
