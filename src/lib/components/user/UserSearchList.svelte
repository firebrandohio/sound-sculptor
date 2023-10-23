<script lang="ts">
	import { Paginator, type PaginationSettings } from '@skeletonlabs/skeleton';
	import type { UserProfile } from './helpers';
	import { getUsers } from '$lib/supabase/userProfiles';
	import { onMount } from 'svelte';
	import type { SupabaseClient, Session } from '@supabase/supabase-js';

	import UserSearchListItem from './UserSearchListItem.svelte';

	export let users: Array<UserProfile>;
	export let session: Session | null;
	export let supabase: SupabaseClient;

	let timeoutFlag = false;

	let followsYou = false;
	let youFollow = false;

	const updateSearch = async (followsYou: boolean, youFollow: boolean) => {
		if (session) {
			timeoutFlag = false;
			users = [];
			const res = (
				await getUsers(
					{ currentUserIsFollowedBy: followsYou, currentUserIsFollowing: youFollow },
					{ start: 0, end: 100 },
					session,
					supabase
				)
			).userData;
			if (res) {
				users = res;
			}
		}
	};

	const debounce = (callback: Function, wait = 400) => {
		let timeout: ReturnType<typeof setTimeout>;

		return (...args: any[]) => {
			clearTimeout(timeout);
			timeout = setTimeout(() => callback(...args), wait);
		};
	};

	/// TODO: debounce this
	$: updateSearch(followsYou, youFollow);

	let paginationSettings = {
		page: 0,
		limit: 10,
		size: users.length,
		amounts: [1, 10, 20, 50]
	} satisfies PaginationSettings;

	$: paginatedSource = users.slice(
		paginationSettings.page * paginationSettings.limit,
		paginationSettings.page * paginationSettings.limit + paginationSettings.limit
	);

	onMount(async () => {
		if (!users || users.length === 0) {
			if (session) {
				const res = await getUsers(null, { start: 0, end: 100 }, session, supabase);
				if (res.userData) {
					users = res.userData;
					if (users.length === 0) {
						timeoutFlag = true;
					}
				}
			}
		}
	});

	function onPageChange(e: CustomEvent): void {
		console.log('event:page', e.detail);
	}

	function onAmountChange(e: CustomEvent): void {
		console.log('event:amount', e.detail);
	}

	function clearFilters() {
		followsYou = false;
		youFollow = false;
	}
</script>

<div class="card variant-soft-secondary max-w-md w-full p-2 mt-6 sm:p-3 m-2 flex flex-col h-full">
	<div class="flex flex-wrap flex-row justify-between">
		<span class="font-semibold text-secondary-200">Filters</span>

		<label class="flex items-center space-x-2 text-sm">
			<input class="checkbox" type="checkbox" bind:checked={youFollow} />
			<p>You Follow</p>
		</label>
		<label class="flex items-center space-x-2 text-sm">
			<input class="checkbox" type="checkbox" bind:checked={followsYou} />
			<p>Follows You</p>
		</label>
		<button class="btn btn-sm variant-ghost-surface" on:click={clearFilters}>Clear All</button>
	</div>
	<div class="my-3">
		{#if users.length === 0}
			{#each Array(paginationSettings.limit) as _}
				<UserSearchListItem user={null} />
			{/each}
		{:else if timeoutFlag}
			<div class="flex flex-col justify-center items-center w-full">
				<span class="text-secondary-200 text-center">
					No users found. Try searching for something else.
				</span>
			</div>
		{:else}
			{#each paginatedSource as user}
				<UserSearchListItem {user} />
			{/each}
		{/if}
	</div>
	<div class="flex flex-col flex-grow overflow-y-auto" />

	<Paginator
		bind:settings={paginationSettings}
		controlVariant="variant-ghost-surface"
		showNumerals={true}
		maxNumerals={1}
		on:page={onPageChange}
		on:amount={onAmountChange}
	/>
</div>
