<script lang="ts">
	import { onMount } from "svelte/internal";
	import { runState, settings, textArray } from "../store";
	import {  startRun } from "./textbox";
	import Word from "./word.svelte";

	let clientHeight = 0;

	setInterval(() => {
		let c = document.getElementById("#caret");
		if (c) clientHeight = c.clientHeight;
	}, 300);

	onMount(async () => {
		startRun();
	});
</script>

{#if $runState.ended === false}
	<div
		class="h-full w-full flex items-center justify-center absolute text-2xl transition-opacity duration-400 {$settings.opened ||
		$settings.cosmetics.theme.opened
			? ' opacity-30'
			: ''}"
	>
		<div class="flex-col" style="width: {$settings.cosmetics.textBox.width};">
			<div
				id="#infobar"
				class="flex gap-4"
				style="padding-left: {$settings.cosmetics.textBox.caret.width}"
			>
				<div>
					{$settings.cosmetics.textBox.infobar.liveTime
						? $runState.timeString
						: ""}
				</div>
				<div>
					{$settings.cosmetics.textBox.infobar.liveAccuracy
						? $runState.accuracy + "%"
						: ""}
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
				id="#box"
				class="overflow-hidden w-full z-1"
				style="height: {clientHeight
					? clientHeight * parseInt($settings.cosmetics.textBox.lines)
					: 0}px; padding-left: {$settings.cosmetics.textBox.caret
					.width}; font-size: {$settings.cosmetics.textBox.fontSize};"
			>
				<div
					class="inline-flex flex-wrap letter"
					style="letter-spacing: {$settings.cosmetics.textBox
						.letterSpacing}; line-height: {$settings.cosmetics.textBox
						.lineHeight};"
				>
					<!-- Word -->
					{#each $textArray as word}
						<Word {word} />
					{/each}
				</div>
			</div>
		</div>
	</div>
{:else}
	<div
		class="w-full h-full flex items-center justify-center transition-opacity duration-400 {$settings.opened ||
		$settings.cosmetics.theme.opened
			? ' opacity-30'
			: ''}"
	>
		<div style="width: {$settings.cosmetics.textBox.width};">
			<div class="flex gap-5">
				<div>
					<div class="text-5xl font-bold">{$runState.aggWPM}</div>
					<div class="mt-4 text-xl">WPM</div>
				</div>
				<div>
					<div class="text-5xl font-bold">{$runState.aggSPM}</div>
					<div class="mt-4 text-xl">SPM</div>
				</div>
				<div>
					<div class="text-5xl font-bold">
						{$runState.accuracy}%
					</div>
					<div class="mt-4 text-xl">Accuracy</div>
				</div>
				<div>
					<div class="text-5xl font-bold">{$runState.timePassed}</div>
					<div class="mt-4 text-xl">Time</div>
				</div>
			</div>
			<div class="opacity-50 mt-4">
				press {$settings.keybindings.leader.key} + {$settings.keybindings.reset}
				to restart
			</div>
		</div>
	</div>
{/if}
