import { Link } from "expo-router";
import { SafeAreaView, ScrollView, Stack, Text } from "@/components/ui";
import { Colors } from "@/theme";

export default function PrivacyModal() {
	return (
		<SafeAreaView>
			<ScrollView contentPadding="lg">
				<Stack direction="column" spacing="lg">
					<Stack direction="column" spacing="sm">
						<Text variant="default" size="4xl" weight="bold">
							Privacy Policy
						</Text>
						<Text variant="muted" weight="bold" size="base">
							Last updated: {new Date().toLocaleDateString()}
						</Text>
					</Stack>

					<Stack direction="column" spacing="sm">
						<Text variant="default" size="xl" weight="semibold">
							1. Introduction
						</Text>
						<Text variant="muted" size="base">
							Welcome to StorytimeGPT. We are committed to protecting your
							privacy and ensuring the security of your personal information.
							This Privacy Policy explains how we collect, use, disclose, and
							safeguard your information when you use our mobile application.
						</Text>
					</Stack>

					<Stack direction="column" spacing="sm">
						<Text variant="default" size="xl" weight="semibold">
							2. Information We Collect
						</Text>
						<Text variant="muted" size="base">
							We collect information that you provide directly to us, including:
						</Text>
						<Text variant="muted" size="base">
							Account Information: Email address, name, and password when you
							create an account
						</Text>
						<Text variant="muted" size="base">
							Profile Information: Language proficiency, age group, and
							preferences
						</Text>
						<Text variant="muted" size="base">
							Story Content: Stories you generate, prompts you submit, and
							associated media (images, audio, video)
						</Text>
						<Text variant="muted" size="base">
							Usage Data: How you interact with the app, features you use, and
							performance metrics
						</Text>
					</Stack>

					<Stack direction="column" spacing="sm">
						<Text variant="default" size="xl" weight="semibold">
							3. How We Use Your Information
						</Text>
						<Text variant="muted" size="base">
							We use the information we collect to:
						</Text>
						<Text variant="muted" size="base">
							Provide, maintain, and improve our services
						</Text>
						<Text variant="muted" size="base">
							Process and generate personalized stories based on your prompts
						</Text>
						<Text variant="muted" size="base">
							Manage your account and subscription
						</Text>
						<Text variant="muted" size="base">
							Send you notifications about your stories and account updates
						</Text>
						<Text variant="muted" size="base">
							Analyze usage patterns to enhance user experience
						</Text>
					</Stack>

					<Stack direction="column" spacing="sm">
						<Text variant="default" size="xl" weight="semibold">
							4. Data Storage and Security
						</Text>
						<Text variant="muted" size="base">
							Your data is stored securely using Firebase services:
						</Text>
						<Text variant="muted" size="base">
							Authentication: Firebase Authentication handles secure user
							authentication and password management
						</Text>
						<Text variant="muted" size="base">
							Database: Cloud Firestore stores your profile, stories, and
							preferences with encryption at rest
						</Text>
						<Text variant="muted" size="base">
							Storage: Firebase Storage securely stores your media files
							(images, audio, video)
						</Text>
						<Text variant="muted" size="base">
							Local Storage: We use Expo Secure Store for sensitive data like
							authentication tokens
						</Text>
						<Text variant="muted" size="base">
							All data transmission is encrypted using HTTPS. We implement
							appropriate technical and organizational measures to protect your
							personal information.
						</Text>
					</Stack>

					<Stack direction="column" spacing="sm">
						<Text variant="default" size="xl" weight="semibold">
							5. Data Sharing and Disclosure
						</Text>
						<Text variant="muted" size="base">
							We do not sell, trade, or rent your personal information to third
							parties. We may share your information only in the following
							circumstances:
						</Text>
						<Text variant="muted" size="base">
							Service Providers: With trusted third-party service providers who
							assist in operating our app (e.g., Firebase, analytics services)
						</Text>
						<Text variant="muted" size="base">
							Legal Requirements: When required by law or to protect our rights
							and safety
						</Text>
						<Text variant="muted" size="base">
							Business Transfers: In connection with a merger, acquisition, or
							sale of assets
						</Text>
					</Stack>

					<Stack direction="column" spacing="sm">
						<Text variant="default" size="xl" weight="semibold">
							6. Your Rights and Choices
						</Text>
						<Text variant="muted" size="base">
							You have the right to:
						</Text>
						<Text variant="muted" size="base">
							Access and update your personal information through the app
							settings
						</Text>
						<Text variant="muted" size="base">
							Delete your account and associated data at any time
						</Text>
						<Text variant="muted" size="base">
							Opt out of non-essential notifications
						</Text>
						<Text variant="muted" size="base">
							Request a copy of your data
						</Text>
						<Text variant="muted" size="base">
							Withdraw consent for data processing where applicable
						</Text>
					</Stack>

					<Stack direction="column" spacing="sm">
						<Text variant="default" size="xl" weight="semibold">
							7. Children&apos;s Privacy
						</Text>
						<Text variant="muted" size="base">
							Our app is designed for users of all ages, including children. We
							take extra precautions to protect children&apos;s privacy:
						</Text>
						<Text variant="muted" size="base">
							We collect minimal information necessary to provide our services
						</Text>
						<Text variant="muted" size="base">
							Parents or guardians can review and delete their child&apos;s
							account and data
						</Text>
						<Text variant="muted" size="base">
							We do not knowingly collect personal information from children
							under 13 without parental consent
						</Text>
					</Stack>

					<Stack direction="column" spacing="sm">
						<Text variant="default" size="xl" weight="semibold">
							8. Data Retention
						</Text>
						<Text variant="muted" size="base">
							We retain your personal information for as long as your account is
							active or as needed to provide services. When you delete your
							account, we will delete or anonymize your personal information,
							except where we are required to retain it for legal purposes.
						</Text>
					</Stack>

					<Stack direction="column" spacing="sm">
						<Text variant="default" size="xl" weight="semibold">
							9. International Data Transfers
						</Text>
						<Text variant="muted" size="base">
							Your information may be transferred to and processed in countries
							other than your country of residence. These countries may have
							data protection laws that differ from those in your country. By
							using our app, you consent to the transfer of your information to
							these countries.
						</Text>
					</Stack>

					<Stack direction="column" spacing="sm">
						<Text variant="default" size="xl" weight="semibold">
							10. Changes to This Privacy Policy
						</Text>
						<Text variant="muted" size="base">
							We may update this Privacy Policy from time to time. We will
							notify you of any changes by posting the new Privacy Policy in the
							app and updating the &ldquo;Last updated&rdquo; date. You are
							advised to review this Privacy Policy periodically for any
							changes.
						</Text>
					</Stack>

					<Stack direction="column" spacing="sm">
						<Text variant="default" size="xl" weight="semibold">
							11. Contact Us
						</Text>
						<Text variant="muted" size="base">
							If you have any questions about this Privacy Policy or our data
							practices, please contact us:
						</Text>
						<Text variant="muted" size="base">
							Email:{" "}
							<Link
								style={{ color: Colors.primary }}
								href="mailto:me@adityatripathi.dev"
							>
								me@adityatripathi.dev
							</Link>
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
								href="https://github.com/aditya04tripathi/storytimegpt/issues"
							>
								https://github.com/aditya04tripathi/storytimegpt/issues
							</Link>
						</Text>
					</Stack>
				</Stack>
			</ScrollView>
		</SafeAreaView>
	);
}
