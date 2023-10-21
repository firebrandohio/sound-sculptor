<script lang="ts">
	import Icon from '@iconify/svelte';
	import { AppBar, AppShell } from '@skeletonlabs/skeleton';
	import { Modal, getModalStore } from '@skeletonlabs/skeleton';
	import type { ModalSettings, ModalComponent, ModalStore } from '@skeletonlabs/skeleton';
	import EditBioModal from '$lib/components/user/EditBioModal.svelte';
	import NewBioModal from '$lib/components/user/NewBioModal.svelte';
	import { writable, type Writable } from 'svelte/store';
	import { onMount } from 'svelte';

	const modalStore = getModalStore();

	export let data;
	$: ({ supabase, session, profile } = data);

	let profileImage: string | undefined;

	$: if (profile.profile_picture) {
		profileImage = profile.profile_picture;
	} else {
		profileImage = `https://api.dicebear.com/7.x/shapes/svg?seed=${profile.display_name}`;
	}
	/*
	//reactive system that only requires the modal to set the value of profileBio to trigger the update
	//writable store for bio
	const profileBio = writable<string>('');
	profileBio.set(profile.bio); //profile bio listens to updates to profile.bio
	const bio = writable<string>('');
	bio.set(/$profileBio); //bio listens to updates to the value of profileBio
	//profile.bio = /$profileBio; //profile.bio listens to updates to the value profileBio

	const updateBio = async (profileBio: string) => {
		//update bio in database
		if (profile.ownerData) {
			if (profile.bio !== profileBio) {
				await supabase.from('Profile').update({ bio: profileBio }).eq('user_id', session?.user.id);
			}
		}
	};

	$: updateBio(/$profileBio); //update function listens to changes to the value of profileBio

	onMount(() => {
		//update profileBio on mount
		profileBio.set(profile.bio);
		bio.set(/$profileBio);
	});

	const newBioModalComponent: ModalComponent = {
		ref: NewBioModal,
		props: {
			profileBio,
			bio
		}
	};
	const editBioModalComponent: ModalComponent = {
		ref: EditBioModal,
		props: {
			profileBio,
			bio
		}
	}; 

	const newBioModal: ModalSettings = {
		type: 'component',
		component: newBioModalComponent
	};

	const editBioModal: ModalSettings = {
		type: 'component',
		component: editBioModalComponent
	};

	const editBio = async () => {
		//call modal
		modalStore.trigger(editBioModal);
	};

	const addBio = async () => {
		//call modal
		modalStore.trigger(newBioModal);
	}; */
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
				{#if profile.bio === ''}
					<div class="flex flex-row items-center justify-center w-full mx-4">
						<button
							class="btn btn-sm variant-ghost-surface"
							on:click={async () => {
								/*await addBio*/
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
								/*await editBio*/
							}}
						>
							<Icon icon="mdi:gear-outline" class="text-xl text-surface-500 mr-1" />
							Edit Bio
						</button>
						<p class="text-sm w-full sm:text-base text-surface-400 mx-4 text-center">
							{profile.bio}
						</p>
					</div>
				{/if}
			{:else}
				<p class="text-sm sm:text-base text-surface-400 mx-4 text-center">
					{profile.bio}
				</p>
			{/if}
		</div>
	</svelte:fragment>
	<div class="min-h-screen">
		<slot />
	</div>
</AppShell>
