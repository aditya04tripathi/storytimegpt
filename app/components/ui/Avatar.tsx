import { Image, StyleSheet, Text, View } from "react-native";
import { Colors } from "@/theme/colors";
import { Typography } from "@/theme/typography";

type AvatarProps = {
	source?: { uri: string };
	name?: string;
	size?: number;
};

export function Avatar({ source, name, size = 40 }: AvatarProps) {
	const initials =
		name
			?.split(" ")
			.map((n) => n[0])
			.join("")
			.toUpperCase()
			.substring(0, 2) || "?";

	return (
		<View
			style={[
				styles.container,
				{ width: size, height: size, borderRadius: size / 2 },
			]}
		>
			{source ? (
				<Image
					source={source}
					style={[
						styles.image,
						{ width: size, height: size, borderRadius: size / 2 },
					]}
				/>
			) : (
				<View
					style={[
						styles.placeholder,
						{ width: size, height: size, borderRadius: size / 2 },
					]}
				>
					<Text style={[styles.initials, { fontSize: size * 0.4 }]}>
						{initials}
					</Text>
				</View>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		overflow: "hidden",
	},
	image: {
		width: "100%",
		height: "100%",
	},
	placeholder: {
		backgroundColor: Colors.primary,
		justifyContent: "center",
		alignItems: "center",
	},
	initials: {
		color: Colors.primaryForeground,
		fontWeight: Typography.fontWeight.semibold,
	},
});
