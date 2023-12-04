<script lang="ts">
	import TextDropdown from '../general/TextDropdown.svelte';
	import PlaylistBlock from './PlaylistBlock.svelte';
	import Icon from '@iconify/svelte';
	import type { Session } from '@supabase/supabase-js';
	import { getToastStore, type ToastSettings } from '@skeletonlabs/skeleton';
	const toastStore = getToastStore();

	import { Modal, getModalStore } from '@skeletonlabs/skeleton';
	import type { ModalSettings, ModalComponent, ModalStore } from '@skeletonlabs/skeleton';
	const modalStore = getModalStore();

	import CommentList from './CommentList.svelte';
	import type { PostData } from './helpers';
	import PlaceholderPlaylistBlock from './PlaceholderPlaylistBlock.svelte';
	import { editPostText, deletePost, voteOnPost } from '$lib/supabase/posts';

	export let data: PostData;
	export let session: Session | null;
	export let supabase: any;
	export let enablePreload = true;
	let visible = true;

	const confirmDeleteModal: ModalSettings = {
		type: 'confirm',
		// Data
		title: 'Delete Post',
		body: 'Are you sure you wish to delete this post?',
		// TRUE if confirm pressed, FALSE if cancel pressed
		response: (r: boolean) => {
			if (r) {
				deleteThisPost();
			}
		}
	};

	let editMode = false;
	let editModeText = data.text;

	let commentsVisible = false;

	const toggleComments = () => {
		commentsVisible = !commentsVisible;
	};

	let upvote = async () => {
		let res: any;
		if (data.userVote === 1) {
			res = await voteOnPost(data.id, 0, session, supabase);
			data.votes -= 1;
			data.userVote = 0;
		} else if (data.userVote === -1) {
			res = await voteOnPost(data.id, 1, session, supabase);
			data.votes += 2;
			data.userVote = 1;
		} else {
			res = await voteOnPost(data.id, 1, session, supabase);
			data.votes += 1;
			data.userVote = 1;
		}
		if (res.err) {
			const t: ToastSettings = {
				message: res.err,
				// Provide any utility or variant background style:
				background: 'variant-ghost-error',
				timeout: 2000
			};
			toastStore.trigger(t);
			return;
		}
	};

	let downvote = async () => {
		let res: any;
		if (data.userVote === -1) {
			res = await voteOnPost(data.id, 0, session, supabase);
			data.votes += 1;
			data.userVote = 0;

			return;
		} else if (data.userVote === 1) {
			res = voteOnPost(data.id, -1, session, supabase);
			data.votes -= 2;
			data.userVote = -1;

			return;
		} else {
			res = voteOnPost(data.id, -1, session, supabase);
			data.votes -= 1;
			data.userVote = -1;
		}
		if (res.err) {
			const t: ToastSettings = {
				message: res.err,
				// Provide any utility or variant background style:
				background: 'variant-ghost-error',
				timeout: 2000
			};
			toastStore.trigger(t);
			return;
		}
	};

	const editPost = async () => {
		if (data.text === editModeText) {
			return;
		}
		const res = await editPostText(data.id, editModeText, session, supabase);

		if (res.err) {
			const t: ToastSettings = {
				message: res.err,
				// Provide any utility or variant background style:
				background: 'variant-ghost-error',
				autohide: false
			};
			toastStore.trigger(t);
			return;
		} else {
			const t: ToastSettings = {
				message: 'Post edited successfully!',
				// Provide any utility or variant background style:
				background: 'variant-ghost-success',
				timeout: 2000
			};
			toastStore.trigger(t);
		}
		toggleEditMode();
		data.text = editModeText;
	};

	const cancelEdit = () => {
		editModeText = data.text;
		toggleEditMode();
	};

	const deleteThisPost = async () => {
		const res = await deletePost(data.id, session, supabase);
		if (res.err) {
			const t: ToastSettings = {
				message: res.err,
				// Provide any utility or variant background style:
				background: 'variant-ghost-error',
				autohide: false
			};
			toastStore.trigger(t);
			return;
		} else {
			const t: ToastSettings = {
				message: 'Post deleted successfully!',
				// Provide any utility or variant background style:
				background: 'variant-ghost-success',
				timeout: 2000
			};
			toastStore.trigger(t);
			visible = false;
		}
	};

	const toggleEditMode = () => {
		editMode = !editMode;
	};
</script>

