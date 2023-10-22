
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
//getUsers gets all the users from the database and returns them as an array of UserProfile
export async function getUsers(filter: UserSearchFilter, range: SearchRange, session: Session, supabase: SupabaseClient) {
    //get profile data from database based on filter
    const filterSet = await followerFilterSubquery(filter, session, supabase);
    let profileList: any[] | null = null;
    let err1: any = null;

    if (filterSet.in) {
        const { data: profiles, error: err } = await supabase.from("Profile").select("*").in("user_id", filterSet.set).range(range.start, range.end);
        profileList = profiles;
    } else {
        const { data: profiles, error: err } = await supabase.from("Profile").select("*").not("user_id", "in", filterSet.set).range(range.start, range.end);
        profileList = profiles;
        err1 = err;
    }
    if (err1) return { err: err1 }

    if (profileList) {



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
            const num_followers = followerCounts !== null && !err1 ? followerCounts : 0;
            const num_following = followingCounts !== null && !err2 ? followingCounts : 0;
            const is_following = isFollowing && isFollowing > 0 && !err3 ? true : false;
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

        return userData;
    }
    return [];
}

//getUserProfile gets the user profile data from the database and from spotify


//DATABASE FUNCTIONS
//---------------------------------------------------------------------------------------------
const followerFilterSubquery = async (filter: UserSearchFilter, session: Session, supabase: SupabaseClient) => {
    const a = filter.currentUserIsFollowing ? filter.currentUserIsFollowing : null;
    const b = filter.currentUserIsFollowedBy ? filter.currentUserIsFollowedBy : null;
    const user_id = session.user.id;
    let setA: Set<any> = new Set<any>();
    let setB: Set<any> = new Set<any>();

    //get the set of user ids of users that the current user is following
    if (a !== null) {
        const res = await supabase
            .from('Following')
            .select('following')
            .eq('follower', user_id)
        if (res.data) {
            setA = new Set<any>(res.data)
        }
    }

    //get the set of user ids of users that are following the current user
    if (b !== null) {
        const res = await supabase
            .from('Following')
            .select('follower')
            .eq('following', user_id)
        if (res.data) {
            setB = new Set<any>(res.data)
        }
    }

    if (a !== null || b !== null) {
        if (a === null || b === null) {
            if (a !== null) {
                if (a === true) {
                    return { in: true, set: Array.from(setA) }
                }
                else { //a === false
                    return { in: false, set: Array.from(setA) }
                }
            }
            else { //b !== null

                if (b === true) {
                    return { in: true, set: Array.from(setB) }
                }
                else { //b === false
                    return { in: false, set: Array.from(setB) }
                }
            }
        }
        else { //a !== null && b !== null

            if (a === b) {
                if (a === true) {
                    return { in: true, set: Array.from(new Set([...setA].filter((x) => setB.has(x)))) }
                }
                else { //a === false
                    return { in: false, set: Array.from(new Set([...setA, ...setB])) }
                }
            } else { //a !== b
                if (a === true) {
                    return { in: true, set: Array.from(new Set([...setA].filter((x) => !setB.has(x)))) }
                }
                else { //a === false
                    return { in: false, set: Array.from(new Set([...setB].filter((x) => !setA.has(x)))) }
                }
            }
        }

    }
    return { in: false, set: [] }
}