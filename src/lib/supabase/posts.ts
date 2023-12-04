import type { PostData, NewPostData, NewCommentData, NewVoteData, EditPostData, EditCommentData } from '../components/posts/helpers';
import { formatPost } from '../components/posts/helpers';
import type { Session } from '@supabase/supabase-js'
import type { SupabaseClient } from '@supabase/supabase-js'
import { checkFollowing } from './userInteraction';


//Create  New Post
export async function createPost(postData: NewPostData, session: Session | null, supabase: any) {
    if (!session) return { err: "No active session" };


    //check if playlist exists
    if (postData.playlistID) {
        const playlist = await supabase
            .from('Playlists')
            .select('id')
            .eq('id', postData.playlistID)
            .single();
        if (playlist.error || !playlist) postData.playlistID = null;
    }

    //check if thread exists
    if (postData.threadSlug) {
        const thread = await supabase
            .from('Threads')
            .select('slug')
            .eq('slug', postData.threadSlug)
            .single();
        if (thread.error || !thread) return { err: "Thread does not exist" };
    }

    //check if user matches session
    if (postData.userID !== session.user.id) return { err: "User does not match session" };

    //create post
    const { data, error } = await supabase
        .from('Posts')
        .insert(
            {
                owner: postData.userID,
                playlist: postData.playlistID,
                thread: postData.threadSlug,
                text: postData.text,
            },
        )
        .select();
    if (error) return { err: error.message };

    //create new post meta record
    const { error2 } = await supabase
        .from('PostMeta')
        .insert(
            {
                post: data[0].id,
                votes: 0,
                comments: 0,
            })

    if (error2) return { err: error2.message };

    return { success: true };
}

//delete post
export async function deletePost(postID: string, session: Session | null, supabase: any) {
    if (!session) return { err: "No active session" };

    //check if post exists
    const post = await supabase
        .from('Posts')
        .select('owner')
        .eq('id', postID)
        .single();
    if (post.error || !post) return { err: "Post does not exist" };

    //check if user matches session
    if (post.data.owner !== session.user.id) return { err: "User does not match session" };

    //delete post
    const { error } = await supabase
        .from('Posts')
        .delete()
        .eq('id', postID);
    if (error) return { err: error.message };

    return { success: true };
}

//edit post message
export async function editPostText(postID: string, message: string, session: Session | null, supabase: any) {
    if (!session) return { err: "No active session" };

    //check if post exists
    const post = await supabase
        .from('Posts')
        .select('owner')
        .eq('id', postID)
        .single();
    if (post.error || !post) return { err: "Post does not exist" };

    //check if user matches session
    if (post.data.owner !== session.user.id) return { err: "User does not match session" };

    //edit post
    const { error } = await supabase
        .from('Posts')
        .update({ text: message })
        .eq('id', postID);
    if (error) return { err: error.message };

    return { success: true };
}

//vote on post
export async function voteOnPost(postID: string, vote: -1 | 0 | 1, session: Session | null, supabase: any) {
    if (!session) return { err: "No active session" };

    //check if post exists

    const { owner, id, postErr } = await supabase
        .from('Posts')
        .select('owner', 'id')
        .eq('id', postID)
        .single();
    console.log(owner)
    if (postErr || !owner) return { err: postErr };



    //check if user has already voted on post
    const { prevVote, err } = await supabase
        .from('Votes')
        .select('id', 'value')
        .eq('user_id', session.user.id)


    console.log(prevVote[0].value)

    if (err) return { err: err.message };

    //if user has already voted, update vote
    if (prevVote) {
        const { error1 } = await supabase
            .from('Votes')
            .update({ value: vote })
            .eq('id', prevVote.id);
        if (error1) return { err: error1.message };


    }
    //if user has not voted, create vote
    else {
        const { error2 } = await supabase
            .from('Votes')
            .insert(
                {
                    user_id: session.user.id,
                    post: postID,
                    value: vote,
                },
            );
        if (error2) return { err: error2.message };
    }
    //update post meta
    //get current votes
    const { data, error3 } = await supabase
        .from('PostMeta')
        .select('votes')
        .eq('post', postID)
        .single();
    if (error3) return { err: error3.message };
    const votes = data.votes + vote;
    //update votes
    const { error4 } = await supabase
        .from('PostMeta')
        .update({ votes })
        .eq('post', postID);
    if (error4) return { err: error4.message };
    return { success: true };
}

