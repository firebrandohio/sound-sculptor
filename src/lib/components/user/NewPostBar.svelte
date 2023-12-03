<script lang="ts">
	import type { NewPostData, PostPlaylistBasicData } from '../posts/helpers';
	import { getToastStore, type ToastSettings } from '@skeletonlabs/skeleton';

	const toastStore = getToastStore();
	import type { Session } from '@supabase/supabase-js';
	import { goto } from '$app/navigation';
	import { createPost } from '$lib/supabase/posts';

	export let data: { supabase: any; session: Session | null };

	type ThreadData = {
		slug: string;
		title: string;
	};

	let playlistData: PostPlaylistBasicData | null = null;
	let postContent = '';
	let postTo = '1';
	let thread: ThreadData | null = null;
	let visible = false;

	const togglePlaylist = () => {
		if (playlistData) {
			playlistData = null;
		} else {
			playlistData = { id: '123asd', title: 'This is a test playlist title', duration: 123 };
		}
	};

	const toggleThread = () => {
		if (thread) {
			thread = null;
		} else {
			thread = { slug: '/test_thread', title: 'Test Thread' };
		}
	};

	const submitPost = async () => {
		if (data.session === null) {
			goto('/auth/callback');
			return;
		}

		//allows component to save last thread slug, but still post to personal
		const threadSlug = postTo === '2' ? (thread?.slug ? thread.slug : null) : null;

		const newPostData: NewPostData = {
			userID: data.session?.user.id,
			playlistID: playlistData?.id ? playlistData.id : null,
			threadSlug: threadSlug,
			text: postContent
		};

		let res = await createPost(newPostData, data.session, data.supabase);

		if (res.err) {
			const t: ToastSettings = {
				message: res.err,
				// Provide any utility or variant background style:
				background: 'variant-ghost-error',
				autohide: false
			};
			toastStore.trigger(t);
			return;
		} else {
			const t: ToastSettings = {
				message: 'Post created successfully!',
				// Provide any utility or variant background style:
				background: 'variant-ghost-success',
				timeout: 2000
			};
			toastStore.trigger(t);

			//reset data
			playlistData = null;
			postContent = '';
			postTo = '1';
			thread = null;
		}
	};
</script>

<div class="p-2 card variant-ghost-surface w-full flex flex-col justify-center">
	<div class="flex flex-row justify-between items-center">
		<h6 class="h6">Write a new post:</h6>
		<div class="flex flex-row items-center">
			{#if postTo === '2'}
				{#if thread}
					<p class="text-surface-300 mr-3">
						Posting to <span class="underline">/{thread.title}</span>
					</p>
					<button class="btn btn-sm variant-soft-error mx-3" on:click={toggleThread}
						>Remove thread</button
					>
				{:else}
					<button class="btn btn-sm variant-filled-surface mx-3" on:click={toggleThread}
						>Select thread</button
					>
				{/if}
			{/if}
			<select bind:value={postTo} class="select w-40">
				<option value="1">Post to personal</option>
				<option value="2">Post to a thread</option>
			</select>
		</div>
	</div>
	<div class="w-full mt-3">
		<textarea
			bind:value={postContent}
			class="textarea"
			rows="2"
			placeholder="Your post content here"
		/>
	</div>
	<div class="w-full flex flex-row justify-between items-center">
		{#if playlistData}
			<div class="flex flex-row justify-start">
				<p class="text-surface-300 mr-3 underline truncate">{playlistData.title}</p>

				<p class="text-surface-400 italic">~ {playlistData.duration} minutes</p>
			</div>
		{:else}
			<p class="text-surface-400 mr-3">No playlist selected</p>
		{/if}

		<div class="flex flex-row">
			{#if !playlistData}
				<button class="btn btn-sm variant-filled-surface mx-3" on:click={togglePlaylist}
					>Add playlist</button
				>
			{:else}
				<button class="btn btn-sm variant-soft-surface mx-3" on:click={togglePlaylist}
					>Remove playlist</button
				>
			{/if}
			<button
				class="btn btn-sm variant-filled-primary"
				disabled={postContent == '' || (postTo === '2' && !thread) ? true : false}
				on:click={submitPost}>Post</button
			>
		</div>
	</div>
</div>
