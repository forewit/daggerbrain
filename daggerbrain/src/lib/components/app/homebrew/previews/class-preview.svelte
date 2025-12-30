<script lang="ts">
	import type { CharacterClass } from '$lib/types/compendium-types';
	import ClassSummary from '$lib/components/app/leveling/secondary-options/class-summary.svelte';

	let { characterClass }: { characterClass: CharacterClass } = $props();
</script>

<div class="mx-auto w-[300px]">
	<ClassSummary character_class={characterClass} />
</div>

