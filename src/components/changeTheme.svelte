<script lang="ts">
	import { getThemeList, loadTheme } from "../theme";
	import { fade, fly } from "svelte/transition";
	import { settings } from "../store";

	let list: any[] = [];

	(async () => {
		list = await getThemeList();
	})();

	const changeTheme = (name: string) => {
		loadTheme(name);
		$settings.cosmetics.theme.name = name;
	};
</script>

{#if $settings.cosmetics.theme.opened}
	<div
		transition:fade={{ duration: 400 }}
		class="fixed h-screen w-screen flex justify-end overflow-x-hidden overflow-y-scroll scrollbar scrollbar-rounded scrollbar-track-color-transparent scrollbar-thumb-color-current z-2"
	>
		<div
			class="pr-5 grid grid-cols-2 gap-3 w-96 py-3"
			transition:fly={{ x: 100, duration: 400 }}
		>
			{#each list as th}
				<button
					on:click={() => changeTheme(th.name)}
					class="border-none rounded-lg p-3 cursor-pointer duration-150 transform hover:translate-x-[-0.2rem] {th.name ===
					$settings.cosmetics.theme.name
						? 'border-solid-3'
						: ''} flex items-center"
					style="background: {th.bgColor}; color: {th.mainColor}; {th.name ===
					$settings.cosmetics.theme.name
						? `border: 3px solid ${th.mainColor}`
						: ''}"
				>
					{th.name.replace(/_/g, " ")}
				</button>
			{/each}
		</div>
	</div>
{/if}
