<script lang="ts">
	import { settings } from "../../store";
	export let hoverText: string;

	let hovering = false;
</script>

<div class="relative">
	{#if $settings.showToolTips && hovering}
		<div class="z-2 absolute bottom-full bg-[var(--sub-color)] p-2 mb-2 rounded-lg">
			{hoverText}
		</div>
	{/if}
	<div
		on:mouseenter={() => (hovering = true)}
		on:mouseleave={() => (hovering = false)}
	>
		<slot />
	</div>
</div>
