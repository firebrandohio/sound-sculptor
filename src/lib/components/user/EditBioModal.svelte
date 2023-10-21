<script lang="ts">
	import type { Writable } from 'svelte/store';
	import { getModalStore } from '@skeletonlabs/skeleton';
	const modalStore = getModalStore();
	export let bio: Writable<string>;
	export let profileBio: Writable<string>;
	const maxLength = 300;
	const updateBio = () => {
		profileBio.set($bio);
		modalStore.close();
	};
</script>

<div class="flex flex-col card p-3 variant-filled-surface w-full h-full max-w-sm max-h-96">
	<h3 class="h3 text-surface-200">Edit Your Bio</h3>
	<p class="text-surface-400 italics">{`Remaining characters: ${maxLength - $bio.length}`}</p>
	<textarea
		class="w-full h-48 p-2 rounded-md bg-surface-200 text-surface-400"
		bind:value={$bio}
		maxlength={maxLength}
		on:input={() => {
			if ($bio.length > maxLength) {
				bio.set($bio.slice(0, maxLength));
			}
		}}
	/>
	<button class="w-full mt-2 btn btn-sm variant-ghost-primary" on:click={updateBio}>Save</button>
</div>
