<script lang="ts">
	export let value: any;
</script>

<select
	bind:value
	on:change
	on:mouseenter
	class="bg-[var(--sub-color)] text-[var(--text-color)] border-none h-10 outline-none transform p-2 rounded-lg
					duration-150 hover:translate-x-[0.2rem] cursor-pointer {$$props.class}"
>
	<slot />
</select>
