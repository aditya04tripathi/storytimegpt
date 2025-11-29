import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Colors } from "@/theme/colors";

export default function TabsLayout() {
	return (
		<Tabs
			screenOptions={{
				headerShown: true,
				tabBarActiveTintColor: Colors.primary,
				tabBarInactiveTintColor: Colors.mutedForeground,
				tabBarStyle: {
					backgroundColor: Colors.card,
					borderTopColor: Colors.border,
				},
				headerStyle: {
					backgroundColor: Colors.card,
				},
				headerTintColor: Colors.foreground,
			}}
		>
			<Tabs.Screen
				name="index"
				options={{
					title: "Home",
					tabBarIcon: ({ color, size }) => (
						<Ionicons name="home" size={size} color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name="library/index"
				options={{
					title: "Library",
					tabBarIcon: ({ color, size }) => (
						<Ionicons name="library" size={size} color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name="subscription/index"
				options={{
					title: "Subscription",
					tabBarIcon: ({ color, size }) => (
						<Ionicons name="card" size={size} color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name="profile/index"
				options={{
					title: "Profile",
					tabBarIcon: ({ color, size }) => (
						<Ionicons name="person" size={size} color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name="settings/index"
				options={{
					title: "Settings",
					tabBarIcon: ({ color, size }) => (
						<Ionicons name="settings" size={size} color={color} />
					),
				}}
			/>
		</Tabs>
	);
}
