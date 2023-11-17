<script lang="ts">
	//script here
	import type { Session } from '@supabase/supabase-js';
	import NewPostBar from './NewPostBar.svelte';

	export let data: { supabase: any; session: Session | null };
</script>

<div class="flex flex-col justify-start pt-4 w-full max-w-3xl min-h-screen items-center">
	<NewPostBar {data} />
</div>
