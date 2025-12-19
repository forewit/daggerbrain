import { eq, and } from 'drizzle-orm';
import type { get_db } from '../utils';

// Helper function to verify ownership
export async function verifyOwnership(
	db: ReturnType<typeof get_db>,
	table: any,
	id: string,
	userId: string
): Promise<boolean> {
	const [entry] = await db
		.select()
		.from(table)
		.where(and(eq(table.id, id), eq(table.clerk_user_id, userId)))
		.limit(1);
	return !!entry;
}
