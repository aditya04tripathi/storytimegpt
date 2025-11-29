import * as Notifications from "expo-notifications";
import { logError } from "./errorLogger";

Notifications.setNotificationHandler({
	handleNotification: async () => ({
		shouldShowAlert: true,
		shouldPlaySound: true,
		shouldSetBadge: true,
		shouldShowBanner: true,
		shouldShowList: true,
	}),
});

export class NotificationService {
	async requestPermissions(): Promise<boolean> {
		const { status: existingStatus } =
			await Notifications.getPermissionsAsync();
		let finalStatus = existingStatus;

		if (existingStatus !== "granted") {
			const { status } = await Notifications.requestPermissionsAsync();
			finalStatus = status;
		}

		return finalStatus === "granted";
	}

	async getExpoPushToken(): Promise<string | null> {
		try {
			const token = await Notifications.getExpoPushTokenAsync({
				projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
			});
			return token.data;
		} catch (error) {
			await logError(error, "medium", {
				action: "get_push_token",
			});
			return null;
		}
	}

	async scheduleLocalNotification(title: string, body: string, data?: any) {
		await Notifications.scheduleNotificationAsync({
			content: {
				title,
				body,
				data,
			},
			trigger: null, // Show immediately
		});
	}
}

export const notificationService = new NotificationService();
