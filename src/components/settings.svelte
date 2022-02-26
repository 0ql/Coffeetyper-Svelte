<script lang="ts">
	import { fly } from 'svelte/transition'
	import { fixBwithA, refreshCosmetics, settings, template } from '../store'
	import Input from './ui/input.svelte'
	import Select from './ui/select.svelte'
	import Checkbox from './ui/checkbox.svelte'
	import Button from './ui/button.svelte'
	import { getFromLocalStorage, saveToLocalStorage } from '../lib/util'
	import { getFonts, randomizeSettings, saveCosmetics } from './ts/settings'
	import { sendNotification } from './ts/notifications'
	import Tooltip from './ui/tooltip.svelte'
	import { resetRun } from './ts/textbox'

	let fonts: string[]
	let newName: string
	;(async () => {
		fonts = await getFonts()
	})()

	let savedCosmetics: any = {}
	const getSavedCosmetics = () => {
		let c = getFromLocalStorage('savedCosmetics')
		if (c === null) c = {}

		savedCosmetics = c
	}

	const changeCosmetics = (name: string) => {
		const c = getFromLocalStorage('savedCosmetics')[name]
		settings.update((s) => {
			s.cosmetics = c
			return s
		})
		refreshCosmetics()
	}

	const deleteSetting = (name: string) => {
		let s = getFromLocalStorage('savedCosmetics')
		delete s[name]
		saveToLocalStorage('savedCosmetics', s)
		getSavedCosmetics()
	}

	const exportCosmetics = (name: string) => {
		const data = JSON.stringify(getFromLocalStorage('savedCosmetics')[name])
		navigator.clipboard.writeText(data)
		sendNotification({
			content: 'Copied to Clipboard!',
			type: 'info',
		})
	}

	let imported = ''
	const importCosmetics = () => {
		const data = JSON.parse(imported)
		$settings.cosmetics = fixBwithA($settings.cosmetics, data)
		refreshCosmetics()
	}

	const resetToDefault = () => {
		$settings = template
		refreshCosmetics()
	}

	getSavedCosmetics()

	let fontsFocus: boolean = false
</script>

