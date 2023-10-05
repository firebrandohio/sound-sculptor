<script lang="ts">
	import '../app.postcss';
	import { AppShell, AppBar } from '@skeletonlabs/skeleton';

	// Floating UI for Popups
	import { computePosition, autoUpdate, flip, shift, offset, arrow } from '@floating-ui/dom';
	import { storePopup } from '@skeletonlabs/skeleton';
	import { goto } from '$app/navigation';
	import { writable } from 'svelte/store';
	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });

	import { user } from '$lib/stores/user';

	export let data;
	let { supabase, session } = data;
	$: ({ supabase, session } = data);
</script>

<!-- App Shell -->
<AppShell>
	<svelte:fragment slot="header">
		<!-- App Bar -->
		<AppBar>
			<svelte:fragment slot="lead">
				<strong class="text-xl uppercase">Sound Sculptor</strong>
			</svelte:fragment>
			<svelte:fragment slot="trail">
				{#if session && session.user}
					<button
						on:click={async () => {
							await supabase.auth.signOut();
							user.set(null);
							goto('/auth/callback');
						}}
						class="btn px-4 py-2 variant-filled-surface"
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
