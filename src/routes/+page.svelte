<script lang="ts">
	import Icon from '@iconify/svelte';
	import type { Session } from '@supabase/supabase-js';
	import { user } from '$lib/stores/user';
	import { onMount } from 'svelte';

	export let data;

	let session: Session | null = null;
	$: session = data.session;

	// Fetch user data from spotify
	const fetchUserData = async () => {
		const response = await fetch('https://api.spotify.com/v1/me', {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${session?.provider_token}`
			}
		});

		user.set(await response.json());
		console.log(response);
	};

	onMount(async () => {
		if (session && !session?.provider_token) {
			await data.supabase.auth.signInWithOAuth({
				provider: 'spotify'
			});
			await fetchUserData();
		} else if (session?.provider_token && !$user) {
			await fetchUserData();
		}
	});
</script>

<div class="w-full h-full flex flex-col items-center justify-center">
	{#if !session}
		<div class="flex flex-col items-center justify-center card variant-ghost-dark py-10 px-5">
			<Icon icon="mdi:spotify" class="text-9xl text-green-500" />
			<p class="text-2xl text-surface-200">Sign in with Spotify</p>
			<button
				on:click={async () => {
					await data.supabase.auth.signInWithOAuth({
						provider: 'spotify'
					});
				}}
				class="mt-4 px-4 py-2 bg-green-500 text-white rounded-md shadow-md hover:bg-green-600"
			>
				Sign in
			</button>
		</div>
	{:else if !$user}
		<p>loading...</p>
	{:else}
		<div class="max-w-md">{$user.display_name}</div>
	{/if}
</div>
