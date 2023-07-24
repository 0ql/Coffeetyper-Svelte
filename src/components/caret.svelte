<script lang="ts">
	import { settings } from "../store";
	import { send, receive } from "./ts/textbox";
</script>

<div
	out:send={{ key: 1 }}
	in:receive={{ key: 1 }}
	style="width: {$settings.cosmetics.textBox.caret
		.width}; margin-right: -{$settings.cosmetics.textBox.caret
		.width}; transform: translateX(-{$settings.cosmetics.textBox.caret
		.width}); background-color: {$settings.cosmetics.textBox.caret.colored
		? 'var(--caret-color)'
		: ''};"
	class="caret bg-white {$settings.cosmetics.textBox.caret.rounded
		? 'rounded-full'
		: ''} "
	id="caret"
/>
