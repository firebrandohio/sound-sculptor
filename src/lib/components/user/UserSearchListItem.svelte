<script lang="ts">
	import type { UserProfile } from './helpers';

	export let user: UserProfile | null;
</script>

{#if !user}
	<div class="w-full h-24 flex flex-row card p-2 variant-outline-tertiary my-1">
		<div class=" h-full flex flex-col justify-center items-center">
			<div class="placeholder animate-pulse w-16 h-16 xs:w-20 xs:h-20" />
		</div>
		<div class="h-full flex flex-col justify-center items-start w-auto ml-3">
			<div class="placeholder animate-pulse w-32 h-4 xs:w-40 xs:h-5 my-2" />
			<div class="placeholder animate-pulse w-24 h-3" />
			<div class="placeholder animate-pulse w-24 h-3 my-1" />
			<div class="placeholder animate-pulse w-30 h-3" />
		</div>
	</div>
{:else}
	<div class="w-full h-24 flex flex-row card p-2 variant-outline-tertiary my-1" id={user.id}>
		<div class=" h-full flex flex-col justify-center items-center">
			<img
				class="w-16 h-16 xs:w-20 xs:h-20 object-cover"
				src={user.profile_picture
					? user.profile_picture
					: `https://api.dicebear.com/7.x/shapes/svg?seed=${user.username}`}
				alt="avatar"
			/>
		</div>
		<div class="h-full flex flex-col justify-center items-start w-auto ml-3">
			<a href={`/users/${user.id}`} class="anchor font-semibold text-primary-500 text-lg"
				>{user.display_name}</a
			>
			<span class="text-xs text-surface-300"
				>{user.followers} {user.followers !== 1 ? 'followers' : 'follower'}</span
			>
			<span class="text-xs text-surface-300">{user.followers} following</span>
			{#if user.isFollowing}
				<span class="text-xs text-surface-400 italics">you are following</span>
			{/if}
		</div>
	</div>
{/if}
