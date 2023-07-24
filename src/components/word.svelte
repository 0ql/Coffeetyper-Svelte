<script lang="ts">
	import { incorrectLettersMapWritable, settings } from "../store";
	import type { Word } from "../store";
	import { letterHighlighting } from "./ts/textbox";
	import Caret from "./caret.svelte";
	export let word: Word;
	export let caret: boolean = true;
</script>

<div
	class="inline-block inline-flex text-[var(--sub-color)] rounded-lg"
	style="height: {$settings.cosmetics.textBox
		.lineHeight}; background-color: {word.active && $settings.highlighting.words
		? '#ffffff08'
		: '#0000'};"
>
	{#each word.letters as letterObj}
		<!-- Caret -->
		{#if caret && letterObj.active}
			<Caret />
		{/if}
		<!-- Letter -->
		<div
			style={letterHighlighting(letterObj)}
			class="letter {letterObj.correct ? 'correct' : ''}"
		>
			{#if letterObj.letter === " "}
				<div style="width: {$settings.cosmetics.textBox.spaceWidth};" />
			{:else if word.redHighlight && $incorrectLettersMapWritable.has(letterObj.letter)}
				<div
					class={$settings.highlighting.wrong ? "bg-red-400 bg-opacity-8" : ""}
				>
					{letterObj.letter}
				</div>
			{:else}
				{letterObj.letter}
			{/if}
		</div>
	{/each}
</div>
