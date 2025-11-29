import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Colors } from "@/theme/colors";

export default function RootLayout() {
	return (
		<GestureHandlerRootView
			style={{ flex: 1, backgroundColor: Colors.background }}
		>
			<StatusBar style="light" />
			<Stack
				screenOptions={{
					headerShown: false,
					contentStyle: { backgroundColor: Colors.background },
				}}
			>
				<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
				<Stack.Screen name="auth/login" options={{ presentation: "card" }} />
				<Stack.Screen name="auth/register" options={{ presentation: "card" }} />
				<Stack.Screen
					name="library/[storyId]"
					options={{ presentation: "card" }}
				/>
				<Stack.Screen
					name="modals/payment"
					options={{
						presentation: "modal",
						headerShown: true,
						title: "Payment",
						headerStyle: { backgroundColor: Colors.card },
						headerTintColor: Colors.foreground,
					}}
				/>
			</Stack>
		</GestureHandlerRootView>
	);
}
