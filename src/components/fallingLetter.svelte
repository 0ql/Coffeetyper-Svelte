<script lang="ts">
	import { untrack } from 'svelte';

	interface Props {
		letter: string;
		amount: number;
	}

	let { letter, amount }: Props = $props();

	let q: string[] = $state([]);
	let lastAmount = 0;

	$effect.pre(() => {
		const current = amount;
		untrack(() => {
			if (current < lastAmount) {
				lastAmount = current;
				q.pop();
			} else if (current > lastAmount) {
				q.push(letter);
			}
		});
	});
</script>

<div class="block">
	{#each q as l}
		<div>{l}</div>
	{/each}
</div>
