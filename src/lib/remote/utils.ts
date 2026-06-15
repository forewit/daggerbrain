import type { RequestEvent } from '@sveltejs/kit';
import type { R2Bucket } from '@cloudflare/workers-types';
import type { SessionAuthObject } from 'svelte-clerk/server';

export type AppErrorCode =
	| 'unauthorized'
	| 'forbidden'
	| 'not_found'
	| 'dependency_unavailable'
	| 'validation_failed'
	| 'conflict'
	| 'rate_limited'
	| 'internal_error';

export type AppFailure = {
	ok: false;
	code: AppErrorCode;
	message: string;
	status: number;
	details?: Record<string, unknown>;
};

export type AppSuccess<T> = {
	ok: true;
	data: T;
};

export type AppResult<T> = AppSuccess<T> | AppFailure;

export const ok = <T>(data: T): AppResult<T> => ({ ok: true, data });

export const fail = (
	code: AppFailure['code'],
	message: string,
	status: number,
	details?: Record<string, unknown>
): AppFailure => ({
	ok: false,
	code,
	message,
	status,
	details
});

export const is_failure = <T>(result: AppResult<T>): result is AppFailure => !result.ok;

export const require_auth = (
	event: RequestEvent
): AppResult<SessionAuthObject & { userId: string }> => {
	const auth = event.locals.auth();
	if (!auth?.userId) {
		console.log('Unauthorized: No user ID found in auth');
		return fail('unauthorized', 'Unauthorized', 401);
	}
	return ok(auth);
};

export const require_r2_images = (event: RequestEvent): AppResult<R2Bucket> => {
	if (!event.platform?.env?.R2_IMAGES) {
		console.log('R2_IMAGES not available');
		return fail('dependency_unavailable', 'R2_IMAGES not available', 503);
	}
	return ok(event.platform.env.R2_IMAGES);
};

export const require_r2_usercontent = (event: RequestEvent): AppResult<R2Bucket> => {
	if (!event.platform?.env?.R2_USERCONTENT) {
		console.log('R2_USERCONTENT not available');
		return fail('dependency_unavailable', 'R2_USERCONTENT not available', 503);
	}
	return ok(event.platform.env.R2_USERCONTENT);
};
