<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
</script>

{#if $page.status === 404}
	<div class="flex flex-col h-full w-full justify-center items-center">
		<h2 class="h2">404</h2>
		<p class="text-2xl">Uh-Oh!</p>
		<p class="text-base mt-3">{`We couldn't find ${$page.url.pathname}`}</p>
		<button class="mt-4 btn variant-ghost-primary" on:click={() => goto('/')}>Go home</button>
	</div>
{:else}
	<div class="flex flex-col h-full w-full justify-center items-center">
		<h2 class="h2">500</h2>
		<p class="text-2xl">Uh-Oh!</p>
		<p class="text-base mt-3">Something went wrong</p>
		<button class="mt-4 btn variant-ghost-primary" on:click={() => goto('/')}>Go home</button>
	</div>
{/if}
