<script lang="ts">
	import { createEventDispatcher, afterUpdate } from "svelte";
	import { uid } from "$lib/internal";

	import TextBox from "../TextBox/TextBox.svelte";
	import ListItem from "../ListItem/ListItem.svelte";

	/** @extends {"../TextBox/TextBox.svelte"} */
	/** The input's current value. */
	export let value: any = "";

	/** Array of strings that will be suggested to the user as options. */
	export let items: string[] = [];

	/** The current visibility state of the suggestion flyout. */
	export let open = false;

	/** Bindable index of the currently selected item. */
	export let selection = 0;

	/** Bindable array of currently suggested items. */
	export let matches: string[] = [];

	/** Specifies a custom class name for the component. */
	let className = "";
	export { className as class };

	/** Obtains a bound DOM reference to the input element. */
	export let inputElement: HTMLInputElement = null;

	/** Obtains a bound DOM reference to the AutoSuggestBox's container element. */
	export let containerElement: HTMLDivElement = null;

	/** Obtains a bound DOM reference to the AutoSuggestBox's buttons container element. */
	export let buttonsContainerElement: HTMLDivElement = null;

	/** Obtains a bound DOM reference to the AutoSuggestBox's clear button element. Only available if `clearButton` is set to true, `readonly` is set to false, and a `value` is present. */
	export let clearButtonElement: HTMLButtonElement = null;

	/** Obtains a bound DOM reference to the AutoSuggestBox's search button element. Only available if `type` is set to `search`. */
	export let searchButtonElement: HTMLButtonElement = null;

	export let flyoutElement: HTMLUListElement = null;

	let focused = false;
	let typedValue = "";
	let mouseOverFlyout = false;

	const dispatch = createEventDispatcher();
	const flyoutId = uid("fds-auto-suggest-flyout-");

	$: matches = items.filter(item => item.toLowerCase().includes(typedValue.toLowerCase()));
	$: selection, dispatchSelect();

	function dispatchSelect() {
		dispatch("select", {
			item: items[selection],
			index: selection
		});
	}

	function handleInput(event) {
		typedValue = inputElement.value;
		
		if (focused && typedValue && items.length > 0) {
			open = true;
		}
		
		// Forward the input event to parent
		dispatch('input', event);
	}

	// Use afterUpdate to attach event listeners directly to the input element
	afterUpdate(() => {
		if (inputElement) {
			// Remove any existing listeners first
			inputElement.removeEventListener('input', handleInput);
			inputElement.removeEventListener('focus', handleFocus);
			inputElement.removeEventListener('blur', handleBlur);
			
			// Add the listeners
			inputElement.addEventListener('input', handleInput);
			inputElement.addEventListener('focus', handleFocus);
			inputElement.addEventListener('blur', handleBlur);
		}
	});

	function handleFocus() {
		focused = true;
	}

	function handleBlur() {
		focused = false;
		// Don't close if mouse is over the flyout
		setTimeout(() => {
			if (!mouseOverFlyout) {
				open = false;
			}
		}, 100);
	}

	function handleKeyDown(event: KeyboardEvent) {
		const { key } = event;
		if (open && matches.length > 0) {
			if (key === "ArrowDown") {
				selection++;
				if (selection > matches.length - 1) selection = 0;
			} else if (key === "ArrowUp") {
				selection--;
				if (selection < 0) selection = matches.length - 1;
			} else if (key === "Enter" || key === "Escape") {
				open = false;
			}
			if (key === "Enter" || key === "ArrowDown" || key === "ArrowUp") {
				event.preventDefault();
				value = matches[selection];
				flyoutElement?.children[selection].scrollIntoView({ block: "nearest" });
			}
		} else if (!open && matches.length > 0 && (key === "ArrowDown" || key === "ArrowUp")) {
			open = true;
		}
	}
</script>

<TextBox
	type="search"
	class="auto-suggest-box {open && matches.length > 0 ? 'open' : ''} {className}"
	aria-autocomplete="list"
	aria-activedescendant={open && matches.length > 0
		? `${flyoutId}-item-${items.indexOf(matches[selection])}`
		: ""}
	aria-expanded={open && matches.length > 0}
	aria-controls={flyoutId}
	onsearch={() => {
		if (open && matches.length > 0) value = matches[selection];
	}}
	onoutermousedown={() => (open = false)}
	onkeydown={handleKeyDown}
	onclear={() => {
		typedValue = "";
		if (items.length > 0) open = true;
	}}
	bind:inputElement
	bind:containerElement
	bind:clearButtonElement
	bind:searchButtonElement
	bind:buttonsContainerElement
	bind:value
	{...$$restProps}
>
	{#if open && matches.length > 0}
		<ul id={flyoutId} role="listbox" class="auto-suggest-box-flyout" bind:this={flyoutElement}
			onmouseenter={() => mouseOverFlyout = true}
			onmouseleave={() => mouseOverFlyout = false}>
			{#each matches as item, index (item)}
				<slot
					name="item-template"
					id="{flyoutId}-item-{index}"
					{value}
					{matches}
					{selection}
					{item}
					{index}
				>
					<ListItem
						tabindex={-1}
						id="{flyoutId}-item-{index}"
						role="option"
						onclick={() => {
							value = item;
							typedValue = item;
							selection = index;
							open = false;
							mouseOverFlyout = false;
							// Focus back on the input and ensure it updates
							setTimeout(() => {
								if (inputElement) {
									inputElement.focus();
								}
							}, 0);
						}}
						selected={selection === index}
					>{item}</ListItem>
				</slot>
			{/each}
		</ul>
	{/if}

	<slot />
	<slot name="buttons" slot="buttons" />
</TextBox>

<style lang="scss">
	@use "./AutoSuggestBox";
</style>
