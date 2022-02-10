<script lang="ts">
	import { settings } from "../store";
	import type { WordT } from "../store";
	import { send, receive, letterHighlighting } from "./textbox";
	export let word: WordT;
</script>

<div
	class="inline-block inline-flex text-[var(--sub-color)] word"
	style="height: {$settings.cosmetics.textBox.lineHeight};"
>
		{#each word as letterObj}
			<!-- Caret -->
			{#if letterObj.active}
				<div
					out:send={{ key: 1 }}
					in:receive={{ key: 1 }}
					style="width: {$settings.cosmetics.textBox.caret
						.width}; margin-right: -{$settings.cosmetics.textBox.caret
						.width}; transform: translateX(-{$settings.cosmetics.textBox.caret
						.width}); background-color: {$settings.cosmetics.textBox.caret
						.colored
						? 'var(--caret-color)'
						: ''};"
					class="caret bg-white {$settings.cosmetics.textBox.caret.rounded
						? 'rounded-full'
						: ''} "
					id="#caret"
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
