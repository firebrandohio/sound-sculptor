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

	let posts: Array<{
		meta: PostMetadata | null;
		postData: PostData;
	}> = [];

	$: if (posts.length > 0) {
		placeholder = false;
	}

	/*onMount(async () => {
		//fetch posts
		const res = await requestPosts(query, session, supabase);
		if (!res) {
			//error
			return;
		}
		if (res.err) {
			//error

			return;
		}

		if (res.posts) {
			let initialPosts: Array<{
				meta: PostMetadata | null;
				postData: PostData;
			}> = [];
			for (let i = 0; i < res.posts.length; i++) {
				initialPosts.push({ meta: null, postData: res.posts[i] });
			}
			posts = initialPosts;
		}
	});*/

	//clear posts and reload when query changes
	async function reloadComponent(query: PostQuery) {
		if (query) {
			posts = [];
			placeholder = true;

			//fetch posts
			const res = await requestPosts(query, session, supabase);
			if (!res) {
				//error
				return;
			}
			if (res.err) {
				//error

				return;
			}

			if (res.posts) {
				let initialPosts: Array<{
					meta: PostMetadata | null;
					postData: PostData;
				}> = [];
				for (let i = 0; i < res.posts.length; i++) {
					initialPosts.push({ meta: null, postData: res.posts[i] });
				}
				posts = initialPosts;
			}
		}
	}

	$: reloadComponent(query);
</script>

{#if posts.length === 0 && !placeholder}
	<div class="flex flex-col justify-center items-center w-full h-full">
		<p class="text-2xl text-gray-400">No posts</p>
	</div>
{:else}
	{#each posts as post}
		<PostMetaWraper data={post.meta}>
			<Post data={post.postData} />
		</PostMetaWraper>
	{/each}
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
