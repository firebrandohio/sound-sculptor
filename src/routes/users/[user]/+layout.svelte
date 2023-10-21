<script lang="ts">
	import Icon from '@iconify/svelte';
	import { AppBar, AppShell } from '@skeletonlabs/skeleton';
	import { Modal, getModalStore } from '@skeletonlabs/skeleton';
	import type { ModalSettings, ModalComponent, ModalStore } from '@skeletonlabs/skeleton';

	import { writable, type Writable } from 'svelte/store';
	import { onMount } from 'svelte';

	import { userBio, userProfileBio } from '$lib/stores/user.js';
	import BioModal from '$lib/components/user/BioModal.svelte';

	const modalStore = getModalStore();

	export let data;
	$: ({ supabase, session, profile } = data);

	let profileImage: string | undefined;

	$: if (profile.profile_picture) {
		profileImage = profile.profile_picture;
	} else {
		profileImage = `https://api.dicebear.com/7.x/shapes/svg?seed=${profile.display_name}`;
	}

	onMount(() => {
		//update profileBio on mount
		userProfileBio.set(profile.bio);
		userBio.set($userProfileBio);
		console.log($userProfileBio);

		newBioModalComponent = {
			ref: BioModal,
			props: {
				type: 'new',
				supabase,
				session
			}
		};
		editBioModalComponent = {
			ref: BioModal,
			props: {
				type: 'edit',
				supabase,
				session
			}
		};

		newBioModal = {
			type: 'component',
			component: newBioModalComponent
		};
		editBioModal = {
			type: 'component',
			component: editBioModalComponent
		};
	});

	let newBioModalComponent: ModalComponent;
	let editBioModalComponent: ModalComponent;
	let newBioModal: ModalSettings;
	let editBioModal: ModalSettings;

	const editBio = async () => {
		//call modal
		modalStore.trigger(editBioModal);
	};

	const addBio = async () => {
		//call modal
		modalStore.trigger(newBioModal);
	};
</script>

<AppShell>
	<svelte:fragment slot="header">
		<div class="border-t-2 border-surface-700 py-2 px-3 sm:px-6 bg-surface-800 flex flex-col">
			<div class="flex flex-row">
				<img
					src={profileImage}
					alt="avatar"
					class="w-16 sm:w-20 md:w-24 aspect-square object-cover border-2 md:border-4 border-surface-600"
				/>
				<div class=" w-full flex flex-row justify-between">
					<div class="flex flex-col align-middle justify-start ml-3 md:ml-5">
						<p class="text-lg sm:text-xl md:text-3xl font-semibold text-primary-200">
							{profile.display_name}
						</p>
						<p class="text-xs sm:text-sm md:text-base text-surface-400">
							{`Followers: ${profile.followers}`}
						</p>
						<p class="text-xs sm:text-sm md:text-base text-surface-400">
							{`Following: ${profile.following}`}
						</p>
					</div>
					<div class="flex-col xs:flex-row h-full items-center m-2 xs:m-0 hidden xs:flex">
						{#if !profile.ownerData}
							{#if profile.isFollowing}
								<button class="btn btn-sm text-sm variant-soft-surface italics xs:mr-2"
									>Following</button
								>
							{:else}
								<button class="btb btn-sm text-sm variant-filled-tertiary xs:mr-2">Follow</button>
							{/if}
						{/if}

						<button class="p-1 rounded-none bg-green-500 mt-2 xs:mt-0">
							<Icon icon="mdi:spotify" class="text-2xl text-black" />
						</button>
					</div>
				</div>
			</div>
			<hr class="border-surface-700 my-2 mx-4" />
			{#if profile.ownerData}
				{#if $userProfileBio === ''}
					<div class="flex flex-row items-center justify-center w-full mx-4">
						<button
							class="btn btn-sm variant-ghost-surface"
							on:click={async () => {
								await addBio();
							}}
						>
							<Icon icon="mdi:plus" class="text-xl mr-1 text-surface-500" />
							Add Bio
						</button>
					</div>
				{:else}
					<div class="flex flex-row items-center w-full mx-4">
						<button
							class="btn btn-sm variant-ghost-surface"
							on:click={async () => {
								await editBio();
							}}
						>
							<Icon icon="mdi:gear-outline" class="text-xl text-surface-500 mr-1" />
							Edit Bio
						</button>
						<p class="text-sm w-full sm:text-base text-surface-400 mx-4 text-center">
							{$userProfileBio}
						</p>
					</div>
				{/if}
			{:else}
				<p class="text-sm sm:text-base text-surface-400 mx-4 text-center">
					{$userProfileBio}
				</p>
			{/if}
		</div>
	</svelte:fragment>
	<div class="min-h-screen">
		<slot />
	</div>
</AppShell>
