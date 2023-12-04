import type { Session } from '@supabase/supabase-js'
import type { SupabaseClient } from '@supabase/supabase-js'


//SERVER FUNCTIONS
//---------------------------------------------------------------------------------------------
//followUser adds a user to the list of users that the current user is following
export const followUser = async (follower: string, following: string, session: Session | null, supabase: SupabaseClient) => {

    //validate input
    if ((follower === null || following === null) && follower === following) {
        return { err: "invalid input" };
    }
    else if (session === null) {
        return { err: "not logged in" };
    }

    //verify that the logged in user is the only one requesting to follow
    if (session.user?.id !== follower) {
        return { err: "cannot force other user to follow self" };
    }

    //check if user is already following
    const { data: isFollowing, error: err } = await supabase.from("Following").select("*").eq("follower", follower).eq("following", following).limit(1);
    if (err) return { err: "error checking if already following" };

    //if user is already following, return
    if (isFollowing.length !== 0) return { err: "already following" };

    //add follower to database
    const { error: err2 } = await supabase.from("Following").insert({ follower, following });
    if (err2) return { err: err2.message };

    return { message: "user now following" }
};


//unfollowUser removes a user from the list of users that the current user is following
export const unfollowUser = async (follower: string, following: string, session: Session | null, supabase: SupabaseClient) => {
    //validate input
    if ((follower === null || following === null) && follower === following) {
        return { err: "invalid input" };
    }
    else if (session === null) {
        return { err: "not logged in" };
    }

    //check if user is already following
    const { data: isFollowing, error: err } = await supabase.from("Following").select("*").eq("follower", follower).eq("following", following).limit(1);
    if (err) return { err: "error checking if following" };

    //if user is not following, return
    if (isFollowing.length === 0) return { err: "not following" };

    //remove follower from database
    const { error: err2 } = await supabase.from("Following").delete().eq("follower", follower).eq("following", following);
    if (err2) return { err: "could not remove follower" };

    return { message: "user now unfollowing" }
};

//check following status
//returns true if follower is following following
export const checkFollowing = async (follower: string, following: string, supabase: SupabaseClient) => {
    //validate input
    if ((follower === null || following === null) && follower === following) {
        return { err: "invalid input" };
    }

    //check if user is already following
    const { data: isFollowing, error: err } = await supabase.from("Following").select("*").eq("follower", follower).eq("following", following).limit(1);
    if (err) return { err: "error checking if following" };

    //if user is not following, return
    if (isFollowing.length === 0) return { following: false };

    return { following: true }
};

//DATABASE FUNCTIONS
//---------------------------------------------------------------------------------------------