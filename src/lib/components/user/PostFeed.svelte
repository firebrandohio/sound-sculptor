<script lang="ts">
	import type { Session } from '@supabase/supabase-js';
	import Post from '../posts/Post.svelte';
	import PostMetaWraper from './PostMetaWraper.svelte';
	import type { PostData, PostMetadata, PostQuery } from '../posts/helpers';
	import { onMount } from 'svelte';

	export let supabase: any;
	export let session: Session | null;
	export let query: PostQuery;

	let posts: Array<{
		meta: PostMetadata | null;
		postData: PostData;
	}> = [];

	onMount(() => {
		//render placeholder posts
		//fetch posts
		//render posts
	});
</script>

{#each posts as post}
	<PostMetaWraper data={post.meta}>
		<Post data={post.postData} />
	</PostMetaWraper>
{/each}
