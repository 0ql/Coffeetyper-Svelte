<script lang="ts">
	import { fly } from 'svelte/transition'
	import { notifications } from './ts/notifications'
</script>

<div class="z-2 p-5 absolute right-0 w-1/6">
	{#each $notifications as nt}
		{#if nt.type === 'info'}
			<div
				transition:fly={{ duration: 400, x: -150 }}
				class="bg-[var(--sub-color)] opacity-50 p-4 rounded-lg mb-4">
				{nt.content}
			</div>
		{:else if nt.type === 'warning'}
			<div
				transition:fly={{ duration: 400, x: -150 }}
				class="bg-[var(--sub-color)] p-4 rounded-lg mb-4">
				{nt.content}
			</div>
		{:else}
			<div
				transition:fly={{ duration: 400, x: -150 }}
				class="bg-[#ff7675] text-[#dfe6e9] p-4 rounded-lg mb-4">
				{nt.content}
			</div>
		{/if}
	{/each}
</div>
