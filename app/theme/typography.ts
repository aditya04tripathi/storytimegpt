export class Typography {
	static readonly fontSans = "Outfit, sans-serif";
	static readonly fontSerif =
		'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif';
	static readonly fontMono = "monospace";

	static readonly fontSize = {
		xs: 12,
		sm: 14,
		base: 16,
		lg: 18,
		xl: 20,
		"2xl": 24,
		"3xl": 30,
		"4xl": 36,
		"5xl": 48,
	} as const;

	static readonly fontWeight = {
		normal: "400" as const,
		medium: "500" as const,
		semibold: "600" as const,
		bold: "700" as const,
	} as const;

	static readonly lineHeight = {
		tight: 1.25,
		snug: 1.375,
		normal: 1.5,
		relaxed: 1.625,
		loose: 2,
	} as const;
}
