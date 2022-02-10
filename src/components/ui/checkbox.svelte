<script lang="ts">
  export let checked: boolean;

  const onClick = (): void => {
    checked = !checked;
  };
</script>

<div
  class="bg-[var(--sub-color)] w-[1rem] h-[1rem] rounded-full {$$props.class} flex justify-center items-center cursor-pointer"
  on:click={onClick}
>
  {#if checked === true}
    <div class="w-[60%] h-[60%] bg-[var(--text-color)] rounded-full" />
  {/if}
</div>
