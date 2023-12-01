<script>
	import { Ratings } from '@skeletonlabs/skeleton';
</script>

<div class="flex flex-col items-center justify-center w-auto card p-2 variant-soft-surface md:w-80">
	<div class="PLAYLIST_IMG w-full h-full aspect-square placeholder animate-pulse" />
	<div class="PLAYLIST_TITLE w-72 md:w-48 my-3 h-4 placeholder animate-pulse" />
	<div class="flex flex-row w-full justify-between md:mt-4">
		<div
			class="PLAY_BTN w-10 h-10 xs:w-12 xs:h-12 md:w-10 md:h-10 placeholder-circle animate-pulse"
		/>

		<div class="flex flex-col items-end">
			<div class="RANK placeholder animate-pulse h-5 w-16" />

			<div>
				<div class="RATING placeholder animate-pulse h-6 w-40 mt-1" />
			</div>
		</div>
	</div>
</div>
