<script lang="ts">
	export let selected = false;
	export let disabled = false;

	let className = "";
	export { className as class };
	
	// ComboBox items should be focusable when not disabled
	$: tabindex = disabled ? -1 : 0;

</script>

<li
	{...(tabindex !== undefined ? { tabindex } : {})}
	role="option"
	aria-selected={selected}
	class="combo-box-item {className}"
	class:selected
	class:disabled
	{...$$restProps}
>
	<slot name="icon" />
	<span>
		<slot />
	</span>
</li>

<style lang="scss">
	@use "./ComboBoxItem";
</style>
