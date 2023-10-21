<script lang="ts">
	import { getModalStore } from '@skeletonlabs/skeleton';
	import { userBio, userProfileBio } from '$lib/stores/user';

	import type { SupabaseClient, Session } from '@supabase/supabase-js';

	const modalStore = getModalStore();

	export let supabase: SupabaseClient;
	export let session: Session;

	const typeData = {
		new: {
			header: 'Add Your Bio',
			button: 'Add Bio'
		},
		edit: {
			header: 'Edit Your Bio',
			button: 'Save'
		}
	};

	export let type: 'new' | 'edit';
	const maxLength = 300;
	const updateBio = async () => {
		if ($userBio.length > maxLength) {
			userBio.set($userBio.slice(0, maxLength));
		}
		if (!supabase || !session) {
			alert('no supabase or session');
			return;
		}
		if ($userBio !== $userProfileBio) {
			userProfileBio.set($userBio);
			//update user bio in db
			console.log(supabase);

			await supabase
				.from('Profile')
				.update({ bio: $userBio })
				.eq('user_id', session.user.id)
				.match({ user_id: session.user.id });
		}

		modalStore.close();
	};
</script>

<div class="flex flex-col card p-3 variant-filled-dark w-full h-full max-w-sm max-h-96">
	<h3 class="h3 text-surface-200">{typeData[type].header}</h3>
	<p class="text-surface-400 italics">{`Remaining characters: ${maxLength - $userBio.length}`}</p>
	<textarea
		class="w-full h-48 p-2 mt-2 rounded-md bg-surface-700 text-surface-300"
		bind:value={$userBio}
		maxlength={maxLength}
		on:input={() => {
			if ($userBio.length > maxLength) {
				userBio.set($userBio.slice(0, maxLength));
			}
		}}
	/>
	<button
		class="w-full mt-2 btn btn-sm variant-ghost-primary"
		on:click={async () => await updateBio()}
	>
		{typeData[type].button}
	</button>
</div>
