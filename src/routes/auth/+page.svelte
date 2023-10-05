<script>
	export let data;
	let { supabase } = data;
	$: ({ supabase } = data);

	const handleSignIn = async () => {
		await supabase.auth.signInWithOAuth({
			provider: 'spotify'
		});
	};

	const handleSignOut = async () => {
		await supabase.auth.signOut();
	};
</script>

<button on:click={handleSignIn}>Sign in</button>
<button on:click={handleSignOut}>Sign out</button>
