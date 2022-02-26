<script lang="ts">
	import { remToPx } from '../lib/util'
	import { onMount } from 'svelte/internal'
	import { runState, settings, textArray } from '../store'
	import { startRun } from './ts/textbox'
	import Word from './word.svelte'

	onMount(async () => {
		startRun()
	})

	$: topMargin =
		remToPx(parseFloat($settings.cosmetics.textBox.lineHeight)) *
		(parseInt($settings.cosmetics.textBox.lines) / 2)
</script>

<div
	class="h-full w-full flex items-center justify-center absolute text-2xl transition-opacity duration-400 {$settings.opened ||
	$settings.cosmetics.theme.opened
		? ' opacity-30'
		: ''}">
	<div class="flex-col" style="width: {$settings.cosmetics.textBox.width};">
		<div
			id="infobar"
			class="flex gap-4"
			style="padding-left: {$settings.cosmetics.textBox.caret.width}">
			<div>
				{$settings.cosmetics.textBox.infobar.liveTime
					? $runState.timeString
					: ''}
			</div>
			<div>
				{$settings.cosmetics.textBox.infobar.liveAccuracy
					? $runState.accuracy + '%'
					: ''}
			</div>
			{#if $settings.cosmetics.textBox.infobar.liveWpm}
				<div class="flex items-end">
					{$runState.liveWPM}<span class="text-xs mb-1">WPM</span>
				</div>
			{/if}
			{#if $settings.cosmetics.textBox.infobar.liveLpm}
				<div class="flex items-end">
					{$runState.liveSPM}<span class="text-xs mb-1">SPM</span>
				</div>
			{/if}
			{#if $settings.keybindings.leader.pressed}
				<div>Leader</div>
			{/if}
		</div>
		<div
			id="box"
			class="overflow-hidden w-full z-1"
			style="height: {$settings.cosmetics.textBox.lineHeight
				? remToPx(parseFloat($settings.cosmetics.textBox.lineHeight)) *
				  parseInt($settings.cosmetics.textBox.lines)
				: 0}px; padding-left: {$settings.cosmetics.textBox.caret
				.width}; font-size: {$settings.cosmetics.textBox.fontSize};">
			<div
				class="flex-wrap letter"
				style="letter-spacing: {$settings.cosmetics.textBox
					.letterSpacing}; line-height: {$settings.cosmetics.textBox
					.lineHeight}; display: {$settings.cosmetics.textBox.mode === 'classic'
					? 'inline-flex'
					: ''}
					
				">
				{#each $textArray as word, i}
					{#if $settings.cosmetics.textBox.mode === 'speed'}
						<div
							class="text-justify flex text-[var(--sub-color)] word"
							style="height: {$settings.cosmetics.textBox
								.lineHeight}; margin-top: {i === 0 ? topMargin : 0}px;">
							<div class="flex items-end w-10 text-xs">
								{#if word.wpm}
									{word.wpm}
								{/if}
							</div>
							<div>
								<Word {word} caret={false} />
								{#if word.wpm}
									<div
										class="h-1 bg-[var(--sub-color)]"
										style="width: {word.wpm}px" />
								{/if}
							</div>
						</div>
					{:else}
						<Word {word} />
					{/if}
				{/each}
			</div>
		</div>
	</div>
</div>
