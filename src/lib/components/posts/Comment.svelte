<script lang="ts">
	import Comment from './Comment.svelte';
	import TextDropdown from '../general/TextDropdown.svelte';
	import type { CommentData } from './helpers';

	export let data: CommentData;
	export let enablePreload = true;
</script>

<div class="flex flex-col my-2" id={data.id}>
	<div class="flex flex-row items-center">
		<img
			class="w-10 h-10 xs:w-12 xs:h-12"
			src={`https://api.dicebear.com/7.x/shapes/svg?seed=${data.username}`}
			alt="avatar"
		/>
		<div class="flex flex-col ml-2">
			<a
				class="anchor text-sm xs:text-base text-primary-500"
				href={`/users/${data.username}`}
				data-sveltekit-preload-data={enablePreload ? 'hover' : 'off'}>{data.username}</a
			>
			<div class="text-xs xs:text-sm text-surface-400 italic">{data.date}</div>
		</div>
	</div>
	<div class="text-xs xs:text-base mt-2 text-surface-300">{data.text}</div>
	{#if data.children.length > 0}
		<TextDropdown containerClass="mt-2" textClass="text-surface-300" startOpen={false}>
			<div class="mt-2 flex flex-col max-h-72 overflow-y-scroll">
				{#each data.children as child}
					<Comment data={child} {enablePreload} />
				{/each}
			</div>
		</TextDropdown>
	{/if}
</div>
