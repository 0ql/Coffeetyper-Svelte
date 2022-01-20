<script lang="ts">
  import { getThemeList, loadTheme } from "../theme";
  import { fade, fly } from "svelte/transition";
  import { settings } from "../store";

  let list: any[] = [];

  (async () => {
    list = await getThemeList();
  })();

  const changeTheme = (name: string) => {
    loadTheme(name);
    $settings.cosmetics.theme.active = name;
  };
</script>

{#if $settings.cosmetics.theme.opened === true}
  <div
    transition:fade={{ duration: 400 }}
    class="fixed h-screen w-screen flex justify-end overflow-x-hidden overflow-y-scroll scrollbar-thin scrollbar-thumb-current scrollbar-thumb-rounded scrollbar-track-transparent z-2"
  >
    <div class="pr-5" transition:fly={{ x: 100, duration: 400 }}>
      <div class="py-5 font-bold text-xl">Theme</div>
      {#each list as th}
        <div
          on:click={() => changeTheme(th.name)}
          class="m-2 rounded-lg p-2 cursor-pointer duration-150 transform hover:translate-x-[-0.5rem]"
          style="background: {th.bgColor}; color: {th.textColor}"
        >
          {th.name.replace(/_/g, " ")}
        </div>
      {/each}
    </div>
  </div>
{/if}
