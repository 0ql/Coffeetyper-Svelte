<script lang="ts">
	import { onMount } from 'svelte'
	import { get } from 'svelte/store'
	import { fade } from 'svelte/transition'
	import ChangeTheme from './components/changeTheme.svelte'
	import Notifications from './components/notifications.svelte'
	import Settings from './components/settings.svelte'
	import Textbox from './components/textbox.svelte'
	import { refreshCosmetics, runState, settings } from './store'
	import { remToPx } from './lib/util'
	import { checkCacheAgeAndRenew } from './lib/cache'
	import Results from './components/results.svelte'
	import Downfall from './components/downfall.svelte'

	const mouseMoved = (e: MouseEvent) => {
		const s = get(settings)
		if (e.x < remToPx(32)) {
			s.opened = true
			s.cosmetics.theme.opened = false
		} else if (e.x > window.innerWidth - remToPx(24)) {
			s.opened = false
			s.cosmetics.theme.opened = true
		} else if (s.opened || s.cosmetics.theme.opened) {
			s.opened = false
			s.cosmetics.theme.opened = false
		} else return

		settings.set(s)
	}

	refreshCosmetics()

	onMount(() => {
		checkCacheAgeAndRenew()
	})
</script>

<main
	class="h-full text-secondary"
	on:mousemove={mouseMoved}
	style="background-image: url({$settings.cosmetics.background
		.bgImg}); background: center center no-repeat; background-size: cover; z-index: -5;">
	<div
		class="main w-full h-full"
		style="opacity: {$settings.cosmetics.background.opacity};">
		<Settings />
		<ChangeTheme />
		<Notifications />
		{#if !$settings.opened}
			<div
				transition:fade={{ duration: 400 }}
				class="text-xl p-5 fixed font-bold coffeetyper">
				Coffeetyper
			</div>

			{#if !$runState.running}
				<div
					transition:fade={{ duration: 400 }}
					class="absolute bottom-0 text-xs p-5"
					style="color: var(--sub-color)">
					Hover to open and close settings
				</div>
			{/if}
		{/if}
		{#if !$runState.running}
			<div
				transition:fade={{ duration: 400 }}
				class="absolute bottom-0 text-xs p-5"
				style="right: 0px; color: var(--sub-color)">
				Hover to open and close themes
			</div>
		{/if}

		{#if $settings.cosmetics.textBox.mode === 'downfall'}
			<Downfall />
		{:else if !$runState.ended}
			<Textbox />
		{:else}
			<Results />
		{/if}
	</div>
</main>

<style global>
	@windicss;

	html,
	body {
		margin: 0;
		height: 100%;
	}

	.main {
		z-index: 1;
		background-color: var(--bg-color);
		color: var(--text-color);
	}
</style>