{#if visible}
	<div
		class="flex flex-col w-full justify-center max-w-md md:max-w-3xl card p-2 xs:p-3 variant-soft-secondary"
		id={data.id}
	>
		<div class="flex md:flex-row flex-col">
			{#if data.playlistData}
				<PlaylistBlock data={data.playlistData} />
			{:else}
				<PlaceholderPlaylistBlock />
			{/if}
			<div class="flex flex-col w-full md:max-w-md md:ml-6">
				<div>
					<div class="my-2 flex flex-row items-center">
						{#if data.avatarURL === '' || data.avatarURL === null}
							<img
								class="w-16 xs:w-20 aspect-square"
								src={`https://api.dicebear.com/7.x/shapes/svg?seed=${data.username}`}
								alt="avatar"
							/>
						{:else}
							<img
								class="w-16 xs:w-20 aspect-square object-cover"
								src={data.avatarURL}
								alt="avatar"
							/>
						{/if}
						<div class="flex flex-col justify-start ml-6">
							<a
								data-sveltekit-preload-data={enablePreload ? 'hover' : 'off'}
								class="text-surface-300 text-base xs:text-xl anchor font-semibold"
								href={`/users/${data.userID}`}>{data.username}</a
							>
							<div class="text-xs xs:text-sm text-surface-400 italic">{data.date}</div>
							<div class="text-xs xs:text-sm text-surface-400 italic">{data.status}</div>
						</div>
					</div>
					<div class="flex flex-row justify-end w-full">
						{#if session?.user.id === data.userID}
							{#if !editMode}
								<button on:click={toggleEditMode}>
									<Icon
										icon="majesticons:settings-cog-line"
										class="text-3xl text-surface-500 ml-2"
									/>
								</button>
							{:else}
								<button on:click={editPost}>
									<Icon icon="mingcute:check-fill" class="text-2xl text-surface-500 ml-2" />
								</button>
								<button on:click={cancelEdit}>
									<Icon icon="octicon:x-12" class="text-2xl text-surface-500 ml-1" />
								</button>
								<button
									on:click={() => {
										modalStore.trigger(confirmDeleteModal);
									}}
								>
									<Icon icon="octicon:trash-16" class="text-2xl text-surface-500 ml-1" />
								</button>
							{/if}
						{/if}
					</div>
					{#if editMode}
						<textarea
							class="textarea w-full h-44 variant-ghost-secondary mt-2"
							rows="2"
							bind:value={editModeText}
							placeholder="Your post content here"
						/>
					{:else}
						<TextDropdown
							containerClass="mt-2 md:flex-grow flex items-start md:h-44 w-full"
							textClass="text-sm xs:text-base text-surface-300 md:text-sm md:w-64"
							expandedTextClass="md:overflow-y-scroll md:max-h-44 md:w-full"
							expandIconClass="text-lg xs:text-xl text-surface-300"
							hideIconClass="text-xl xs:text-2xl text-surface-300"
						>
							{data.text}
						</TextDropdown>
					{/if}
				</div>
				<div class="flex flex-row justify-between items-center mt-4">
					<div class="flex flex-row items-center">
						<div class="flex flex-col">
							<button class="flex justify-center items-center" on:click={upvote}>
								{#if data.userVote === 1}
									<Icon
										icon="ion:chevron-up"
										class="text-2xl xs:text-4xl font-semibold text-warning-500"
									/>
								{:else}
									<Icon icon="ion:chevron-up" class="text-2xl xs:text-4xl text-surface-300" />
								{/if}
							</button>
							<button class="flex justify-center items-center" on:click={downvote}>
								{#if data.userVote === -1}
									<Icon
										icon="ion:chevron-down"
										class="text-2xl xs:text-4xl font-semibold text-warning-500"
									/>
								{:else}
									<Icon icon="ion:chevron-down" class="text-2xl xs:text-4xl text-surface-300" />
								{/if}
							</button>
						</div>

						<p class="text-surface-300 xs:text-2xl ml-2 font-semibold">{data.votes}</p>
					</div>
					<button
						class="btn btn-sm xs:btn-lg variant-filled-primary text-sm xs:text-lg font-semibold"
						on:click={toggleComments}>{`${data.totalComments} Comments`}</button
					>
					<button
						class="btn btn-sm xs:btn-lg variant-filled-surface text-sm xs:text-lg font-semibold"
						>Share</button
					>
				</div>
			</div>
		</div>
		{#if commentsVisible}
			{#if data.comments && data.comments.length > 0}
				<CommentList data={data.comments} {enablePreload} />
			{:else}
				<p class="text-center text-2xl text-surface-300">No comments found</p>
			{/if}
		{/if}
	</div>
{/if}
