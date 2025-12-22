import { getContext, setContext } from 'svelte';

const CONTEXT_KEY = 'editing-header';

export type EditingHeader = {
	title: string;
	subtitle: string;
};

export function createEditingHeaderContext() {
	let header = $state<EditingHeader>({ title: '', subtitle: '' });

	const context = {
		get title() {
			return header.title;
		},
		get subtitle() {
			return header.subtitle;
		},
		set(title: string, subtitle: string) {
			header = { title, subtitle };
		}
	};

	setContext(CONTEXT_KEY, context);
	return context;
}

export function getEditingHeaderContext() {
	return getContext<ReturnType<typeof createEditingHeaderContext>>(CONTEXT_KEY);
}
