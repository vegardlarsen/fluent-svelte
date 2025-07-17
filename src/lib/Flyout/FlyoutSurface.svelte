<script lang="ts">
	/** Specifies a custom class name for the surface. */
	let className = "";
	export { className as class };

	/** Obtains a bound DOM reference to the surface element. */
	export let element: HTMLDivElement = null;

</script>

<div class="flyout {className}" bind:this={element} {...$$restProps}>
	<slot />
</div>

<style lang="scss">
	@use "./FlyoutSurface";
</style>
