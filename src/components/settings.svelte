<script lang="ts">
	import { fade, fly } from "svelte/transition";
	import { fixBwithA, refreshCosmetics, settings, template } from "../store";
	import Input from "./ui/input.svelte";
	import Select from "./ui/select.svelte";
	import Checkbox from "./ui/checkbox.svelte";
	import Button from "./ui/button.svelte";
	import { getFromLocalStorage, saveToLocalStorage } from "../util";
	import { get } from "svelte/store";
	import { getFonts, randomizeSettings } from "./settings";

	let fonts: any[];

	(async () => {
		fonts = await getFonts();
	})();

	const changeFont = () => {
		fonts.filter((font) => {
			if (font.family === $settings.cosmetics.family) {
				$settings.cosmetics.family = font.family;
			}
		});
	};

	let newName: string = "";
	const saveCosmetics = () => {
		if (newName.length < 1) {
			alert("Please enter a name");
			return;
		}

		let c = getFromLocalStorage("savedCosmetics");
		if (c === null) c = {};

		c[newName] = get(settings).cosmetics;
		saveToLocalStorage("savedCosmetics", c);
		getSavedCosmetics();
	};

	let savedCosmetics: any = {};
	const getSavedCosmetics = () => {
		let c = getFromLocalStorage("savedCosmetics");
		if (c === null) c = {};

		savedCosmetics = c;
	};

	const changeCosmetics = (name: string) => {
		const c = getFromLocalStorage("savedCosmetics")[name];
		settings.update((s) => {
			s.cosmetics = c;
			return s;
		});
		refreshCosmetics();
	};

	const deleteSetting = (name: string) => {
		let s = getFromLocalStorage("savedCosmetics");
		delete s[name];
		saveToLocalStorage("savedCosmetics", s);
		getSavedCosmetics();
	};

	const exportCosmetics = (name: string) => {
		const data = JSON.stringify(getFromLocalStorage("savedCosmetics")[name]);
		navigator.clipboard.writeText(data);
	};

	let imported = "";
	const importCosmetics = () => {
		const data = JSON.parse(imported);
		$settings.cosmetics = fixBwithA($settings.cosmetics, data);
		refreshCosmetics()
	}

	const resetToDefault = () => {
		$settings = template;
		refreshCosmetics()
	};

	getSavedCosmetics();
</script>

