import {
	collection,
	doc,
	serverTimestamp,
	setDoc,
	type Timestamp,
} from "firebase/firestore";
import { constants } from "@/utils/constants";
import { db } from "./firebase";

export type ErrorSeverity = "low" | "medium" | "high" | "critical";

export type ErrorContext = {
	userId?: string;
	screen?: string;
	action?: string;
	component?: string;
	metadata?: Record<string, unknown>;
};

export type ErrorLog = {
	id: string;
	message: string;
	error: string;
	stack?: string;
	severity: ErrorSeverity;
	context: ErrorContext;
	userAgent?: string;
	platform?: string;
	appVersion?: string;
	timestamp: Timestamp;
	resolved: boolean;
};

const COLLECTION_NAME = "errors";

function getErrorDetails(error: unknown): {
	message: string;
	error: string;
	stack?: string;
} {
	if (error instanceof Error) {
		return {
			message: error.message,
			error: error.name,
			stack: error.stack,
		};
	}
	if (typeof error === "string") {
		return {
			message: error,
			error: "StringError",
		};
	}
	return {
		message: "Unknown error occurred",
		error: "UnknownError",
	};
}

function determineSeverity(
	error: unknown,
	context?: ErrorContext,
): ErrorSeverity {
	if (error instanceof Error) {
		const errorName = error.name.toLowerCase();
		if (
			errorName.includes("network") ||
			errorName.includes("timeout") ||
			errorName.includes("connection")
		) {
			return "medium";
		}
		if (
			errorName.includes("permission") ||
			errorName.includes("unauthorized") ||
			errorName.includes("forbidden")
		) {
			return "high";
		}
		if (
			errorName.includes("critical") ||
			errorName.includes("fatal") ||
			context?.action === "payment" ||
			context?.action === "auth"
		) {
			return "critical";
		}
	}
	return "low";
}

export async function logError(
	error: unknown,
	severity?: ErrorSeverity,
	context?: ErrorContext,
	userId?: string,
): Promise<void> {
	try {
		const errorDetails = getErrorDetails(error);
		const errorSeverity = severity || determineSeverity(error, context);

		const contextData: ErrorContext = {};
		if (userId || context?.userId) {
			contextData.userId = userId || context?.userId;
		}
		if (context?.screen) {
			contextData.screen = context.screen;
		}
		if (context?.action) {
			contextData.action = context.action;
		}
		if (context?.component) {
			contextData.component = context.component;
		}
		if (context?.metadata) {
			contextData.metadata = context.metadata;
		}

		const errorData: Record<string, unknown> = {
			message: errorDetails.message,
			error: errorDetails.error,
			severity: errorSeverity,
			context: contextData,
			platform: "react-native",
			appVersion: "1.0.0",
			resolved: false,
			timestamp: serverTimestamp(),
		};

		if (errorDetails.stack) {
			errorData.stack = errorDetails.stack;
		}

		const userAgent =
			typeof navigator !== "undefined" ? navigator.userAgent : undefined;
		if (userAgent) {
			errorData.userAgent = userAgent;
		}

		const errorRef = doc(collection(db, COLLECTION_NAME));
		await setDoc(errorRef, errorData);

		try {
			await fetch(constants.ERROR_WEBHOOK_URL, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					message: errorDetails.message,
					error: errorDetails.error,
					stack: errorDetails.stack,
					severity: errorSeverity,
					context: contextData,
					userAgent: userAgent,
					platform: "react-native",
					appVersion: "1.0.0",
					timestamp: new Date().toISOString(),
				}),
			});
		} catch {}
	} catch {}
}

export async function logErrorWithContext(
	error: unknown,
	context: ErrorContext,
	severity?: ErrorSeverity,
	userId?: string,
): Promise<void> {
	return logError(error, severity, context, userId);
}
