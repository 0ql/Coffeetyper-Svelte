<script lang="ts">
	export let value: any = "",
		placeholder: string = "";
</script>

<input
	type="text"
	bind:value
	{placeholder}
	class="bg-[var(--sub-color)] text-[var(--text-color)] h-10 border-none outline-none p-2 rounded-lg transform duration-150 hover:translate-x-[0.2rem] focus:translate-x-[0.2rem] {$$props.class}"
/>