{#if $settings.opened}
	<div
		transition:fade={{ duration: 400 }}
		style="direction: rtl;"
		class="fixed h-full z-2 overflow-x-hidden overflow-y-scroll scrollbar-thin scrollbar-thumb-current scrollbar-thumb-rounded scrollbar-track-transparent"
	>
		<div class="pl-5 py-5" style="direction: ltr;" transition:fly={{ x: -100 }}>
			<div class="flex gap-6">
				<div class="text-primary font-bold text-xl">Settings</div>
				<div
					class="text-xs mt-2 cursor-pointer"
					on:click={() =>
						window.open("https://github.com/0ql/Donkeytype", "_blank")}
				>
					Github
				</div>
			</div>
			<div class="mt-5">Font Family</div>
			<Select
				class="mt-3"
				bind:value={$settings.cosmetics.family}
				on:change={changeFont}
			>
				{#if fonts}
					{#each fonts as font}
						<option value={font.family}>{font.family}</option>
					{/each}
				{/if}
			</Select><br />

			<div class="mt-5">Textbox</div>
			<div class="mt-2 flex gap-3">
				<div>
					<div class="text-xs">Width</div>
					<Input
						class="mt-2 w-15 text-center"
						bind:value={$settings.cosmetics.textBox.width}
					/>
				</div>
				<div>
					<div class="text-xs">Lines</div>
					<Input
						class="mt-2 w-10 text-center"
						bind:value={$settings.cosmetics.textBox.lines}
					/>
				</div>
				<div>
					<div class="text-xs">Line Height</div>
					<Input
						class="mt-2 w-20 text-center"
						bind:value={$settings.cosmetics.textBox.lineHeight}
					/>
				</div>
				<div>
					<div class="text-xs">Words</div>
					<Input
						class="mt-2 w-15 text-center"
						bind:value={$settings.cosmetics.textBox.words}
					/>
				</div>
				<div>
					<div class="text-xs">Letter Spacing</div>
					<Input
						class="mt-2 w-20 text-center"
						bind:value={$settings.cosmetics.textBox.letterSpacing}
					/>
				</div>
			</div>
			<div class="flex gap-3 mt-2">
				<div>
					<div class="text-xs">Font Size</div>
					<Input
						class="mt-2 w-20 text-center"
						bind:value={$settings.cosmetics.textBox.fontSize}
					/>
				</div>
				<div>
					<div class="text-xs">Space Width</div>
					<Input
						class="mt-2 w-20 text-center"
						bind:value={$settings.cosmetics.textBox.spaceWidth}
					/>
				</div>
			</div>

			<div class="mt-5">Caret</div>
			<div class="flex gap-4 mt-2">
				<div class="flex gap-2">
					<Checkbox bind:checked={$settings.cosmetics.textBox.caret.rounded} />
					<div class="text-xs">Rounded</div>
				</div>
				<div class="flex gap-2">
					<Checkbox bind:checked={$settings.cosmetics.textBox.caret.colored} />
					<div class="text-xs">Colored</div>
				</div>
			</div>
			<div class="flex gap-4 mt-2">
				<div>
					<div class="text-xs">Speed in ms</div>
					<Input
						class="mt-2 w-20 text-center"
						bind:value={$settings.cosmetics.textBox.caret.duration}
					/>
				</div>
				<div>
					<div class="text-xs">Width</div>
					<Input
						class="mt-2 w-20 text-center"
						bind:value={$settings.cosmetics.textBox.caret.width}
					/>
				</div>
			</div>

			<div class="mt-5">Infobar</div>
			<div class="flex gap-3">
				<div>
					<div class="flex gap-2 mt-2">
						<Checkbox
							bind:checked={$settings.cosmetics.textBox.infobar.liveAccuracy}
						/>
						<div class="text-xs">Live Accuracy</div>
					</div>
					<div class="flex gap-2 mt-2">
						<Checkbox
							bind:checked={$settings.cosmetics.textBox.infobar.liveLpm}
						/>
						<div class="text-xs">Live LPM</div>
					</div>
				</div>
				<div>
					<div class="flex gap-2 mt-2">
						<Checkbox
							bind:checked={$settings.cosmetics.textBox.infobar.liveWpm}
						/>
						<div class="text-xs">Live WPM</div>
					</div>
					<div class="flex gap-2 mt-2">
						<Checkbox
							bind:checked={$settings.cosmetics.textBox.infobar.liveTime}
						/>
						<div class="text-xs">Live Time</div>
					</div>
				</div>
			</div>

			<div class="mt-5">Randomize Settings</div>
			<div class="flex gap-4 mt-3">
				<Button on:click={randomizeSettings}>Randomize</Button>
				<Button on:click={resetToDefault}>Reset to Default</Button>
			</div>

			<div class="mt-5">Wordset</div>
			<Select class="mt-3" bind:value={$settings.wordSet}>
				<option value="top 1k">Top 1k words english</option>
				<option value="randomAlpha">Random Characters</option>
				<option value="randomAlphaNum">Random Characters w/ Numbers</option>
			</Select>

			<div class="flex gap-4 mt-5">
				<div>
					<div>Mode</div>
					<Select class="mt-3 h-10 w-43" bind:value={$settings.modeName}>
						<option value="timed">Timed</option>
						<option value="countdown">Countdown</option>
						<option value="countup">Countup</option>
					</Select>
				</div>
				<div>
					<div>Time in sec</div>
					<Input
						class="mt-3 h-10 text-center w-20"
						bind:value={$settings.mode.time}
					/>
				</div>
			</div>

			<div class="mt-5">Background Image</div>
			<div class="flex gap-4 mt-3">
				<div>
					<div class="text-xs">Url</div>
					<Input
						class="mt-3"
						placeholder="Paste url here"
						bind:value={$settings.cosmetics.background.bgImg}
					/>
				</div>
				<div>
					<div class="text-xs">Opacity</div>
					<Input
						class="mt-3 w-15 text-center"
						bind:value={$settings.cosmetics.background.opacity}
					/>
				</div>
			</div>

			<div class="mt-5">Save Cosmetics</div>
			<div class="mt-3 text-xs">Name</div>
			<div class="flex gap-4 mt-3">
				<Input
					placeholder={$settings.cosmetics.theme.name}
					bind:value={newName}
				/>
				<Button class="w-15" on:click={saveCosmetics}>Save</Button>
			</div>

			<div class="mt-5">Import Cosmetics</div>
			<div class="mt-3 text-xs">Paste</div>
			<div>
				<Input
					placeholder="Paste settings here"
					class="mt-3 mr-3"
					bind:value={imported}
				/>
				<Button class="w-15" on:click={importCosmetics}>Load</Button>
			</div>

			<div class="mt-5">Saved Cosmetics</div>
			<div class="my-3">
				{#each Object.keys(savedCosmetics) as name}
					<div class="mt-4 text-sm">{name}</div>
					<div class="flex gap-3 mt-1 text-sm">
						<div>
							<div class="flex mt-1 gap-3">
								<Button on:click={() => changeCosmetics(name)}>Load</Button>
							</div>
						</div>
						<div>
							<div class="flex mt-1 gap-3">
								<Button on:click={() => exportCosmetics(name)}
									>Copy to clipboard</Button
								>
								<Button on:click={() => deleteSetting(name)}>Delete</Button>
							</div>
						</div>
					</div>
				{/each}
				{#if Object.keys(savedCosmetics).length === 0}
					<div class="text-sm my-3">
						Looks to be empty here... Try saving your favorite configuration and <br
						/>
						share it with your friends!
					</div>
				{/if}
			</div>

			<div>Keybindings</div>
			<div class="flex gap-4">
				<div>
					<div class="text-sm my-3">Leaderkey</div>
					<Input bind:value={$settings.keybindings.leader.key} />
					<div class="text-sm my-3">Reset Run</div>
					<Input bind:value={$settings.keybindings.reset} />
					<div class="text-sm my-3">Randomize Settings</div>
					<Input bind:value={$settings.keybindings.randomizeSettings} />
				</div>
				<div>
					<div class="text-sm my-3">Toggle Settings</div>
					<Input bind:value={$settings.keybindings.toggleSettings} />
					<div class="text-sm my-3">Toggle Themeswitcher</div>
					<Input bind:value={$settings.keybindings.toggleTheme} />
				</div>
			</div>
		</div>
	</div>
{/if}
