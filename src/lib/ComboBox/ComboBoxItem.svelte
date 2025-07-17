<script lang="ts">
	export let selected = false;
	export let disabled = false;

	let className = "";
	export { className as class };

</script>

<li
	tabindex="0"
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
