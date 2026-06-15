<script lang="ts">
	let {
		title,
		authorAvatar,
		authorName,
		date,
		updated
	}: {
		title: string;
		authorAvatar?: string;
		authorName: string;
		date: number;
		updated?: number;
	} = $props();

	function formatDate(value: number) {
		return new Intl.DateTimeFormat('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		}).format(new Date(value));
	}

	function toIsoDate(value: number) {
		return new Date(value).toISOString();
	}
</script>

<header class="mt-2 mb-4">
	<h1 class="m-0 text-3xl font-bold">
		{title}
	</h1>

	<div class="mt-3 flex items-center gap-3">
		{#if authorAvatar}
			<img
				src={authorAvatar}
				alt={authorName}
				class="size-10 rounded-full border border-border/70 object-cover"
			/>
		{/if}

		<div class="min-w-0">
			<p class="text-sm font-bold text-foreground">{authorName}</p>
			<p class="text-xs text-muted-foreground italic">
				<time datetime={toIsoDate(date)}>{formatDate(date)}</time>
				{#if updated}
					<span> / Updated {formatDate(updated)}</span>
				{/if}
			</p>
		</div>
	</div>
</header>
