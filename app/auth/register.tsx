import { useRouter } from "expo-router";
import { useState, useTransition } from "react";
import { Button } from "@/components/common/Button";
import { Input, Spacer, Stack, Text, View } from "@/components/ui";
import { useAuth } from "@/hooks/useAuth";

export default function RegisterScreen() {
	const router = useRouter();
	const { register } = useAuth();
	const [email, setEmail] = useState("me@adityatripathi.dev");
	const [password, setPassword] = useState("1234567890");
	const [name, setName] = useState("Aditya Tripathi");
	const [registerPending, startRegisterPending] = useTransition();

	const handleRegister = () => {
		startRegisterPending(async () => {
			await register(email, password, name);
			router.replace("/(tabs)");
		});
	};

	return (
		<View variant="default" padding="md">
			<Stack direction="column" spacing="none" align="stretch" justify="center">
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
					keyboardType="default"
					autoCapitalize="none"
					autoCorrect={false}
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
				<Button
					title="Register"
					onPress={handleRegister}
					loading={registerPending}
				/>
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
