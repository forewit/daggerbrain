import { query, getRequestEvent } from '$app/server';
import { error } from '@sveltejs/kit';
import { z } from 'zod';
import { get_kv, get_auth } from './utils';
import { ClassSchema, SubclassSchema } from '$lib/compendium/compendium-schemas';
import type { CharacterClass, Subclass } from '$lib/types/compendium-types';

export const get_all_classes = query(async () => {
	console.log('get_all_classes');

	const event = getRequestEvent();
	get_auth(event); // Validates authentication
	const kv = get_kv(event);

	const classesData = (await kv.get('classes', 'json')) as Record<string, CharacterClass> | null;

	if (!classesData) {
		throw error(404, 'Classes not found in KV');
	}

	// Validate with zod
	const validatedClasses = Object.entries(classesData).reduce(
		(acc, [key, classData]) => {
			acc[key] = ClassSchema.parse(classData);
			return acc;
		},
		{} as Record<string, CharacterClass>
	);

	return validatedClasses;
});

export const get_class = query(z.string(), async (classId) => {
	console.log('get_class');

	const classes = await get_all_classes();
	const clazz = classes[classId];
	if (!clazz) {
		throw error(404, 'Class not found');
	}
	return clazz;
});

export const get_all_subclasses = query(async () => {
	console.log('get_all_subclasses');

	const event = getRequestEvent();
	get_auth(event); // Validates authentication
	const kv = get_kv(event);

	const subclassesData = (await kv.get('subclasses', 'json')) as Record<string, Subclass> | null;

	if (!subclassesData) {
		throw error(404, 'Subclasses not found');
	}

	// Validate with zod
	const validatedSubclasses = Object.entries(subclassesData).reduce(
		(acc, [key, subclassData]) => {
			acc[key] = SubclassSchema.parse(subclassData);
			return acc;
		},
		{} as Record<string, Subclass>
	);

	return validatedSubclasses;
});

export const get_subclass = query(z.string(), async (subclassId) => {
	console.log('get_subclass');

	const subclasses = await get_all_subclasses();
	const subclass = subclasses[subclassId];
	if (!subclass) {
		throw error(404, 'Subclass not found');
	}
	return subclass;
});
