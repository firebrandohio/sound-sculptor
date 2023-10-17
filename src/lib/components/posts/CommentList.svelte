<script lang="ts">
	import Comment from './Comment.svelte';
	import type { CommentData } from './helpers';
	export let data: Array<CommentData>;
</script>

<div class="mt-3 flex flex-col max-h-72 overflow-y-scroll card variant-soft-surface p-2">
	{#each data as comment}
		<Comment data={comment} />
	{/each}
</div>
