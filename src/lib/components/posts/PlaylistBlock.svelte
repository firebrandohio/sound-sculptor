<script lang="ts">
	import Icon from '@iconify/svelte';
	import { Ratings } from '@skeletonlabs/skeleton';

	export let data = {
		playlistURL: '',
		playlistRank: 0,
		playlistTitle: '',
		userRank: 0,
		isSubscribed: false
	};

	let play = false;
	let togglePlay = () => {
		play = !play;
	};

	function iconClick(event: CustomEvent<{ index: number }>): void {
		data.userRank = event.detail.index;
	}
</script>

<div class="flex flex-col items-center justify-center w-auto card p-2 variant-soft-surface md:w-64">
	<div class="w-full aspect-square bg-primary-500" />
	<div class="w-full my-2 text-center text-surface-300 text-base xs:text-lg truncate md:text-sm">
		{data.playlistTitle}
	</div>
	<div class="flex flex-row w-full justify-between md:mt-4">
		<button
			class="flex w-10 h-10 xs:w-12 xs:h-12 md:w-10 md:h-10 bg-green-400 rounded-full justify-center items-center"
			on:click={togglePlay}
		>
			{#if !play}
				<Icon icon="ion:play" class="pl-1 text-2xl xs:text-3xl text-surface-900 md:text-2xl" />
			{:else}
				<Icon icon="ion:pause" class="text-2xl xs:text-3xl text-surface-900 md:text-2xl" />
			{/if}
		</button>
		<div class="flex flex-col items-end">
			<div class="text-xs xs:text-base text-gray-400">
				{data.playlistRank}/5 Stars
			</div>
			<div>
				<Ratings bind:value={data.userRank} max={5} interactive on:icon={iconClick}>
					<svelte:fragment slot="empty">
						<Icon icon="ion:star-outline" class="text-lg xs:text-3xl text-gray-500 md:text-xl" />
					</svelte:fragment>

					<svelte:fragment slot="full">
						<Icon icon="ion:star" class="text-lg xs:text-3xl text-warning-500 md:text-xl" />
					</svelte:fragment>
				</Ratings>
			</div>
		</div>
	</div>
</div>
