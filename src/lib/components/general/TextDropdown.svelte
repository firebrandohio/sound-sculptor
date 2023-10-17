<script lang="ts">
	import Icon from '@iconify/svelte';

	export let startOpen = false;
	export let textClass = '';
	export let containerClass = '';
	export let expandIconClass = 'text-lg';
	export let hideIconClass = 'text-xl';
	export let expandedTextClass = 'text-base';

	let open = startOpen;
	const toggleDropdown = () => {
		open = !open;
	};
</script>

<div class={containerClass + ' flex flex-row'}>
	{#if !open}
		<button class="flex flex-row justify-center items-center" on:click={toggleDropdown}>
			<Icon icon="ion:chevron-right" class={expandIconClass} />
		</button>
		<p class={textClass + ' truncate'}><slot /></p>
	{:else}
		<button class="flex flex-row items-start justify-center" on:click={toggleDropdown}>
			<Icon icon="ion:chevron-down" class={hideIconClass} on:click={toggleDropdown} />
		</button>
		<p class={textClass + ' ' + expandedTextClass}><slot /></p>
	{/if}
</div>
