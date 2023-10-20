<script>
	export let data;

	$: ({ supabase, session } = data);

	const handleSignIn = async () => {
		await supabase.auth.signInWithOAuth({
			provider: 'spotify'
		});

		//check if profile exists
		if (session) {
			const { data: profile, error } = await supabase
				.from('Profile')
				.select('*')
				.eq('id', session.user.id)
				.limit(1);

			if (profile === null || error !== null) {
				//create profile

				//get spotify id from spotify
				const response = await fetch('https://api.spotify.com/v1/me', {
					method: 'GET',
					headers: {
						Authorization: `Bearer ${session?.provider_token}`
					}
				});

				const spotifyData = await response.json();

				await supabase
					.from('Profile')
					.insert({
						user_id: session.user.id,
						bio: '',
						username: spotifyData.display_name,
						spotify_id: spotifyData.id
					})
					.single();
			}
		}
	};

	const handleSignOut = async () => {
		await supabase.auth.signOut();
	};
</script>

<button on:click={handleSignIn}>Sign in</button>
<button on:click={handleSignOut}>Sign out</button>
