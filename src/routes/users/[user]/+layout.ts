import { error } from "@sveltejs/kit";
import type { Session, SupabaseClient } from "@supabase/supabase-js";
import type { UserProfile } from "$lib/components/user/helpers.js";



//create load function that loads data from the user with the given slug;

export async function load({ params, parent }) {
    const { supabase, session } = await parent();
    const { user } = params;
    //const session = await getSession();
    const profile = await getUserProfile(user, session, supabase);
    return {
        profile,
    };
}

async function getUserProfile(userID: string, session: Session | null, supabase: SupabaseClient) {
    //validate input
    if (userID === null) {
        throw error(400, { message: "No user ID provided" })
    }
    else if (session === null) {
        throw error(401, { message: "Not logged in" })
    }

    //get data from database
    const { data: profile, error: err } = await supabase.from("Profile").select("*").eq("user_id", userID).single();
    if (err) throw error(500, { message: "Error getting profile data" })

    //check if user exists
    if (profile === null || profile.length === 0) {
        throw error(404, { message: "User not found" })
    }

    //get # of followers from database
    const { data: followers, error: err1 } = await supabase.from("Following").select("*", { count: 'exact', head: true }).eq("following", userID);
    if (err1) throw error(500, { message: "Error getting # of followers" })

    //get # of following from database
    const { data: following, error: err2 } = await supabase.from("Following").select("*", { count: 'exact', head: true }).eq("follower", userID);
    if (err2) throw error(500, { message: "Error getting # of following" })
    //check if user is following
    const { data: isFollowing, error: err3 } = await supabase.from("Following").select("*").eq("follower", session.user.id).eq("following", userID).limit(1);
    if (err3) throw error(500, { message: "Error getting following" })

    //get data from spotify
    let spotifyData: any;
    let ownerData: any;

    //check if user is requesting own data
    if (session.user.id === userID) {
        const response = await fetch('https://api.spotify.com/v1/me', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${session?.provider_token}`
            }
        });

        spotifyData = await response.json();
        ownerData = {
            country: null,
            email: spotifyData.email,
        }

        if (spotifyData === null) {
            throw error(500, { message: "Error getting spotify data" })
        }
    }
    else {
        const response = await fetch(`https://api.spotify.com/v1/users/${profile.spotify_id}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${session?.provider_token}`
            }
        });
        spotifyData = await response.json();
        ownerData = null;
    }

    if (spotifyData === null) {
        throw error(500, { message: "Error getting spotify data" })
    }

    //format/validate data
    const profile_picture = (spotifyData.images && spotifyData.images.length > 0) ? spotifyData.images[0].url : null;
    const num_followers = followers !== null && !err1 ? followers[0].count : 0;
    const num_following = following !== null && !err2 ? following[0].count : 0;
    const is_following = isFollowing.length > 0 && !err3 ? true : false;
    const bio = profile.bio ? profile.bio : "";

    const userProfile: UserProfile = {
        username: spotifyData.display_name,
        spotify_id: spotifyData.id,
        spotify_url: spotifyData.external_urls.spotify,
        display_name: spotifyData.display_name,
        bio,
        profile_picture,
        followers: num_followers,
        following: num_following,
        isFollowing: is_following,
        ownerData,
    }



    return userProfile;
}