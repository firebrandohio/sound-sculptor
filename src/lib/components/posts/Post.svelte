<script lang="ts">
	import TextDropdown from '../general/TextDropdown.svelte';
	import PlaylistBlock from './PlaylistBlock.svelte';
	import Icon from '@iconify/svelte';
	import { faker } from '@faker-js/faker';
	import CommentList from './CommentList.svelte';

	export let data = {
		playlistData: {
			playlistURL: '',
			playlistRank: 0,
			playlistTitle: 'TEST: PLAYLIST TITLE',
			userRank: 0,
			isSubscribed: false
		},
		username: faker.name.fullName(),
		avatarURL: '',
		text: faker.lorem.paragraph(5),
		date: 'TEST: DATE',
		votes: -20,
		comments: [],
		id: '',
		rank: 0,
		status: 'TEST: STATUS',
		userVote: 0
	};

	let commentsVisible = false;

	const toggleComments = () => {
		commentsVisible = !commentsVisible;
	};

	let upvote = () => {
		if (data.userVote === 1) {
			data.votes -= 1;
			data.userVote = 0;
			return;
		}
		if (data.userVote === -1) {
			data.votes += 2;
			data.userVote = 1;
			return;
		}
		data.votes += 1;
		data.userVote = 1;
	};

	let downvote = () => {
		if (data.userVote === -1) {
			data.votes += 1;
			data.userVote = 0;
			return;
		}
		if (data.userVote === 1) {
			data.votes -= 2;
			data.userVote = -1;
			return;
		}
		data.votes -= 1;
		data.userVote = -1;
	};
</script>

<div
	class="flex flex-col w-full justify-center max-w-md md:max-w-3xl card p-2 xs:p-3 mx-4 my-8 variant-soft-secondary"
>
	<div class="flex md:flex-row flex-col md:align-end">
		<PlaylistBlock data={data.playlistData} />
		<div class="flex flex-col w-full md:max-w-md md:ml-6 md:h-full">
			<div class="my-2 flex flex-row items-center">
				{#if data.avatarURL === ''}
					<img
						class="w-16 xs:w-20 aspect-square"
						src={`https://api.dicebear.com/7.x/shapes/svg?seed=${data.username}`}
						alt="avatar"
					/>
				{:else}
					<img class="w-16 xs:w-20 aspect-square" src={data.avatarURL} alt="avatar" />
				{/if}
				<div class="flex flex-col justify-start ml-6">
					<a
						class="text-surface-300 text-base xs:text-xl anchor font-semibold"
						href={`/users/${data.username}`}>{data.username}</a
					>
					<div class="text-xs xs:text-base text-surface-400 italic">{data.date}</div>
					<div class="text-xs xs:text-base text-surface-400 italic">{data.status}</div>
				</div>
			</div>
			<TextDropdown
				containerClass="mt-2"
				textClass="text-sm xs:text-base text-surface-300"
				expandIconClass="text-lg xs:text-xl text-surface-300"
				hideIconClass="text-xl xs:text-2xl text-surface-300"
			>
				{data.text}
			</TextDropdown>

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
					on:click={toggleComments}>{`${data.comments.length} Comments`}</button
				>
				<button class="btn btn-sm xs:btn-lg variant-filled-surface text-sm xs:text-lg font-semibold"
					>Share</button
				>
			</div>
		</div>
	</div>
	{#if commentsVisible}
		<CommentList />
	{/if}
</div>