{#if $settings.opened}
	<div
		transition:fly={{ duration: 400, x: -100 }}
		style="direction: rtl;"
		class="fixed h-full z-2 overflow-x-hidden overflow-y-scroll scrollbar-thin scrollbar-thumb-current scrollbar-thumb-rounded scrollbar-track-transparent w-128">
		<div class="pl-5 py-5 inline" style="direction: ltr;">
			<div class="grid grid-cols-4 auto-rows-auto gap-3 p-3">
				<div class="text-primary font-bold text-xl">Settings</div>
				<div
					class="text-xs mt-2 cursor-pointer"
					on:click={() =>
						window.open('https://github.com/0ql/Coffeetyper', '_blank')}>
					Github
				</div>
				<div
					class="text-xs mt-2 cursor-pointer"
					on:click={() =>
						window.open('https://discord.gg/DEyH5FggQR', '_blank')}>
					Discord
				</div>

				<div class="mt-5 col-span-4">Font Family</div>

				<Select
					class="col-span-4 h-10 w-full"
					bind:value={$settings.cosmetics.family}
					on:change={refreshCosmetics}
					on:mouseenter={() => {
						fontsFocus = true
					}}>
					{#if fonts && fontsFocus}
						{#each fonts as font}
							<option value={font}>{font}</option>
						{/each}
					{:else}
						<option value={$settings.cosmetics.family}
							>{$settings.cosmetics.family}</option>
					{/if}
				</Select>

				<div class="col-span-2">
					<div>Mode</div>
					<Select class="mt-3 h-10 w-full" bind:value={$settings.modeName}>
						<option value="timed">Timed</option>
						<option value="countdown">Countdown</option>
						<option value="countup">Countup</option>
					</Select>
				</div>
				<div>
					<div>Sec</div>
					<Input
						class="mt-3 h-10 text-center w-full"
						bind:value={$settings.mode.time} />
				</div>
				<div>
					<div>Words</div>
					<Input
						class="mt-3 h-10 text-center w-full"
						bind:value={$settings.words} />
				</div>

				<div class="mt-3 col-span-4">Textbox</div>

				<Tooltip
					hoverText="In 'Speed' Mode at least 6 lines are recommended. Both 'Speed' and 'Downfall' are experimental.">
					<div>
						<div class="text-xs">Mode</div>
						<Select
							class="h-10 w-full mt-2"
							on:change={resetRun}
							bind:value={$settings.cosmetics.textBox.mode}>
							<option value="classic">Classic</option>
							<option value="downfall">Downfall</option>
							<option value="speed">Speed</option>
						</Select>
					</div>
				</Tooltip>
				<div>
					<div class="text-xs">Width</div>
					<Input
						class="mt-2 text-center w-full"
						bind:value={$settings.cosmetics.textBox.width} />
				</div>
				<div>
					<div class="text-xs">Lines</div>
					<Input
						class="mt-2 text-center w-full"
						bind:value={$settings.cosmetics.textBox.lines} />
				</div>
				<div>
					<div class="text-xs">Line Height</div>
					<Input
						class="mt-2 text-center w-full"
						bind:value={$settings.cosmetics.textBox.lineHeight} />
				</div>
				<div>
					<div class="text-xs">Letter Spacing</div>
					<Input
						class="mt-2 text-center w-full"
						bind:value={$settings.cosmetics.textBox.letterSpacing} />
				</div>

				<div>
					<div class="text-xs">Font Size</div>
					<Input
						class="mt-2 text-center w-full"
						bind:value={$settings.cosmetics.textBox.fontSize} />
				</div>
				<div>
					<div class="text-xs">Space Width</div>
					<Input
						class="mt-2 text-center w-full"
						bind:value={$settings.cosmetics.textBox.spaceWidth} />
				</div>
				<div class="col-span-1" />

				<div class="col-span-4 mt-3">Text Generation</div>

				<div class="col-span-2">
					<div class="text-xs">Choose text source</div>
					<Select class="h-10 w-full mt-2" bind:value={$settings.gen.set}>
						<option value="preset">Preset</option>
						<option value="api">Api</option>
						<option value="custom">Custom</option>
					</Select>
				</div>

				{#if $settings.gen.set === 'preset' || $settings.gen.set === 'api'}
					<div class="col-span-2">
						<div class="text-xs">Presets</div>
						<Select class="h-10 w-full mt-2" bind:value={$settings.gen.preSet}>
							{#if $settings.gen.set === 'api'}
								<option value="wikipedia">Wikipedia</option>
							{:else}
								<option value="top 1k">Top 1k words english</option>
							{/if}
						</Select>
					</div>
				{:else if $settings.gen.set === 'custom'}
					<div class="col-span-2">
						<div class="text-xs">Custom Text</div>
						<Input
							class="w-full mt-2"
							placeholder="Input custom text here"
							bind:value={$settings.gen.customTxT} />
					</div>
				{/if}

				<div class="col-span-4 text-sm">Text Filters</div>

				<div class="col-span-4 text-xs">Casing</div>
				<Select
					class="col-span-4 h-10 w-full"
					bind:value={$settings.gen.filters.casing}>
					<option value="default">Default</option>
					<option value="lowercase">Lowercase</option>
					<option value="uppercase">Uppercase</option>
					<option value="random">Random</option>
					<option value="wordBeginning"
						>Uppercase first letter of every Word</option>
				</Select>

				<div class="col-span-2 mt-3">Caret</div>

				<div class="col-span-2 mt-3">Infobar</div>

				<div class="flex gap-2">
					<Checkbox bind:checked={$settings.cosmetics.textBox.caret.rounded} />
					<div class="text-xs">Rounded</div>
				</div>

				<div class="flex gap-2">
					<Checkbox bind:checked={$settings.cosmetics.textBox.caret.colored} />
					<div class="text-xs">Colored</div>
				</div>

				<div class="flex gap-2">
					<Checkbox
						bind:checked={$settings.cosmetics.textBox.infobar.liveAccuracy} />
					<div class="text-xs">L. Accuracy</div>
				</div>

				<div class="flex gap-2">
					<Checkbox
						bind:checked={$settings.cosmetics.textBox.infobar.liveLpm} />
					<div class="text-xs">Live SPM</div>
				</div>

				<Tooltip hoverText="You can set the speed to 1 for instant movement.">
					<div class="text-xs">Speed in ms</div>
					<Input
						class="mt-2 text-center w-full"
						bind:value={$settings.cosmetics.textBox.caret.duration} />
				</Tooltip>

				<div>
					<div class="text-xs">Width</div>
					<Input
						class="mt-2 text-center w-full"
						bind:value={$settings.cosmetics.textBox.caret.width} />
				</div>

				<div class="flex gap-2">
					<Checkbox
						bind:checked={$settings.cosmetics.textBox.infobar.liveWpm} />
					<div class="text-xs">Live WPM</div>
				</div>

				<div class="flex gap-2">
					<Checkbox
						bind:checked={$settings.cosmetics.textBox.infobar.liveTime} />
					<div class="text-xs">Live Time</div>
				</div>

				<div class="col-span-4 mt-3">Randomize Settings</div>

				<Button class="col-span-2" on:click={randomizeSettings}
					>Randomize</Button>
				<Button class="col-span-2" on:click={resetToDefault}
					>Reset to Default</Button>

				<div class="col-span-4 mt-3">Background Image</div>

				<div class="col-span-3">
					<div class="text-xs">Url</div>
					<Input
						class="mt-2 w-full"
						placeholder="Paste url here"
						bind:value={$settings.cosmetics.background.bgImg} />
				</div>
				<div class="col-span-1">
					<div class="text-xs">Opacity</div>
					<Input
						class="mt-2 text-center w-full"
						bind:value={$settings.cosmetics.background.opacity} />
				</div>

				<div class="col-span-4 mt-3">Save Cosmetics</div>
				<div class="text-xs col-span-4">Name</div>
				<Input
					class="col-span-3 w-full"
					placeholder={$settings.cosmetics.theme.name}
					bind:value={newName} />
				<Button
					on:click={() => {
						saveCosmetics(newName)
						getSavedCosmetics()
					}}>Save</Button>

				<div class="col-span-4 mt-3">Import Cosmetics</div>
				<div class="text-xs col-span-4">Paste</div>
				<Input
					placeholder="Paste settings here"
					class="col-span-3 w-full"
					bind:value={imported} />
				<Button on:click={importCosmetics}>Load</Button>

				<div class="col-span-4 mt-3">Saved Cosmetics</div>
				{#each Object.keys(savedCosmetics) as name}
					<div class="col-span-4 text-sm">{name}</div>
					<Button on:click={() => changeCosmetics(name)}>Load</Button>
					<Button class="col-span-2" on:click={() => exportCosmetics(name)}
						>Copy to clipboard</Button>
					<Button on:click={() => deleteSetting(name)}>Delete</Button>
				{/each}
				{#if Object.keys(savedCosmetics).length === 0}
					<div class="text-sm col-span-4">
						Looks to be empty here... Try saving your favorite configuration and
						share it with your friends!
					</div>
				{/if}

				<!-- <Tooltip
				hoverText="To bind the Escape button type 'Escape'. Same with 'Alt', 'Tab' and 'Control'. You can also map the same key to the leader and for example 'Reset Run' to double press the key to reset."
				</Tooltip>
			> -->

				<div class="col-span-4 mt-3">Keybindings</div>

				<div>
					<div class="text-sm">Leaderkey</div>
					<Input
						class="mt-2 w-full"
						bind:value={$settings.keybindings.leader.key} />
				</div>

				<div>
					<div class="text-sm">Reset Run</div>
					<Input class="mt-2 w-full" bind:value={$settings.keybindings.reset} />
				</div>

				<div>
					<div class="text-sm">Randomize</div>
					<Input
						class="mt-2 w-full"
						bind:value={$settings.keybindings.randomizeSettings} />
				</div>

				<div>
					<div class="text-sm">Settings</div>
					<Input
						class="mt-2 w-full"
						bind:value={$settings.keybindings.toggleSettings} />
				</div>

				<div>
					<div class="text-sm">Themes</div>
					<Input
						class="mt-2 w-full"
						bind:value={$settings.keybindings.toggleTheme} />
				</div>

				<div class="flex items-center gap-2 col-span-4 mt-3">
					<Checkbox bind:checked={$settings.showToolTips} />
					<div>Show Tooltips</div>
				</div>
			</div>
		</div>
	</div>
{/if}
