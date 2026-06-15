export type FaqItem = {
	question: string;
	answer: string;
};

export const FAQ_ITEMS = [
	{
		question: 'What is Daggerbrain?',
		answer:
			'Daggerbrain is like DNDBeyond, but for Daggerheart. Create characters, run campaigns, make a homebrew library, and build encounters all in one place.'
	}
] as const satisfies readonly FaqItem[];
