<script lang="ts">
	export let checked: boolean;
</script>

<input
	type="checkbox"
	class="{$$props.class}"
	bind:checked
/>

<style>
	input[type="checkbox"] {
		appearance: none;
		position: relative;
		width: 1rem;
		height: 1rem;
		background: var(--sub-color);
		border-radius: 10000px;
		margin: 0;
		padding: 0;
		cursor: pointer;
	}
	input[type="checkbox"]:checked::before {
		content: "";
		background: var(--text-color);
		position: absolute;
		top: 0.2rem;
		left: 0.2rem;
		width: 0.6rem;
		height: 0.6rem;
		border-radius: 10000px;
	}
</style>
