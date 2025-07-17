<script lang="ts">
	/** Specifies a custom class name for the surface. */
	let className = "";
	export { className as class };

	/** Obtains a bound DOM reference to the surface element. */
	export let element: HTMLUListElement = null;

	let animationComplete = false;
	
	function handleAnimationEnd() {
		if (!animationComplete) {
			animationComplete = true;
		}
	}
</script>

<div
	class="menu-flyout-surface-container"
	style={animationComplete ? "overflow: visible;" : undefined}
>
	<ul
		onanimationend={handleAnimationEnd}
		class="menu-flyout {className}"
		bind:this={element}
		{...$$restProps}
	>
		<slot />
	</ul>
</div>

<style lang="scss">
	@use "./MenuFlyoutSurface";
</style>
