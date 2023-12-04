<script lang="ts">
	import type { Session } from '@supabase/supabase-js';
	import Post from '../posts/Post.svelte';
	import PostMetaWraper from './PostMetaWraper.svelte';
	import { requestPosts, type PostData, type PostMetadata, type PostQuery } from '../posts/helpers';
	import { onMount } from 'svelte';
	import PlaceholderPost from '../posts/PlaceholderPost.svelte';

	export let supabase: any;
	export let session: Session | null;
	export let query: PostQuery;

	let placeholder = true;
	let timeoutFlag = false;

	let posts: Array<{
		meta: PostMetadata | null;
		postData: PostData;
	}> = [];

	$: if (posts.length > 0) {
		placeholder = false;
	}

	//clear posts and reload when query changes
	async function reloadComponent(query: PostQuery) {
		if (query) {
			posts = [];
			placeholder = true;
			timeoutFlag = false;

			//fetch posts
			const res = await requestPosts(query, session, supabase);
			if (!res || res.err) return;

			if (res.posts) {
				let initialPosts: Array<{
					meta: PostMetadata | null;
					postData: PostData;
				}> = [];
				for (let i = 0; i < res.posts.length; i++) {
					initialPosts.push({ meta: null, postData: res.posts[i] });
				}
				posts = initialPosts;
				if (posts.length > 0) {
					timeoutFlag = false;
				} else {
					timeoutFlag = true;
					placeholder = false;
				}
			}
		}
	}

	$: reloadComponent(query);
</script>

{#if posts.length === 0 && !placeholder && !timeoutFlag}
	<div class="flex flex-col justify-center items-center w-full h-full">
		<p class="text-2xl text-gray-400">No posts</p>
	</div>
{:else}
	{#each posts as post}
		<PostMetaWraper data={post.meta}>
			<Post data={post.postData} {session} {supabase} />
		</PostMetaWraper>
	{/each}
{/if}

{#if timeoutFlag}
	<div class="flex flex-col justify-center items-center w-full h-full mt-4">
		<div
			class="flex flex-col justify-center items-center py-4 md:max-w-3xl w-full mx-4 card variant-ghost-primary"
		>
			<p class="text-2xl text-primary-300">No posts</p>
		</div>
	</div>
{/if}

{#if placeholder}
	<PostMetaWraper data={null}>
		<PlaceholderPost />
	</PostMetaWraper>
	<PostMetaWraper data={null}>
		<PlaceholderPost />
	</PostMetaWraper>
	<PostMetaWraper data={null}>
		<PlaceholderPost />
	</PostMetaWraper>
	<PostMetaWraper data={null}>
		<PlaceholderPost />
	</PostMetaWraper>
{/if}
