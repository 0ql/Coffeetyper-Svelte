<script lang="ts">
	import type { Snippet } from 'svelte'
	import type { HTMLButtonAttributes } from 'svelte/elements'

	let { class: className = '', children, ...rest }: HTMLButtonAttributes & { children?: Snippet } = $props()
</script>

<button
	{...rest}
	class="bg-[var(--sub-color)] text-[var(--text-color)] border-none h-10 outline-none p-2 rounded-lg transform duration-150 hover:translate-x-[0.2rem] focus:translate-x-[0.2rem] cursor-pointer {className}"
>
	{@render children?.()}
</button>
