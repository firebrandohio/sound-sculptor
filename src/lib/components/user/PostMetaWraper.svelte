<script lang="ts">
	import type { PostMetadata } from '../posts/helpers';

	export let data: PostMetadata | null;
</script>

<div class="flex flex-col justify-start my-2 w-full max-w-3xl">
	{#if data}
		<div class="headline py-1 pl-2 flex flex-row items-center text-surface-300">
			{#if data.sharedByID && data.sharedByUsername}
				{#if data.sharedByAvatar}
					<img src={data.sharedByAvatar} alt="avatar" class="w-8 h-8 inline-block mr-2" />
				{:else}
					<img
						src={`https://api.dicebear.com/7.x/shapes/svg?seed=${data.sharedByUsername}`}
						alt="avatar"
						class="w-8 h-8 inline-block mr-2"
					/>
				{/if}
				<a href={`/users/${data.sharedByID}`} class="underline">
					{data.sharedByUsername}
				</a>
				shared a post
				{#if data.thread}
					from <a href={`/threads/${data.thread}`} class="underline">{data.thread}</a>
				{/if}
			{/if}
			{#if data.thread}
				Posted in <a href={`/threads/${data.thread}`} class="underline">{data.thread}</a>
			{/if}
		</div>
	{/if}
	<slot />
</div>
