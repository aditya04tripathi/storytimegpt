import { useRouter } from "expo-router";
import { useState } from "react";
import { Button } from "@/components/common/Button";
import { Input, Spacer, Stack, Text, View } from "@/components/ui";
import { useAuth } from "@/hooks/useAuth";

export default function LoginScreen() {
	const router = useRouter();
	const { login } = useAuth();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);

	const handleLogin = async () => {
		setLoading(true);
		try {
			await login(email, password);
			router.replace("/(tabs)");
		} catch (error) {
			// TODO: Show error message
			console.error("Login failed:", error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<View
			variant="default"
			style={{ flex: 1, justifyContent: "center" }}
			padding="lg"
		>
			<Stack direction="column" spacing="none" align="stretch" justify="center">
				<Text
					variant="default"
					size="4xl"
					weight="bold"
					style={{ textAlign: "center" }}
				>
					Login
				</Text>
				<Input
					label="Email"
					placeholder="Email"
					value={email}
					onChangeText={setEmail}
					keyboardType="email-address"
					autoCapitalize="none"
					autoCorrect={false}
				/>
				<Spacer size="sm" />
				<Input
					label="Password"
					placeholder="Password"
					value={password}
					onChangeText={setPassword}
					secureTextEntry
					autoCorrect={false}
				/>
				<Spacer size="md" />
				<Button title="Login" onPress={handleLogin} loading={loading} />
				<Spacer size="sm" />
				<Button
					title="Register"
					variant="outline"
					onPress={() => router.replace("/auth/register")}
				/>
			</Stack>
		</View>
	);
}
