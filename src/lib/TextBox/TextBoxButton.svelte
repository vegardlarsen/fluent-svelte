<script lang="ts">
	export let type: "button"|"submit"|"reset" = "button";
	export let onclick: ((event: MouseEvent) => void) | undefined = undefined;

	let className = "";
	export { className as class };

	export let element: HTMLButtonElement = null;
</script>

<button
	bind:this={element}
	class="text-box-button {className}"
	{type}
	{onclick}
	{...$$restProps}
>
	<slot />
</button>

<style lang="scss">
	@use "./TextBoxButton";
</style>
