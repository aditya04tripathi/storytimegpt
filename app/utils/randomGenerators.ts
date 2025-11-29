export const randomGenerators = {
	title: (): string => {
		const titles = [
			"The Enchanted Forest",
			"Mystery of the Lost City",
			"Adventures in Space",
			"The Brave Knight",
			"Underwater Kingdom",
			"The Magic School",
			"Time Traveler's Quest",
			"The Secret Garden",
			"Dragon's Treasure",
			"The Friendly Robot",
			"Princess and the Pea",
			"Journey to the Stars",
			"The Talking Animals",
			"Wizard's Apprentice",
			"The Hidden Island",
			"Superhero Academy",
			"The Rainbow Bridge",
			"Pirate's Adventure",
			"The Crystal Cave",
			"Fairy Tale Kingdom",
		];
		return titles[Math.floor(Math.random() * titles.length)];
	},

	prompt: (): string => {
		const prompts = [
			"A young explorer discovers a hidden world beneath their garden",
			"A magical creature needs help finding its way home",
			"Friends embark on an adventure to save their town",
			"A mysterious map leads to an ancient treasure",
			"A talking animal becomes the hero of the story",
			"A child discovers they have special powers",
			"An ordinary day turns into an extraordinary adventure",
			"A group of friends must solve a magical mystery",
			"A brave character faces their biggest fear",
			"A journey to a faraway land teaches valuable lessons",
			"A magical object changes everything",
			"A character learns the importance of friendship",
			"An adventure in a fantasy world",
			"A story about courage and determination",
			"A tale of discovery and wonder",
		];
		return prompts[Math.floor(Math.random() * prompts.length)];
	},

	genre: (): string => {
		const genres = [
			"Fantasy",
			"Adventure",
			"Mystery",
			"Science Fiction",
			"Fairy Tale",
			"Superhero",
			"Animal Story",
			"Historical",
			"Magical Realism",
			"Coming of Age",
		];
		return genres[Math.floor(Math.random() * genres.length)];
	},

	storyLength: (): string => {
		const lengths = ["short", "medium", "long"];
		return lengths[Math.floor(Math.random() * lengths.length)];
	},

	tone: (): string => {
		const tones = [
			"Funny",
			"Adventurous",
			"Mysterious",
			"Inspirational",
			"Magical",
			"Educational",
			"Heartwarming",
			"Exciting",
		];
		return tones[Math.floor(Math.random() * tones.length)];
	},

	characterName: (): string => {
		const names = [
			"Alex",
			"Sam",
			"Jordan",
			"Taylor",
			"Casey",
			"Morgan",
			"Riley",
			"Quinn",
			"Avery",
			"Sage",
			"River",
			"Sky",
			"Phoenix",
			"Blake",
			"Emery",
		];
		return names[Math.floor(Math.random() * names.length)];
	},

	setting: (): string => {
		const settings = [
			"A magical forest",
			"An ancient castle",
			"A bustling city",
			"A quiet village",
			"A mysterious island",
			"A space station",
			"An underwater kingdom",
			"A mountain peak",
			"A desert oasis",
			"A hidden cave",
			"A floating city",
			"A time portal",
			"A dream world",
			"A parallel universe",
			"A secret garden",
		];
		return settings[Math.floor(Math.random() * settings.length)];
	},

	ageGroup: (): "child" | "teen" | "adult" | "senior" => {
		const groups: ("child" | "teen" | "adult" | "senior")[] = [
			"child",
			"teen",
			"adult",
			"senior",
		];
		return groups[Math.floor(Math.random() * groups.length)];
	},

	languageProficiency: (): "beginner" | "intermediate" | "advanced" | "native" => {
		const proficiencies: (
			| "beginner"
			| "intermediate"
			| "advanced"
			| "native"
		)[] = ["beginner", "intermediate", "advanced", "native"];
		return proficiencies[Math.floor(Math.random() * proficiencies.length)];
	},
};

