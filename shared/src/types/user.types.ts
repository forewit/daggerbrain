/**
 * User Types
 * 
 * Note: User type is inferred from drizzle schema in daggerbrain.
 * This is a placeholder - the actual User type will be imported from daggerbrain
 * or defined based on the users_table structure.
 */
export type User = {
	clerk_id: string;
	dismissed_popups: string[];
};

/**
 * Dice Types
 */
export type DiceType =
	| 'd4'
	| 'd6'
	| 'd8'
	| 'd10'
	| 'd12'
	| 'd20'
	| 'hope'
	| 'fear'
	| 'advantage'
	| 'disadvantage';

export type Roll = {
	id: string;
	name: string;
	dice: {
		type: DiceType;
		result?: number;
		disabled?: boolean;
	}[];
	modifier: number;
	status: 'rolling' | 'complete';
};

export type RollInput = {
	name?: string;
	dice: Roll['dice'];
	modifier?: number;
};
