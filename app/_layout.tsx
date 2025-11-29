import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useAuthState, useIsSignedIn } from "@/hooks/useAuthState";
import { Colors } from "@/theme";

export default function RootLayout() {
	const { isLoading } = useAuthState();
	const isSignedIn = useIsSignedIn();
	const segments = useSegments();
	const router = useRouter();

	useEffect(() => {
		if (isLoading) return;

		const inAuthGroup = segments[0] === "auth";

		if (isSignedIn && inAuthGroup) {
			router.replace("/(tabs)");
		} else if (!isSignedIn && !inAuthGroup) {
			router.replace("/auth/login");
		}
	}, [isSignedIn, segments, isLoading, router]);

	return (
		<>
			<StatusBar style="light" />
			<GestureHandlerRootView
				style={{ flex: 1, backgroundColor: Colors.background }}
			>
				<Stack
					screenOptions={{
						headerShown: false,
					}}
				>
					<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
					<Stack.Screen
						name="library/[storyId]"
						options={{
							presentation: "card",
							headerShown: false,
						}}
					/>
					<Stack.Screen
						name="modals/about"
						options={{
							presentation: "modal",
							headerShown: true,
							title: "About",
							headerStyle: { backgroundColor: Colors.card },
							headerTintColor: Colors.foreground,
						}}
					/>
					<Stack.Screen
						name="modals/privacy"
						options={{
							presentation: "modal",
							headerShown: true,
							title: "Privacy Policy",
							headerStyle: { backgroundColor: Colors.card },
							headerTintColor: Colors.foreground,
						}}
					/>
					<Stack.Screen name="auth/login" options={{ presentation: "card" }} />
					<Stack.Screen
						name="auth/register"
						options={{ presentation: "card" }}
					/>
				</Stack>
			</GestureHandlerRootView>
		</>
	);
}
