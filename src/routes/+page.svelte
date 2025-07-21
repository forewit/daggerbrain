<script lang="ts">
	import ArmorSlot from '$lib/daggerbrain/components/character sheet/ArmorSlot.svelte';
	import DamageThresholds from '$lib/daggerbrain/components/character sheet/DamageThresholds.svelte';
	import EvasionSlot from '$lib/daggerbrain/components/character sheet/EvasionSlot.svelte';
	import HopeTracker from '$lib/daggerbrain/components/character sheet/HopeSlot.svelte';
	import Inventory from '$lib/daggerbrain/components/character sheet/Inventory.svelte';
	import Level from '$lib/daggerbrain/components/character sheet/Level.svelte';
	import Traits from '$lib/daggerbrain/components/character sheet/Traits.svelte';
</script>

<p class="p-3 font-medium">Daggerbrain</p>

<HopeTracker class="border" />
<ArmorSlot class="border" />
<EvasionSlot class="border" />
<Traits class="border" />
<Level class="border" />
<DamageThresholds class="border" />
<Inventory class="border" />
