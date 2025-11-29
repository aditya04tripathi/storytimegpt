import { useRouter } from "expo-router";
import { useState } from "react";
import { Button } from "@/components/common/Button";
import { Input, Spacer, Stack, Text, View } from "@/components/ui";
import { useAuth } from "@/hooks/useAuth";

export default function RegisterScreen() {
	const router = useRouter();
	const { register } = useAuth();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [name, setName] = useState("");
	const [loading, setLoading] = useState(false);

	const handleRegister = async () => {
		setLoading(true);
		try {
			await register(email, password, name);
			router.replace("/(tabs)");
		} catch (error) {
			// TODO: Show error message
			console.error("Registration failed:", error);
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
			<Stack direction="column" spacing="none" align="stretch">
				<Text
					variant="default"
					size="4xl"
					weight="bold"
					style={{ textAlign: "center" }}
				>
					Register
				</Text>
				<Spacer size="sm" />
				<Input
					label="Name"
					placeholder="Name"
					value={name}
					onChangeText={setName}
				/>
				<Spacer size="sm" />
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
				<Button title="Register" onPress={handleRegister} loading={loading} />
				<Spacer size="sm" />
				<Button
					title="Login"
					variant="outline"
					onPress={() => router.replace("/auth/login")}
				/>
			</Stack>
		</View>
	);
}
