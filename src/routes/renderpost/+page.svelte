<script lang="ts">
	import Post from '$lib/components/posts/Post.svelte';
	export let data;
</script>

<div class="container h-full mx-auto flex justify-center items-center flex-col">
	{#if data.posts}
		{#each data.posts as post}
			<Post data={post} />
		{/each}
	{:else}
		<p class="text-center text-2xl text-surface-300">No posts found</p>
	{/if}
</div>
