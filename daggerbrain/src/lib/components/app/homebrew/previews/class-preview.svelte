<script lang="ts">
	import type { CharacterClass } from '@shared/types/compendium.types';
	import ClassSummary from '$lib/components/app/leveling/secondary-options/class-summary.svelte';

	let { characterClass }: { characterClass: CharacterClass } = $props();
</script>

<div class="flex max-w-[300px] min-w-[300px]">
	<ClassSummary character_class={characterClass} />
</div>
