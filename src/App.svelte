<script lang="ts">
	import { get } from "svelte/store";
	import { fade } from "svelte/transition";
	import ChangeTheme from "./components/changeTheme.svelte";
	import Settings from "./components/settings.svelte";
	import Textbox from "./components/textbox.svelte";
	import { refreshCosmetics, settings } from "./store";

	const mouseMoved = (e: MouseEvent) => {
		const s = get(settings);
		if (e.x < window.innerWidth / 3) {
			s.opened = true;
		} else if (e.x > window.innerWidth - window.innerWidth / 4) {
			s.cosmetics.theme.opened = true;
		} else if (s.opened) {
			s.opened = false;
			s.cosmetics.theme.opened = false;
		} else return;

		settings.set(s);
	};

	refreshCosmetics();
</script>

<main
	class="h-full text-secondary"
	on:mousemove={mouseMoved}
	style="background-image: url({$settings.cosmetics.background
		.bgImg}); background: center center no-repeat; background-size: cover; z-index: -5;"
>
	<div
		class="main w-full h-full"
		style="opacity: {$settings.cosmetics.background.opacity};"
	>
		<Settings />
		<ChangeTheme />
		{#if !$settings.opened}
			<div
				transition:fade={{ duration: 400 }}
				class="text-xl p-5 fixed font-bold"
			>
				Donkeytype
			</div>
		{/if}
		<Textbox />
	</div>
</main>

<style global>
	@windicss;

	html,
	body {
		font-family: "Roboto Mono", monospace;
		margin: 0;
		height: 100%;
	}

	.main {
		z-index: 1;
		background-color: var(--bg-color);
		color: var(--text-color);
	}
</style>
