import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator } from "react-native";
import { Button } from "@/components/common/Button";
import {
	Input,
	Picker,
	Pressable,
	ScrollView,
	Stack,
	Text,
	Textarea,
	View,
} from "@/components/ui";
import {
	cleanupFailedStoryGeneration,
	createStoryJob,
	deleteStoryJob,
	getStory,
	updateStory,
	updateStoryStatus,
} from "@/services/firebase/firestoreService";
import {
	deleteStoryJobRealtime,
	subscribeToStoryStatus,
	updateStoryStatusRealtime,
} from "@/services/firebase/realtimeService";
import { logError } from "@/services/errorLogger";
import { generateStory } from "@/services/storyGenerationService";
import { useAuthStore } from "@/state/authStore";
import { Colors } from "@/theme/colors";
import { Spacing } from "@/theme/spacing";
import { randomGenerators } from "@/utils/randomGenerators";
import { validators } from "@/utils/validators";

const RandomButton = ({ onPress }: { onPress: () => void }) => (
	<Pressable
		variant="ghost"
		onPress={onPress}
		style={{
			padding: Spacing.xs,
		}}
	>
		<Ionicons name="sparkles" size={20} color={Colors.primary} />
	</Pressable>
);

export default function HomeScreen() {
	const router = useRouter();
	const { user } = useAuthStore();
	const [title, setTitle] = useState("");
	const [prompt, setPrompt] = useState("");
	const [genre, setGenre] = useState(user?.favoriteGenres?.[0] || "");
	const getStoryLengthFromTier = (
		tier?: "free" | "silver" | "gold" | "platinum",
	): "short" | "medium" | "long" => {
		if (!tier) return "medium";
		switch (tier) {
			case "free":
				return "short";
			case "silver":
				return "medium";
			case "gold":
			case "platinum":
				return "long";
			default:
				return "medium";
		}
	};
	const [storyLength, setStoryLength] = useState<"short" | "medium" | "long">(
		getStoryLengthFromTier(user?.subscriptionTier),
	);

	useEffect(() => {
		const newLength = (() => {
			if (!user?.subscriptionTier) return "medium";
			switch (user.subscriptionTier) {
				case "free":
					return "short";
				case "silver":
					return "medium";
				case "gold":
				case "platinum":
					return "long";
				default:
					return "medium";
			}
		})();
		setStoryLength(newLength);
	}, [user?.subscriptionTier]);
	const [tone, setTone] = useState("");
	const [characterName, setCharacterName] = useState(user?.name || "");
	const [setting, setSetting] = useState("");
	const [ageGroup, setAgeGroup] = useState<
		"child" | "teen" | "adult" | "senior"
	>(user?.ageGroup || "child");
	const [languageProficiency, setLanguageProficiency] = useState<
		"beginner" | "intermediate" | "advanced" | "native"
	>(user?.languageProficiency || "beginner");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [isGenerating, setIsGenerating] = useState(false);
	const [generationProgress, setGenerationProgress] = useState(0);
	const [completedStoryId, setCompletedStoryId] = useState<string | null>(null);
	const [retryMessage, setRetryMessage] = useState<string | null>(null);
	const unsubscribeRef = useRef<(() => void) | null>(null);
	const jobIdRef = useRef<string | null>(null);
	const storyIdRef = useRef<string | null>(null);

	const handleRandomTitle = () => {
		setTitle(randomGenerators.title());
	};

	const handleRandomPrompt = () => {
		setPrompt(randomGenerators.prompt());
	};

	const handleRandomGenre = () => {
		setGenre(randomGenerators.genre());
	};

	const handleRandomTone = () => {
		setTone(randomGenerators.tone());
	};

	const handleRandomCharacterName = () => {
		setCharacterName(randomGenerators.characterName());
	};

	const handleRandomSetting = () => {
		setSetting(randomGenerators.setting());
	};

	const handleResetForm = () => {
		setTitle("");
		setPrompt("");
		setGenre(user?.favoriteGenres?.[0] || "");
		setTone("");
		setCharacterName(user?.name || "");
		setSetting("");
		setAgeGroup(user?.ageGroup || "child");
		setLanguageProficiency(user?.languageProficiency || "beginner");
		setError(null);
		setIsGenerating(false);
		setGenerationProgress(0);
		setCompletedStoryId(null);
		setRetryMessage(null);
		if (unsubscribeRef.current) {
			unsubscribeRef.current();
			unsubscribeRef.current = null;
		}
	};

	const buildFullPrompt = (): string => {
		let fullPrompt = prompt;

		if (title) {
			fullPrompt = `Title: ${title}\n\n${fullPrompt}`;
		}

		if (genre) {
			fullPrompt += `\n\nGenre: ${genre}`;
		}

		if (storyLength) {
			fullPrompt += `\n\nStory Length: ${storyLength}`;
		}

		if (tone) {
			fullPrompt += `\n\nTone: ${tone}`;
		}

		if (characterName) {
			fullPrompt += `\n\nMain Character: ${characterName}`;
		}

		if (setting) {
			fullPrompt += `\n\nSetting: ${setting}`;
		}

		if (ageGroup) {
			fullPrompt += `\n\nTarget Age Group: ${ageGroup}`;
		}

		if (languageProficiency) {
			fullPrompt += `\n\nLanguage Proficiency: ${languageProficiency}`;
		}

		return fullPrompt;
	};

	const generateStoryWithAPI = async (
		jobId: string,
		storyId: string,
		attempt = 1,
	): Promise<void> => {
		try {
			if (attempt === 1) {
				setRetryMessage(null);
			}

			const storyExists = await getStory(storyId);
			if (!storyExists) {
				throw new Error(
					"Story was not created in Firestore. Cannot proceed with generation.",
				);
			}

			try {
				await updateStoryStatusRealtime(jobId, "processing");
				await updateStoryStatus(storyId, "processing");
			} catch (updateError) {
				await logError(updateError, "low", {
					screen: "home",
					action: "update_story_status",
					metadata: { jobId, storyId, status: "processing" },
					userId: user?.id,
				}, user?.id);
			}
			setGenerationProgress(10);

			const storyRequest = {
				title: title || undefined,
				prompt: prompt,
				protagonist_name: characterName || "Character",
				age_group: ageGroup,
				language_proficiency: languageProficiency,
				story_length: storyLength,
				genre: genre || undefined,
				tone: tone || undefined,
				setting: setting || undefined,
			};

			setGenerationProgress(30);

			if (attempt > 1) {
				setRetryMessage(`Retrying generation... (Attempt ${attempt}/4)`);
			}

			const response = await generateStory(storyRequest);

			if (!response.okay) {
				const errorMsg = response.error || "Story generation failed";
				const error = new Error(errorMsg);
				await logError(error, "high", {
					screen: "home",
					action: "story_generation",
					metadata: { request: storyRequest, response },
					userId: user?.id,
				}, user?.id);
				throw error;
			}

			if (!response.story || response.story.trim().length === 0) {
				const errorMsg =
					"Story generation succeeded but no story content was returned";
				const error = new Error(errorMsg);
				await logError(error, "high", {
					screen: "home",
					action: "story_generation",
					metadata: { request: storyRequest, response },
					userId: user?.id,
				}, user?.id);
				throw error;
			}

			if (!response.title || response.title.trim().length === 0) {
				const errorMsg = "Story generation succeeded but no title was returned";
				const error = new Error(errorMsg);
				await logError(error, "high", {
					screen: "home",
					action: "story_generation",
					metadata: { request: storyRequest, response },
					userId: user?.id,
				}, user?.id);
				throw error;
			}

			setRetryMessage(null);
			setGenerationProgress(80);

			const finalTitle = response.title || title || "Untitled Story";

			const storyExistsBeforeUpdate = await getStory(storyId);
			if (!storyExistsBeforeUpdate) {
				const error = new Error("Story was not found in Firestore before update");
				await logError(error, "high", {
					screen: "home",
					action: "update_story",
					metadata: { storyId, jobId },
					userId: user?.id,
				}, user?.id);
				if (user?.id) {
					try {
						await Promise.all([
							deleteStoryJobRealtime(jobId),
							deleteStoryJob(jobId),
						]);
					} catch (cleanupError) {
						await logError(cleanupError, "medium", {
							screen: "home",
							action: "cleanup_job",
							metadata: { storyId, jobId },
							userId: user?.id,
						}, user?.id);
					}
				}
				throw error;
			}

			try {
				await updateStory(storyId, {
					title: finalTitle,
					text: response.story,
					settingPlace: response.setting_place,
					protagonistName: response.protagonist_name,
					status: "completed",
				});

				await updateStoryStatusRealtime(jobId, "completed");
				setGenerationProgress(100);

				router.push(`/library/${storyId}`);
			} catch (updateError: any) {
				if (
					updateError.message?.includes("does not exist") ||
					updateError.message?.includes("No document to update")
				) {
					await logError(updateError, "medium", {
						screen: "home",
						action: "update_story",
						metadata: { storyId, jobId, reason: "story_deleted" },
						userId: user?.id,
					}, user?.id);
					if (user?.id) {
						try {
							await Promise.all([
								deleteStoryJobRealtime(jobId),
								deleteStoryJob(jobId),
							]);
						} catch (cleanupError) {
							await logError(cleanupError, "medium", {
								screen: "home",
								action: "cleanup_job",
								metadata: { storyId, jobId },
								userId: user?.id,
							}, user?.id);
						}
					}
					throw new Error("Story was deleted during generation");
				}
				await logError(updateError, "high", {
					screen: "home",
					action: "update_story",
					metadata: { storyId, jobId },
					userId: user?.id,
				}, user?.id);
				throw updateError;
			}
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : "Story generation failed";

			await logError(err, "critical", {
				screen: "home",
				action: "story_generation",
				metadata: { jobId, storyId, attempt },
				userId: user?.id,
			}, user?.id);

			const isRetryableError =
				errorMessage.includes("500") ||
				errorMessage.includes("timeout") ||
				errorMessage.includes("ECONNABORTED");

			if (attempt < 4 && isRetryableError) {
				const delay = 1000 * 2 ** (attempt - 1);
				setRetryMessage(
					`Generation failed. Retrying in ${delay / 1000}s... (Attempt ${attempt}/4)`,
				);
				await new Promise((resolve) => setTimeout(resolve, delay));
				return generateStoryWithAPI(jobId, storyId, attempt + 1);
			}

			setRetryMessage(null);

			if (attempt >= 4 && user?.id) {
				try {
					await Promise.all([
						cleanupFailedStoryGeneration(user.id, storyId, jobId),
						deleteStoryJobRealtime(jobId),
					]);
				} catch (cleanupError) {
					await logError(cleanupError, "high", {
						screen: "home",
						action: "cleanup_failed_story",
						metadata: { storyId, jobId },
						userId: user?.id,
					}, user?.id);
				}
			} else {
				try {
					const storyStillExists = await getStory(storyId);
					if (storyStillExists) {
						try {
							await updateStoryStatusRealtime(jobId, "failed");
							await updateStoryStatus(storyId, "failed");
						} catch (statusUpdateError) {
							await logError(statusUpdateError, "medium", {
								screen: "home",
								action: "update_story_status",
								metadata: { storyId, jobId, status: "failed" },
								userId: user?.id,
							}, user?.id);
						}
					} else {
						if (user?.id) {
							try {
								await Promise.all([
									deleteStoryJobRealtime(jobId),
									deleteStoryJob(jobId),
								]);
							} catch (cleanupError) {
								await logError(cleanupError, "medium", {
									screen: "home",
									action: "cleanup_job",
									metadata: { storyId, jobId },
									userId: user?.id,
								}, user?.id);
							}
						}
					}
				} catch (checkError) {
					await logError(checkError, "high", {
						screen: "home",
						action: "check_story_exists",
						metadata: { storyId, jobId },
						userId: user?.id,
					}, user?.id);
					try {
						await Promise.all([
							deleteStoryJobRealtime(jobId),
							deleteStoryJob(jobId),
						]);
					} catch (cleanupError) {
						await logError(cleanupError, "medium", {
							screen: "home",
							action: "cleanup_job",
							metadata: { storyId, jobId },
							userId: user?.id,
						}, user?.id);
					}
				}
			}

			setError(
				attempt >= 4
					? "Story generation failed after multiple retries. Please try again later."
					: errorMessage,
			);
			throw err;
		} finally {
			handleResetForm();
		}
	};

	useEffect(() => {
		return () => {
			if (unsubscribeRef.current) {
				unsubscribeRef.current();
				unsubscribeRef.current = null;
			}
		};
	}, []);

	const handleCreateStory = async () => {
		if (!user?.id) {
			setError("You must be logged in to create a story");
			return;
		}

		if (!validators.storyPrompt(prompt)) {
			setError("Story prompt must be between 10 and 500 characters long");
			return;
		}

		setIsLoading(true);
		setError(null);
		setIsGenerating(false);
		setGenerationProgress(0);
		setCompletedStoryId(null);

		if (unsubscribeRef.current) {
			unsubscribeRef.current();
			unsubscribeRef.current = null;
		}

		try {
			const fullPrompt = buildFullPrompt();
			const storyTitle = title || randomGenerators.title();

			const { jobId, storyId } = await createStoryJob(
				user.id,
				fullPrompt,
				storyTitle,
			);

			const storyExists = await getStory(storyId);
			if (!storyExists) {
				throw new Error(
					"Failed to create story in Firestore. Please try again.",
				);
			}

			jobIdRef.current = jobId;
			storyIdRef.current = storyId;

			setIsGenerating(true);

			const unsubscribe = subscribeToStoryStatus(jobId, async (status) => {
				setGenerationProgress(status.progress);

				if (status.status === "completed") {
					setIsGenerating(false);
					setCompletedStoryId(storyId);
					if (unsubscribeRef.current) {
						unsubscribeRef.current();
						unsubscribeRef.current = null;
					}
				} else if (status.status === "failed") {
					setIsGenerating(false);
					setError(status.error || "Story generation failed");
					if (unsubscribeRef.current) {
						unsubscribeRef.current();
						unsubscribeRef.current = null;
					}

					if (user?.id) {
						try {
							await Promise.all([
								cleanupFailedStoryGeneration(user.id, storyId, jobId),
								deleteStoryJobRealtime(jobId),
							]);
						} catch (cleanupError) {
							await logError(cleanupError, "high", {
								screen: "home",
								action: "cleanup_failed_story",
								metadata: { storyId, jobId },
								userId: user?.id,
							}, user?.id);
						}
					}
				}
			});

			unsubscribeRef.current = unsubscribe;

			generateStoryWithAPI(jobId, storyId).catch(async (err) => {
				await logError(err, "critical", {
					screen: "home",
					action: "story_generation",
					metadata: { jobId, storyId },
					userId: user?.id,
				}, user?.id);
			});
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : "Failed to create story";
			setError(errorMessage);
			setIsGenerating(false);
			await logError(err, "high", {
				screen: "home",
				action: "create_story",
				metadata: { userId: user?.id },
				userId: user?.id,
			}, user?.id);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<ScrollView contentPadding="lg">
			<Stack direction="column" spacing="lg" align="stretch">
				<Stack direction="column" spacing="xs">
					<Text variant="default" size="4xl" weight="bold">
						StorytimeGPT
					</Text>
					<Text variant="muted" size="base">
						Generate your personalized stories
					</Text>
				</Stack>

				{error && (
					<View
						variant="card"
						padding="md"
						rounded="md"
						style={{ backgroundColor: Colors.destructive }}
					>
						<Text
							variant="default"
							size="sm"
							style={{ color: Colors.destructiveForeground }}
						>
							{error}
						</Text>
					</View>
				)}

				<Stack direction="column" spacing="md" align="stretch">
					<Input
						label="Story Title"
						placeholder="Enter a title for your story"
						value={title}
						onChangeText={setTitle}
						right={<RandomButton onPress={handleRandomTitle} />}
					/>

					<Textarea
						label="Story Prompt"
						placeholder="Describe what you want your story to be about..."
						value={prompt}
						onChangeText={setPrompt}
						numberOfLines={6}
						right={<RandomButton onPress={handleRandomPrompt} />}
					/>

					<Input
						label="Genre"
						placeholder="e.g., Fantasy, Adventure, Mystery"
						value={genre}
						onChangeText={setGenre}
						right={<RandomButton onPress={handleRandomGenre} />}
					/>

					<Input
						label="Tone/Style"
						placeholder="e.g., Funny, Adventurous, Mysterious"
						value={tone}
						onChangeText={setTone}
						right={<RandomButton onPress={handleRandomTone} />}
					/>

					<Input
						label="Main Character Name"
						placeholder="Enter character name"
						value={characterName}
						onChangeText={setCharacterName}
						right={<RandomButton onPress={handleRandomCharacterName} />}
					/>

					<Input
						label="Setting/Location"
						placeholder="e.g., A magical forest, Ancient castle"
						value={setting}
						onChangeText={setSetting}
						right={<RandomButton onPress={handleRandomSetting} />}
					/>

					<Picker
						label="Target Age Group"
						selectedValue={ageGroup}
						onValueChange={(value) =>
							setAgeGroup(value as "child" | "teen" | "adult" | "senior")
						}
						items={[
							{ label: "Child", value: "child" },
							{ label: "Teen", value: "teen" },
							{ label: "Adult", value: "adult" },
							{ label: "Senior", value: "senior" },
						]}
					/>

					<Picker
						label="Language Proficiency"
						selectedValue={languageProficiency}
						onValueChange={(value) =>
							setLanguageProficiency(
								value as "beginner" | "intermediate" | "advanced" | "native",
							)
						}
						items={[
							{ label: "Beginner", value: "beginner" },
							{ label: "Intermediate", value: "intermediate" },
							{ label: "Advanced", value: "advanced" },
							{ label: "Native", value: "native" },
						]}
					/>
				</Stack>

				{isGenerating && (
					<View
						variant="card"
						padding="lg"
						rounded="lg"
						style={{
							backgroundColor: Colors.card,
							borderWidth: 1,
							borderColor: Colors.border,
						}}
					>
						<Stack direction="column" spacing="md" align="center">
							<ActivityIndicator size="large" color={Colors.primary} />
							<Text variant="default" size="lg" weight="semibold">
								Generating your story...
							</Text>
							<Text variant="muted" size="base">
								{generationProgress}% complete
							</Text>
							{retryMessage && (
								<Text
									variant="muted"
									size="sm"
									style={{
										color: Colors.primary,
										textAlign: "center",
										marginTop: Spacing.xs,
									}}
								>
									{retryMessage}
								</Text>
							)}
						</Stack>
					</View>
				)}

				{completedStoryId && (
					<View
						variant="card"
						padding="lg"
						rounded="lg"
						style={{
							backgroundColor: Colors.card,
							borderWidth: 1,
							borderColor: Colors.primary,
						}}
					>
						<Stack direction="column" spacing="md" align="center">
							<Ionicons
								name="checkmark-circle"
								size={48}
								color={Colors.primary}
							/>
							<Text variant="default" size="lg" weight="semibold">
								Story generated successfully!
							</Text>
							<Stack direction="row" spacing="md" align="stretch">
								<Button
									title="Reset"
									onPress={handleResetForm}
									variant="outline"
									style={{ flex: 1 }}
								/>
								<Button
									title="Preview Story"
									onPress={() => {
										router.push(`/library/${completedStoryId}`);
									}}
									variant="primary"
									style={{ flex: 1 }}
								/>
							</Stack>
						</Stack>
					</View>
				)}

				<Stack direction="column" spacing="xs" align="stretch">
					<Button
						title="Create Story"
						onPress={handleCreateStory}
						loading={isLoading}
						disabled={isLoading || isGenerating || !prompt.trim()}
					/>
					<Text variant="muted" size="sm" style={{ textAlign: "center" }}>
						{storyLength === "short"
							? "Story length: 500-1000 words (Free tier)"
							: storyLength === "medium"
								? "Story length: 1000-2000 words (Silver tier)"
								: "Story length: 2000+ words (Gold/Platinum tier)"}
					</Text>
				</Stack>
			</Stack>
		</ScrollView>
	);
}
