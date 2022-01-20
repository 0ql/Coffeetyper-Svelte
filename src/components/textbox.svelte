<script lang="ts">
	import { onMount } from "svelte/internal";
	import { crossfade } from "svelte/transition";
	import { runState, settings } from "../store";
	import { letterHighlighting, textArray, startRun } from "./textbox";

	const [send, receive] = crossfade({
		duration: parseInt($settings.cosmetics.textBox.caret.duration),
	});

	let clientHeight = 0;

	setInterval(() => {
		let c = document.getElementById("#cursor");
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
					{$settings.cosmetics.textBox.infobar.liveTime ? $runState.timeString : ""}
				</div>
				<div>
					{$settings.cosmetics.textBox.infobar.liveAccuracy
						? Math.round($runState.accuracy * 100) + "%"
						: ""}
				</div>
				{#if $settings.cosmetics.textBox.infobar.liveWpm}
					<div class="flex items-end">
						{$runState.wpm}<span class="text-xs mb-1">WPM</span>
					</div>
				{/if}
				{#if $settings.cosmetics.textBox.infobar.liveLpm}
					<div class="flex items-end">
						{$runState.lpm}<span class="text-xs mb-1">LPM</span>
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
						.letterSpacing}; line-height: {$settings.cosmetics.textBox.lineHeight};"
				>
					<!-- Word -->
					{#each $textArray as word}
						<div class="inline-block inline-flex text-[var(--sub-color)] word">
							{#each word.letters as letterObj}
								<!-- Caret -->
								{#if letterObj.active}
									<div
										out:send={{ key: 1 }}
										in:receive={{ key: 1 }}
										id="#cursor"
										style="width: {$settings.cosmetics.textBox.caret
											.width}; margin-right: -{$settings.cosmetics.textBox.caret
											.width}; transform: translateX(-{$settings.cosmetics.textBox.caret
											.width}); background-color: {$settings.cosmetics.textBox.caret
											.colored
											? 'var(--caret-color)'
											: ''};"
										class="bg-white {$settings.cosmetics.textBox.caret.rounded
											? 'rounded-full'
											: ''} "
									/>
								{/if}
								<!-- Letter -->
								<div
									style={letterHighlighting(letterObj)}
									class="letter {letterObj.correct ? 'correct' : ''}"
								>
									{#if letterObj.letter === " "}
										<div style="width: {$settings.cosmetics.textBox.spaceWidth};" />
									{:else}
										{letterObj.letter}
									{/if}
								</div>
							{/each}
						</div>
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
					<div class="text-5xl font-bold">{$runState.wpm}</div>
					<div class="mt-4 text-xl">WPM</div>
				</div>
				<div>
					<div class="text-5xl font-bold">{$runState.lpm}</div>
					<div class="mt-4 text-xl">LPM</div>
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
			<div class="opacity-50 mt-4">press {$settings.keybindings.leader.key} + {$settings.keybindings.reset} to restart</div>
		</div>
	</div>
{/if}
