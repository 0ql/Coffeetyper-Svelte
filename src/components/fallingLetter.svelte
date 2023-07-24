<script lang="ts">
	export let letter: string;
	export let amount: number;

	let q = [];
	let lastAmount: number = 0;

	$: {
		if (amount < lastAmount) {
			lastAmount = amount;
			q.pop();
		} else if (amount > lastAmount) {
			q.push(letter);
		}
	}
</script>

<div class="block">
	{#each q as l}
		<div>{l}</div>
	{/each}
</div>
