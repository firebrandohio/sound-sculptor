<script lang="ts">
	import '../app.postcss';
	import { AppShell, AppBar } from '@skeletonlabs/skeleton';

	// Floating UI for Popups
	import { computePosition, autoUpdate, flip, shift, offset, arrow } from '@floating-ui/dom';
	import { storePopup } from '@skeletonlabs/skeleton';
	import { goto } from '$app/navigation';
	import { writable } from 'svelte/store';
	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });

	import { onMount } from 'svelte';
	import { user } from '$lib/stores/user';

	export let data;
	let { supabase, session } = data;
	$: ({ supabase, session } = data);

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

<!-- App Shell -->
<AppShell>
	<svelte:fragment slot="header">
		<!-- App Bar -->
		<AppBar>
			<svelte:fragment slot="lead">
				<button
					on:click={() => {
						goto('/');
					}}
				>
					<strong class="text-base sm:text-xl uppercase">Sound Sculptor</strong>
				</button>
			</svelte:fragment>
			<svelte:fragment slot="trail">
				{#if session && session.user && $user}
					<button
						class="btn btn-sm variant-soft-primary"
						on:click={() => goto(`/users/${session?.user.id}`)}
					>
						<h4 class="h5 hidden sm:flex">{$user.display_name}</h4>
						{#if $user?.images.length === 0}
							<img
								class="w-8 aspect-square"
								src={`https://api.dicebear.com/7.x/shapes/svg?seed=${$user.display_name}`}
								alt="avatar"
							/>
						{:else}
							<img src={$user.images[0].url} alt="avatar" class="w-6 aspect-square object-cover" />
						{/if}
					</button>
					<button
						on:click={async () => {
							await supabase.auth.signOut();
							user.set(null);
							goto('/auth/callback');
						}}
						class="btn btn-sm py-2 px-4 variant-filled-surface"
					>
						Sign out
					</button>
				{/if}
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>
	<!-- Page Route Content -->

	<slot />
</AppShell>
