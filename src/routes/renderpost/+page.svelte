<script lang="ts">
	import PlaceholderPost from '$lib/components/posts/PlaceholderPost.svelte';
	import Post from '$lib/components/posts/Post.svelte';
	export let data;
</script>

<div class="container h-full mx-auto flex justify-start items-center flex-col">
	{#if data.posts}
		<div class="my-2">
			<PlaceholderPost />
		</div>
		{#each data.posts as post}
			<div class="my-2">
				<Post data={post} enablePreload={false} />
			</div>
		{/each}
	{:else}
		<p class="text-center text-2xl text-surface-300">No posts found</p>
	{/if}
</div>
