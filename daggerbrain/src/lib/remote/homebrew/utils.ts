import { eq, and } from 'drizzle-orm';
import type { get_db, get_kv } from '../utils';

// Helper function to get or refresh KV cache for a homebrew type
export async function getOrRefreshCache<T>(
	kv: ReturnType<typeof get_kv>,
	userId: string,
	type: string,
	fetcher: () => Promise<T>
): Promise<T> {
	const cacheKey = `homebrew:${userId}:${type}`;
	const cached = (await kv.get(cacheKey, 'json')) as T | null;

	if (cached) {
		return cached;
	}

	// Cache miss - fetch from D1 and populate cache
	const data = await fetcher();
	await kv.put(cacheKey, JSON.stringify(data));
	return data;
}

// Helper function to update KV cache
export async function updateCache<T>(
	kv: ReturnType<typeof get_kv>,
	userId: string,
	type: string,
	data: T
): Promise<void> {
	const cacheKey = `homebrew:${userId}:${type}`;
	await kv.put(cacheKey, JSON.stringify(data));
}

// Helper function to invalidate KV cache
export async function invalidateCache(
	kv: ReturnType<typeof get_kv>,
	userId: string,
	type: string
): Promise<void> {
	const cacheKey = `homebrew:${userId}:${type}`;
	await kv.delete(cacheKey);
}

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
