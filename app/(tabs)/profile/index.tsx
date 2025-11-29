import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Button } from "@/components/common/Button";
import {
	Input,
	Picker,
	ScrollView,
	Spacer,
	Stack,
	Text,
	View,
} from "@/components/ui";
import { auth, db } from "@/services/firebase";
import { updateUserProfile } from "@/services/firebase/authService";
import { setUser } from "@/services/firebase/firestoreService";
import { useAuthStore } from "@/state/authStore";
import { FIREBASE_COLLECTIONS } from "@/utils/constants";

export default function ProfileScreen() {
	const { user, setFirebaseUser } = useAuthStore();
	const [name, setName] = useState(user?.name || "");
	const [languageProficiency, setLanguageProficiency] = useState<
		"beginner" | "intermediate" | "advanced" | "native"
	>("beginner");
	const [ageGroup, setAgeGroup] = useState<
		"child" | "teen" | "adult" | "senior"
	>("child");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!user?.id) return;

		getDoc(doc(db, FIREBASE_COLLECTIONS.USERS, user.id))
			.then((docSnapshot) => {
				if (docSnapshot.exists()) {
					const data = docSnapshot.data();
					setName(data?.name || "");
					setLanguageProficiency(data?.languageProficiency || "beginner");
					setAgeGroup(data?.ageGroup || "child");
				}
			})
			.catch((err) => {
				console.error("Error loading user data:", err);
			});
	}, [user?.id]);

	const handleUpdateProfile = async () => {
		if (!user || !auth.currentUser) return;

		setIsLoading(true);
		setError(null);

		try {
			await updateUserProfile(auth.currentUser, name);

			await setUser(user.id, {
				name: name,
				languageProficiency: languageProficiency,
				ageGroup: ageGroup,
			});

			await setFirebaseUser(auth.currentUser);
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : "Failed to update profile";
			setError(errorMessage);
			console.error("Error updating profile:", err);
		} finally {
			setIsLoading(false);
		}
	};

	if (!user) {
		return (
			<View variant="default" padding="lg">
				<Stack direction="column" justify="center" align="stretch">
					<Text variant="default" size="4xl" weight="bold">
						User not found. Oops!
					</Text>
				</Stack>
			</View>
		);
	}

	return (
		<ScrollView contentPadding="lg">
			<Stack direction="column" justify="center" align="stretch">
				<Text variant="default" size="4xl" weight="bold">
					Hello, {user.name}!
				</Text>
				<Spacer size="md" />
				<Stack align="stretch" justify="start" spacing="md">
					{error && (
						<View
							variant="card"
							padding="md"
							rounded="md"
							style={{ backgroundColor: "#541c15" }}
						>
							<Text variant="default" size="sm" style={{ color: "#ede9e8" }}>
								{error}
							</Text>
						</View>
					)}
					<Input
						label="Name"
						onChangeText={(text) => setName(text)}
						value={name}
					/>
					<Input
						label="Email Address"
						onChangeText={(text) => {}}
						value={user.email}
						disabled
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
					<Picker
						label="Age Group"
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
				</Stack>
				<Spacer size="xl" />
				<Button
					loading={isLoading}
					title="Update Profile"
					onPress={handleUpdateProfile}
					variant="primary"
					disabled={isLoading}
				/>
			</Stack>
		</ScrollView>
	);
}
