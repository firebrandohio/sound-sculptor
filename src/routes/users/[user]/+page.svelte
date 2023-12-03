<script lang="ts">
	import type { Session } from '@supabase/supabase-js';
	import NewPostBar from '$lib/components/user/NewPostBar.svelte';
	import PostFeed from '$lib/components/user/PostFeed.svelte';

	export let data;
	$: ({ supabase, session, profile } = data);
</script>

<div class="flex flex-col justify-start pt-4 w-full min-h-screen items-center">
	{#if session && profile.ownerData && session.user.id === profile.id}
		<div class="w-full max-w-md md:max-w-3xl"><NewPostBar data={{ supabase, session }} /></div>
	{/if}
	{#await profile}
		<div class="flex flex-col justify-center items-center w-full h-full">
			<p class="text-2xl text-gray-400">No user</p>
		</div>
	{:then}
		<PostFeed
			{session}
			{supabase}
			query={{
				userID: profile.id,
				thread: null,
				mainFeedFor: data.session?.user.id,
				maxPosts: 20,
				range: null
			}}
		/>
	{/await}
</div>
