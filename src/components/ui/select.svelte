<script lang="ts">
  export let value: any;
</script>

<select
  bind:value
  on:change
  class="bg-[var(--sub-color)] border-none outline-none transform p-2 rounded-lg
					duration-150 hover:translate-x-[0.5rem] cursor-pointer {$$props.class}"
>
  <slot />
</select>
