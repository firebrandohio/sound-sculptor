<script>
	import PlaceholderPlaylistBlock from './PlaceholderPlaylistBlock.svelte';
</script>

<div
	class="flex flex-col w-full justify-center max-w-md md:max-w-3xl card p-2 xs:p-3 mx-4 variant-soft-secondary"
>
	<div class="flex md:flex-row flex-col">
		<PlaceholderPlaylistBlock />
		<div class="flex flex-col w-full md:max-w-md md:ml-6 md:h-full">
			<div class="my-2 flex flex-row items-center">
				<div class="AVATAR placeholder animate-pulse w-16 xs:w-20 h-16 xs:h-20 aspect-square" />

				<div class="flex flex-col justify-start ml-6">
					<div class="USERNAME h-7 placeholder animate-pulse w-64 my-1" />
					<div class="DATE placeholder animate-pulse w-72 h-3 my-1" />
					<div class="STATUS placeholder animate-pulse w-40 h-3 my-1" />
				</div>
			</div>
			<div class="ml-3 flex flex-col items-start">
				<div class="placeholder animate-pulse w-full h-3 my-1" />
				<div class="placeholder animate-pulse w-full h-3 my-1" />
				<div class="placeholder animate-pulse w-full h-3 my-1" />
				<div class="placeholder animate-pulse w-full h-3 my-1" />
				<div class="placeholder animate-pulse w-48 h-3 my-1" />
			</div>

			<div class="flex flex-row justify-between items-center mt-4">
				<div class="flex flex-row items-center">
					<div class="flex flex-col">
						<div class="VOTE placeholder animate-pulse w-10 h-16" />
					</div>

					<div class="VOTECOUNT placeholder animate-pulse w-16 p-4 ml-2" />
				</div>
				<div class="COMMENTSBUTTON placeholder animate-pulse h-8 w-32" />
				<div class="SHAREBUTTON placeholder animate-pulse h-8 w-24" />
			</div>
		</div>
	</div>
</div>
