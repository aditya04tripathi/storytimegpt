export const validators = {
	email: (email: string): boolean => {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	},

	password: (password: string): { valid: boolean; error?: string } => {
		if (password.length < 8) {
			return { valid: false, error: "Password must be at least 8 characters" };
		}
		if (!/[A-Z]/.test(password)) {
			return {
				valid: false,
				error: "Password must contain at least one uppercase letter",
			};
		}
		if (!/[a-z]/.test(password)) {
			return {
				valid: false,
				error: "Password must contain at least one lowercase letter",
			};
		}
		if (!/[0-9]/.test(password)) {
			return {
				valid: false,
				error: "Password must contain at least one number",
			};
		}
		return { valid: true };
	},

	required: (value: string): boolean => {
		return value.trim().length > 0;
	},
};
