<script lang="ts">
  import { fade } from "svelte/transition";
  import ChangeTheme from "./components/changeTheme.svelte";
  import Settings from "./components/settings.svelte";
  import Textbox from "./components/textbox.svelte";
  import { settings } from "./store";

  const mouseMoved = (e: MouseEvent) => {
    if (e.x < window.innerWidth / 3) {
      $settings.opened = true;
    } else if (e.x > window.innerWidth - window.innerWidth / 4) {
      $settings.theme.opened = true;
    } else {
      $settings.opened = false;
      $settings.theme.opened = false;
    }
  };
</script>

<main
  class="h-full text-secondary"
  on:mousemove={mouseMoved}
  style="background-image: url({$settings.background
    .bgImg}); background: center center no-repeat; background-size: cover;"
>
  <div
    class="main w-full h-full"
    style="opacity: {$settings.background.opacity};"
  >
    <Settings />
    <ChangeTheme />
    {#if !$settings.opened}
      <div
        transition:fade={{ duration: 400 }}
        class="text-xl p-5 fixed font-bold"
      >
        Donkeytype
      </div>
    {/if}
    <Textbox />
  </div>
</main>

<style global>
  @windicss;

  html,
  body {
    font-family: "Roboto Mono", monospace;
    margin: 0;
    height: 100%;
  }

  .main {
    z-index: 1;
    background-color: var(--bg-color);
    color: var(--text-color);
  }
</style>
