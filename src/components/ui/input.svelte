<script lang="ts">
	let {
		value = $bindable(),
		placeholder = '',
		class: className = '',
	}: { value?: any; placeholder?: string; class?: string } = $props()
</script>

<input
	type="text"
	bind:value
	{placeholder}
	class="bg-[var(--sub-color)] text-[var(--text-color)] h-10 border-none outline-none p-2 rounded-lg transform duration-150 hover:translate-x-[0.2rem] focus:translate-x-[0.2rem] {className}"
/>
