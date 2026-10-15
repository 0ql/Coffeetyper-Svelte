<script lang="ts">
	import { settings } from '../../store'
	interface Props {
		hoverText: string;
		children?: import('svelte').Snippet;
	}

	let { hoverText, children }: Props = $props();

	let hovering = $state(false)
</script>

<div class="relative">
	{#if $settings.showToolTips && hovering}
		<div
			class="z-2 absolute bottom-full bg-[var(--sub-color)] p-2 mb-2 rounded-lg">
			{hoverText}
		</div>
	{/if}
	<div
		role="tooltip"
		onmouseenter={() => (hovering = true)}
		onmouseleave={() => (hovering = false)}>
		{@render children?.()}
	</div>
</div>
