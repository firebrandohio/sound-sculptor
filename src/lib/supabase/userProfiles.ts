
import type { Session } from '@supabase/supabase-js'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { UserProfile } from '$lib/components/user/helpers.js'



export type UserSearchFilter = {
    currentUserIsFollowing: boolean | null,
    currentUserIsFollowedBy: boolean | null,
}

export type SearchRange = {
    start: number,
    end: number,
}

//SERVER FUNCTIONS
//---------------------------------------------------------------------------------------------
export const getUsers = async (filter: UserSearchFilter | null, range: SearchRange, session: Session, supabase: SupabaseClient) => {
    //get profile data from database based on filter
    if (filter === null) {
        filter = {
            currentUserIsFollowing: null,
            currentUserIsFollowedBy: null,
        };
    }

    //TODO: remove this when the filter is implemented
    if (filter.currentUserIsFollowing === false) filter.currentUserIsFollowing = null;
    if (filter.currentUserIsFollowedBy === false) filter.currentUserIsFollowedBy = null;

    //get user data from database
    const data = await getUserProfiles(filter, range, session, supabase);
    if (data.err) return { err: data.err }
    const profileList = data.profiles;

    //get data from spotify for each user
    let userData: Array<UserProfile> = [];

    //itterate through all users
    for (const profile of profileList) {
        //get spotify data
        const spotifyData = await (await fetch(`https://api.spotify.com/v1/users/${profile.spotify_id}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${session?.provider_token}`
            }
        })).json();

        //format and validate data for all users
        const ownerData = null;
        if (spotifyData === null) {
            continue;
        }

        //get # of followers from database for each user
        const { count: followerCounts, error: err2 } = await supabase
            .from("Following")
            .select("*", { count: 'exact', head: true })
            .eq("following", profile.user_id);

        //get # of following from database for each user
        const { count: followingCounts, error: err3 } = await supabase
            .from("Following")
            .select("*", { count: 'exact', head: true })
            .eq("follower", profile.user_id);

        //check if user is following for each user
        const { count: isFollowing, error: err4 } = await supabase
            .from("Following")
            .select("*", { count: 'exact', head: true })
            .eq("follower", session.user.id)
            .eq("following", profile.user_id);




        const profile_picture = (spotifyData.images && spotifyData.images.length > 0) ? spotifyData.images[0].url : null;
        const num_followers = followerCounts !== null && !err2 ? followerCounts : 0;
        const num_following = followingCounts !== null && !err3 ? followingCounts : 0;
        const is_following = isFollowing && isFollowing > 0 && !err4 ? true : false;
        const bio = profile.bio ? profile.bio : "";


        userData.push({
            username: spotifyData.display_name,
            id: profile.user_id,
            spotify_id: spotifyData.id,
            spotify_url: spotifyData.external_urls.spotify,
            display_name: spotifyData.display_name,
            bio,
            profile_picture,
            followers: num_followers,
            following: num_following,
            isFollowing: is_following,
            ownerData,
        })

    }

    return { userData, err: null };

}





//DATABASE FUNCTIONS
//---------------------------------------------------------------------------------------------


export async function getUserProfiles(filter: UserSearchFilter | null, range: SearchRange, session: Session, supabase: SupabaseClient) {
    //get profile data from database based on filter
    if (filter === null) {
        filter = {
            currentUserIsFollowing: null,
            currentUserIsFollowedBy: null,
        };
    }
    //case 1: filter is null: get all users in range
    if (filter.currentUserIsFollowing === null && filter.currentUserIsFollowedBy === null) {
        const { data: profiles, error: err } = await supabase.from("Profile").select("*").range(range.start, range.end);
        if (err) return { profiles: new Array, err }
        return { profiles, err: null };
    }

    //case 2: currentUserIsFollowing is true and currentUserIsFollowedBy is null: get all users that the current user is following
    if (filter.currentUserIsFollowing === true && filter.currentUserIsFollowedBy === null) {
        let { ids, err: err1 } = await getFollowing(session, supabase);

        if (err1) return { profiles: new Array, err: err1 }
        if (ids && ids.length > 0) {
            const { data: profiles, error: err } = await supabase
                .from("Profile")
                .select("*")
                .in("user_id", (ids))
                .range(range.start, range.end);
            if (err) return { profiles: new Array, err }
            return { profiles, err: null };
        }

    }

    //case 3: currentUserIsFollowing is null and currentUserIsFollowedBy is true: get all users that are following the current user
    if (filter.currentUserIsFollowing === null && filter.currentUserIsFollowedBy === true) {
        let { ids, err: err1 } = await getFollowers(session, supabase);

        if (err1) return { profiles: new Array, err: err1 }
        if (ids && ids.length > 0) {
            const { data: profiles, error: err } = await supabase
                .from("Profile")
                .select("*")
                .in("user_id", (ids))
                .range(range.start, range.end);
            if (err) return { profiles: new Array, err }
            return { profiles, err: null };
        }

    }

    //case 4: currentUserIsFollowing is true and currentUserIsFollowedBy is true: get all users that the current user is following and are following the current user
    if (filter.currentUserIsFollowing === true && filter.currentUserIsFollowedBy === true) {
        let { ids: ids1, err: err1 } = await getFollowing(session, supabase);
        let { ids: ids2, err: err2 } = await getFollowers(session, supabase);

        if (err1) return { profiles: new Array, err: err1 }
        if (err2) return { profiles: new Array, err: err2 }
        if (ids1 && ids2 && ids1.length > 0 && ids2.length > 0) {
            const { data: profiles, error: err } = await supabase
                .from("Profile")
                .select("*")
                .in("user_id", (ids1))
                .in("user_id", (ids2))
                .range(range.start, range.end);
            if (err) return { profiles: new Array, err }
            return { profiles, err: null };
        }

    }
    return { profiles: new Array, err: null };
}

//getFollowing gets the user ids of all users that the current user is following
export async function getFollowing(session: Session, supabase: SupabaseClient) {
    const { data: following, error: err } = await supabase
        .from("Following")
        .select("following")
        .eq("follower", session.user.id);
    if (err) return { err }
    return { ids: following.map((x) => x.following) };
}

//getFollowers gets the user ids of all users that are following the current user
export async function getFollowers(session: Session, supabase: SupabaseClient) {
    const { data: followers, error: err } = await supabase
        .from("Following")
        .select("follower")
        .eq("following", session.user.id);
    if (err) return { err }
    return { ids: followers.map((x) => x.follower) };
}