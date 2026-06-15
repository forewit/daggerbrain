import { api } from '@convex/_generated/api';
import type { Doc, Id } from '@convex/_generated/dataModel';
import { CHARACTER_DEFAULTS } from '@convex/constants/constants';
import { useConvexClient, useQuery } from 'convex-svelte';
import { getContext, setContext } from 'svelte';
import { upload_user_image } from '$lib/remote/images.remote';
import { useClerkContext } from 'svelte-clerk';
import {
	CHARACTER_LIMIT,
	HOMEBREW_LIMIT,
	UNLIMITED_CHARACTERS_FEATURE_SLUG,
	UNLIMITED_HOMEBREW_FEATURE_SLUG
} from '@convex/constants/entitlements';

function userContext() {
	// setup convex for querying
	let token: string | null | undefined = $state();
	let createUserPromise: Promise<Id<'users'> | null> | null = null;
	const clerkCtx = useClerkContext();
	const convexClient = useConvexClient();

	$effect(() => {
		convexClient.setAuth(async () => {
			if (!clerkCtx.isLoaded || !clerkCtx.session) {
				token = null;
				return null;
			}

			token = await clerkCtx.session.getToken({
				template: 'convex'
			});

			return token;
		});
	});

	const userQuery = $derived(token ? useQuery(api.functions.users.get) : undefined);
	const user: Doc<'users'> | null = $derived(userQuery ? (userQuery.data ?? null) : null);

	const featuresQuery = $derived(
		user ? useQuery(api.functions.entitlements.getFeatures) : undefined
	);
	const features: string[] = $derived(featuresQuery ? (featuresQuery.data ?? []) : []);

	const character_limits = $derived.by(() => {
		const has_unlimited = features.includes(UNLIMITED_CHARACTERS_FEATURE_SLUG) ?? false;
		const character_count = user?.character_count ?? 0;
		const can_create_character = has_unlimited || character_count < CHARACTER_LIMIT;
		// const over_limit = character_count > CHARACTER_LIMIT
		// const at_limit = character_count === CHARACTER_LIMIT

		return { has_unlimited, can_create_character };
	});

	const homebrew_limits = $derived.by(() => {
		const has_unlimited = features.includes(UNLIMITED_HOMEBREW_FEATURE_SLUG) ?? false;
		const homebrew_count = user?.homebrew_count ?? 0;
		const can_create_homebrew = has_unlimited || homebrew_count < HOMEBREW_LIMIT;

		return { has_unlimited, can_create_homebrew };
	});
	const isLoading = $derived(
		!userQuery || userQuery.isLoading || !featuresQuery || featuresQuery.isLoading
	);
	const error = $derived(userQuery?.error || featuresQuery?.error);

	// create user if none exists
	$effect(() => {
		if (!token || !userQuery || userQuery.isLoading || userQuery.data || createUserPromise) {
			return;
		}

		createUserPromise = convexClient
			.mutation(api.functions.users.create, {})
			.catch((error) => {
				console.warn('Failed to ensure user exists', error);
				return null;
			})
			.finally(() => {
				createUserPromise = null;
			});
	});

	async function createCharacter(): Promise<Id<'characters'>> {
		if (!user) {
			throw new Error('User not found');
		}

		return await convexClient.mutation(api.functions.characters.add, CHARACTER_DEFAULTS);
	}

	async function deleteCharacter(id: Id<'characters'>): Promise<void> {
		await convexClient.mutation(api.functions.characters.remove, { id });
	}

	const uploadImage = async (params: { data: string; name: string; type: string }) => {
		const result = await upload_user_image(params);
		if (!result.ok) {
			throw new Error(result.message);
		}

		return result.data;
	};

	return {
		get user() {
			return user;
		},
		get features() {
			return features;
		},
		get character_limits() {
			return character_limits;
		},
		get homebrew_limits() {
			return homebrew_limits;
		},
		get isLoading() {
			return isLoading;
		},
		get error() {
			return error;
		},

		createCharacter,
		deleteCharacter,
		uploadImage
	};
}

const USER_CONTEXT_KEY = Symbol('UserContext');

export const setUserContext = () => {
	const newUserContext = userContext();
	return setContext(USER_CONTEXT_KEY, newUserContext);
};

export const getUserContext = (): ReturnType<typeof setUserContext> => {
	return getContext(USER_CONTEXT_KEY) as ReturnType<typeof setUserContext>;
};
