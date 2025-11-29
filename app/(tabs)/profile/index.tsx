import { Image } from "expo-image";
import { doc, getDoc } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { RefreshControl } from "react-native";
import { Button } from "@/components/common/Button";
import {
	Badge,
	Input,
	Picker,
	ScrollView,
	Stack,
	Text,
	View,
} from "@/components/ui";
import { logError } from "@/services/errorLogger";
import { auth, db } from "@/services/firebase";
import { updateUserProfile } from "@/services/firebase/authService";
import { setUser } from "@/services/firebase/firestoreService";
import { useAuthStore } from "@/state/authStore";
import { Colors } from "@/theme/colors";
import { FIREBASE_COLLECTIONS } from "@/utils/constants";
import { formatters } from "@/utils/formatters";

export default function ProfileScreen() {
	const { user, setFirebaseUser, refreshUser } = useAuthStore();
	const [name, setName] = useState(user?.name || "");
	const [languageProficiency, setLanguageProficiency] = useState<
		"beginner" | "intermediate" | "advanced" | "native"
	>("beginner");
	const [ageGroup, setAgeGroup] = useState<
		"child" | "teen" | "adult" | "senior"
	>("child");
	const [favoriteGenres, setFavoriteGenres] = useState<string[]>(
		user?.favoriteGenres || [],
	);
	const [isLoading, setIsLoading] = useState(false);
	const [isRefreshing, setIsRefreshing] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const loadUserData = useCallback(async () => {
		if (!user?.id) return;

		try {
			const docSnapshot = await getDoc(
				doc(db, FIREBASE_COLLECTIONS.USERS, user.id),
			);
			if (docSnapshot.exists()) {
				const data = docSnapshot.data();
				setName(data?.name || "");
				setLanguageProficiency(data?.languageProficiency || "beginner");
				setAgeGroup(data?.ageGroup || "child");
				setFavoriteGenres(data?.favoriteGenres || []);
			}
			await refreshUser();
		} catch (err) {
			await logError(
				err,
				"medium",
				{
					screen: "profile",
					action: "load_user_data",
					userId: user?.id,
				},
				user?.id,
			);
		} finally {
			setIsRefreshing(false);
		}
	}, [user?.id, refreshUser]);

	useEffect(() => {
		loadUserData();
	}, [loadUserData]);

	const onRefresh = useCallback(() => {
		setIsRefreshing(true);
		loadUserData();
	}, [loadUserData]);

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
				favoriteGenres: favoriteGenres,
			});

			await setFirebaseUser(auth.currentUser);
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : "Failed to update profile";
			setError(errorMessage);
			await logError(
				err,
				"high",
				{
					screen: "profile",
					action: "update_profile",
					userId: user?.id,
				},
				user?.id,
			);
		} finally {
			setIsLoading(false);
		}
	};

	const refreshControl = (
		<RefreshControl
			refreshing={isRefreshing}
			onRefresh={onRefresh}
			tintColor={Colors.primary}
			colors={[Colors.primary]}
		/>
	);

	if (!user) {
		return (
			<ScrollView contentPadding="lg" refreshControl={refreshControl}>
				<Stack direction="column" spacing="lg" align="stretch">
					<Text variant="default" size="4xl" weight="bold">
						User not found. Oops!
					</Text>
				</Stack>
			</ScrollView>
		);
	}

	return (
		<ScrollView contentPadding="lg" refreshControl={refreshControl}>
			<Stack direction="column" spacing="lg" align="stretch">
				<Stack direction="row" justify="between" align="center" spacing="md">
					<Image
						source={user.photoURL}
						style={{ width: 100, height: 100, borderRadius: 50 }}
						contentFit="cover"
						contentPosition="center"
						accessibilityLabel="User avatar"
						placeholder={"hello"}
					/>
					<Stack direction="column" spacing="xs">
						<Text variant="default" size="4xl" weight="bold">
							Hello, {user.name?.split(" ")[0]}!
						</Text>
						<Text variant="muted" size="base">
							Member since {formatters.date(user.createdAt)}
						</Text>
					</Stack>
				</Stack>
				<Stack direction="column" spacing="md" align="stretch">
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
					<Input
						label="Name"
						onChangeText={(text) => setName(text)}
						value={name}
					/>
					<Input
						label="Email Address"
						onChangeText={() => {}}
						value={user.email}
						disabled
					/>
					<Input
						label="Favorite Genres"
						onChangeText={(text) => {
							setFavoriteGenres(text.split(","));
						}}
						value={favoriteGenres.join(", ")}
						placeholder="Enter your favorite genres separated by commas"
						multiline
						numberOfLines={4}
					/>
					<Stack direction="row">
						{user.favoriteGenres.map((genre) => (
							<Badge key={genre} variant="primary">
								<Text variant="default" size="sm">
									{genre}
								</Text>
							</Badge>
						))}
					</Stack>
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
				<Stack direction="column" spacing="xs" align="stretch">
					<Button
						loading={isLoading}
						title="Update Profile"
						onPress={handleUpdateProfile}
						variant="primary"
						disabled={isLoading}
					/>
					<Text style={{ textAlign: "right" }} variant="muted" size="sm">
						Last updated {formatters.timeAgo(user.updatedAt)}
					</Text>
				</Stack>
			</Stack>
		</ScrollView>
	);
}
