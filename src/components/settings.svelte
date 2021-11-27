<script lang="ts">
  import { fade, fly } from "svelte/transition";
  import { settings } from "../store";
  import type { Font } from "../font";
  import Input from "./ui/input.svelte";
  import Select from "./ui/select.svelte";
  import Checkbox from "./ui/checkbox.svelte";

  let fonts: Font[];

  (async () => {
    const res = await fetch(
      "https://www.googleapis.com/webfonts/v1/webfonts?key=AIzaSyC5aKFZzHKdeM8BuDGs5gXotGo2XJ8JsWs"
    );
    fonts = (await res.json())["items"];
  })();

  const changeFont = () => {
    fonts.filter((font) => {
      if (font.family === $settings.font.family) {
        $settings.font = font;
      }
    });
  };
</script>

{#if $settings.opened}
  <div transition:fade={{ duration: 400 }} class="fixed h-full z-2">
    <div class="pl-5" transition:fly={{ x: -100 }}>
      <div class="text-primary py-5 font-bold text-xl">Settings</div>
      <div>Font Family</div>
      <Select
        class="mt-3"
        bind:value={$settings.font.family}
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
            bind:value={$settings.textBox.width}
          />
        </div>
        <div>
          <div class="text-xs">Lines</div>
          <Input
            class="mt-2 w-10 text-center"
            bind:value={$settings.textBox.lines}
          />
        </div>
        <div>
          <div class="text-xs">Line Height</div>
          <Input
            class="mt-2 w-20 text-center"
            bind:value={$settings.textBox.lineHeight}
          />
        </div>
        <div>
          <div class="text-xs">Words</div>
          <Input
            class="mt-2 w-10 text-center"
            bind:value={$settings.textBox.words}
          />
        </div>
        <div>
          <div class="text-xs">Letter Spacing</div>
          <Input
            class="mt-2 w-20 text-center"
            bind:value={$settings.textBox.letterSpacing}
          />
        </div>
      </div>

      <div class="mt-5">Caret</div>
      <div class="flex gap-2 mt-2">
        <Checkbox bind:checked={$settings.textBox.caret.rounded} />
        <div class="text-xs">Rounded</div>
      </div>
      <div class="flex gap-4 mt-2">
        <div>
          <div class="text-xs">Speed</div>
          <Input
            class="mt-2 w-10 text-center"
            bind:value={$settings.textBox.caret.duration}
          />
        </div>
        <div>
          <div class="text-xs">Width</div>
          <Input
            class="mt-2 w-20 text-center"
            bind:value={$settings.textBox.caret.width}
          />
        </div>
      </div>

      <div class="mt-5">Wordset</div>
      <Select class="mt-3" bind:value={$settings.wordSet}>
        <option value="top 1k">Top 1k words english</option>
      </Select>

      <div class="flex gap-3">
        <div>
          <div class="mt-5">Mode</div>
          <Select class="mt-3" bind:value={$settings.modeName}>
            <option value="timed">Timed</option>
            <option value="countdown">Countdown</option>
            <option value="countup">Countup</option>
          </Select>
        </div>
        <div>
          <div class="mt-5">Time</div>
          <Input class="mt-3 w-30" bind:value={$settings.mode.time} />
        </div>
      </div>
    </div>
  </div>
{/if}