//get current user's votes
export async function getUserVotes(session: Session | null, supabase: any) {
    if (!session) return { err: "No active session" };

    const { data, error } = await supabase
        .from('Votes')
        .select('value')
        .eq('user_id', session.user.id);
    if (error) return { userVote: 0 };

    return { userVote: data.value };
}


//Get user's posts
// function gets all posts by a user within a specified range and sorts them by date
// if range is not specified, it will default to 0-10
// if userID is not specified, it will default to the current user
// if userID is specified, it will return all posts by that user
export async function getUserPosts(userID: string | null, range: { start: number, end: number } | null, session: Session | null, supabase: any) {
    const formattedPosts: Array<PostData> = [];
    if (!session) return { posts: formattedPosts, err: "No active session" };

    //set default range
    if (!range) range = { start: 0, end: 10 };

    //set default userID
    if (!userID) userID = session.user.id;


    //get posts
    const { data, error } = await supabase
        .from("Posts")
        .select('*')
        .eq('owner', userID)
        .range(range.start, range.end)
        .order('date_posted', { ascending: false });

    if (error) return { posts: formattedPosts, err: error.message, };

    for (let i = 0; i < data.length; i++) {
        //get metadata for each post
        const { data: meta, error: err } = await supabase
            .from('PostMeta')
            .select('votes, comments')
            .eq('post', data[i].id)
            .single();
        if (err) {
            data[i].votes = 0;
            data[i].comments = 0;
        };
        data[i].votes = meta.votes;
        data[i].comments = meta.comments;

        //get current user's vote
        const { userVote } = await getUserVotes(session, supabase);
        data[i].userVote = userVote;

        //get username and avatar
        const { data: user, error: err3 } = await supabase
            .from("Profile")
            .select('username, spotify_id')
            .eq('user_id', data[i].owner)
            .single();

        if (err3) return { posts: [], err: err3.message };
        data[i].username = user.username;

        //get avatar from spotify
        const spotifyData = await (await fetch(`https://api.spotify.com/v1/users/${user.spotify_id}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${session?.provider_token}`
            }
        })).json();
        data[i].avatar = (spotifyData.images && spotifyData.images.length > 0) ? spotifyData.images[0].url : null;


        //get status
        data[i].status = (await getStatus(data[i].owner, session, supabase)).status;

        //format posts
        formattedPosts.push(formatPost(data[i]));

    }
    return { posts: formattedPosts, err: null };
}


export async function EditCommentData(commentData: string, message: string, session: Session | null, supabase: any) {
    if (!session) return { err: "No active session" };

    //check if comment exists
    const comment = await supabase
        .from('Comment')
        .select('owner')
        .eq('id', commentData)
        .single();
    if (comment.error || !comment) return { err: "Comment does not exist" };

    //check if user matches session
    if (comment.owner !== session.user.id) return { err: "User does not match session" };

    //edit comment
    const { error } = await supabase
        .from('Comments')
        .update({ text: message })
        .eq('id', commentData);
    if (error) return { err: error.message };

    return { success: true };
}

//get status
export async function getStatus(owner: string, session: Session | null, supabase: any) {
    if (!session) return { err: "No active session" };
    const following = await checkFollowing(session.user.id, owner, supabase);
    const followed = await checkFollowing(owner, session.user.id, supabase);

    if (following.err || followed.err) return { status: "" };

    if (following.following && followed.following) return { status: "You follow each other" };
    if (following.following) return { status: "you are following" };
    if (followed.following) return { status: "following you" };
    return { status: "" };
}