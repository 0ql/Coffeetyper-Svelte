<script lang="ts">
	import type { Snippet } from 'svelte'
	import type { HTMLSelectAttributes } from 'svelte/elements'

	let {
		value = $bindable(),
		class: className = '',
		children,
		...rest
	}: HTMLSelectAttributes & { value: any; children?: Snippet } = $props()
</script>

<select
	{...rest}
	bind:value
	class="bg-[var(--sub-color)] text-[var(--text-color)] border-none h-10 outline-none transform p-2 rounded-lg
					duration-150 hover:translate-x-[0.2rem] cursor-pointer {className}"
>
	{@render children?.()}
</select>
