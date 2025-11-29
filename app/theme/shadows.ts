import { Platform } from "react-native";

/**
 * Shadow styles for iOS and Android
 */
export class Shadows {
	static readonly sm = Platform.select({
		ios: {
			shadowColor: "#000",
			shadowOffset: { width: 0, height: 1 },
			shadowOpacity: 0.17,
			shadowRadius: 1.5,
		},
		android: {
			elevation: 2,
		},
	});

	static readonly md = Platform.select({
		ios: {
			shadowColor: "#000",
			shadowOffset: { width: 0, height: 2 },
			shadowOpacity: 0.17,
			shadowRadius: 2,
		},
		android: {
			elevation: 3,
		},
	});

	static readonly lg = Platform.select({
		ios: {
			shadowColor: "#000",
			shadowOffset: { width: 0, height: 4 },
			shadowOpacity: 0.17,
			shadowRadius: 3,
		},
		android: {
			elevation: 4,
		},
	});

	static readonly xl = Platform.select({
		ios: {
			shadowColor: "#000",
			shadowOffset: { width: 0, height: 8 },
			shadowOpacity: 0.17,
			shadowRadius: 5,
		},
		android: {
			elevation: 5,
		},
	});
}
