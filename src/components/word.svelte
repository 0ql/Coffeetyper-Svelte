<script lang="ts">
  import { settings } from '../store'
  import type { Word } from '../store'
  import { letterHighlighting } from './ts/textbox'
  import Caret from './caret.svelte'
  export let word: Word
	export let caret: boolean = true
</script>

<div
  class="inline-block inline-flex text-[var(--sub-color)] word"
  style="height: {$settings.cosmetics.textBox.lineHeight};"
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
      {#if letterObj.letter === ' '}
        <div style="width: {$settings.cosmetics.textBox.spaceWidth};" />
      {:else}
        {letterObj.letter}
      {/if}
    </div>
  {/each}
</div>
