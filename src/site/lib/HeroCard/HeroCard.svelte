<script lang="ts">
	let className = "";
	export { className as class };

	let element: HTMLDivElement;

	export const getElement = () => element;
</script>

<div
	class="hero-card {className}"
	bind:this={element}
	{...$$restProps}
>
	<header>
		<slot name="header" />
	</header>
	<slot />
</div>

<style lang="scss">
	@use "./HeroCard";
</style>
