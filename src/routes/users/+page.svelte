<script lang="ts">
	import UserSearchList from '$lib/components/user/UserSearchList.svelte';
	export let data;
	$: ({ supabase, session } = data);
	//export let profile;
</script>

<div class="flex flex-col justify-center items-center w-full">
	<UserSearchList users={[]} {session} {supabase} />
</div>
