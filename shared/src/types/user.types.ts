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
