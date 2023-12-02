import type { PostData, NewPostData, NewCommentData, NewVoteData, EditPostData, EditCommentData } from '../components/posts/helpers';
import { formatPost } from '../components/posts/helpers';
import type { Session } from '@supabase/supabase-js'
import type { SupabaseClient } from '@supabase/supabase-js'

//Create      New Post
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
    if (post.owner !== session.user.id) return { err: "User does not match session" };

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
    if (post.owner !== session.user.id) return { err: "User does not match session" };

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
    const post = await supabase
        .from('Posts')
        .select('owner')
        .eq('id', postID)
        .single();
    if (post.error || !post) return { err: "Post does not exist" };

    //check if user matches session
    if (post.owner === session.user.id) return { err: "User cannot vote on own post" };

    //check if user has already voted on post
    const { prevVote, err } = await supabase
        .from('Votes')
        .select()
        .eq('user', session.user.id)
        .eq('post', postID)
        .single();

    //if user has already voted, update vote
    if (prevVote) {
        const { error } = await supabase
            .from('Votes')
            .update({ value: vote })
            .eq('id', prevVote.id);
        if (error) return { err: error.message };
    }
    //if user has not voted, create vote
    else {
        const { error } = await supabase
            .from('Votes')
            .insert(
                {
                    user: session.user.id,
                    post: postID,
                    value: vote,
                },
            );
        if (error) return { err: error.message };
    }
    return { success: true };
}

//get current user's votes
export async function getUserVotes(session: Session | null, supabase: any) {
    if (!session) return { err: "No active session" };

    const { data, error } = await supabase
        .from('Votes')
        .select('post, value')
        .eq('user', session.user.id);
    if (error) return { userVote: 0 };

    return { userVote: data.value };
}


//Get user's posts
// function gets all posts by a user within a specified range and sorts them by date
// if range is not specified, it will default to 0-10
// if userID is not specified, it will default to the current user
// if userID is specified, it will return all posts by that user
export async function getPostComments(postID: string, supabase: any): Promise<CommentData[]> {
    // Fetch comments for the specified postID
    const { data: comments, error } = await supabase
        .from('Comments')
        .select('id, parent_id, text, created_at')
        .eq('post_id', postID)
        .order('created_at', { ascending: true }); // Sort comments by the order they were posted

    if (error) {
        console.error('Error fetching comments:', error.message);
        return [];
    }

    const commentData: CommentData[] = [];

    // Create a map to store comments by their ID for easy reference
    const commentMap: Record<string, CommentData> = {};

    comments.forEach((comment: any) => {
        // Create a CommentData object
        const commentObj: CommentData = {
            id: comment.id,
            text: comment.text,
            created_at: comment.created_at,
            children: [],
            username: '',
            userId: '',
            avatarURL: null,
            date: new Date(),
        };

        commentMap[comment.id] = commentObj;

        if (comment.parent_id && commentMap[comment.parent_id]) {
            // If the comment has a parent, add it as a child to the parent comment
            commentMap[comment.parent_id].children.push(commentObj);
        } else {
            // If the comment has no parent, it's a root comment, so add it to the main array
            commentData.push(commentObj);
        }
    });

    return commentData;
}

    
export async function createComment(commentData: NewCommentData, session: Session | null, supabase: any) {
    if (!session) return { err: "No active session" };

    // Check if the required parameters for creating a comment are available
    if (!commentData.text || !commentData.postID) {
        return { err: "Missing required parameters for creating a comment" };
    }

    // Check if the post for the comment exists
    const post = await supabase
        .from('Posts')
        .select('owner')
        .eq('id', commentData.postID)
        .single();
    if (post.error || !post) return { err: "Post does not exist" };

    // Check if user matches session
    if (session.user.id !== post.owner) {
        return { err: "User does not have permission to comment on this post" };
    }

    // Create the comment
    const { data: comment, error } = await supabase
        .from('Comments')
        .insert({
            post_id: commentData.postID,
            text: commentData.text,
            parent_id: commentData.parent
        })
        
        .single();
    if (error) return { err: error.message };

    // Create new comment meta record
    const { error: error2 } = await supabase
        .from('CommentMeta')
        .insert({
            comment: comment.id,
            likes: 0,
            replies: 0,
        });

    if (error2) return { err: error2.message };

    return { success: true };
}


export async function getUserPosts(userID: string | null, range: { start: number, end: number } | null, session: Session | null, supabase: any) {
    if (!session) return { err: "No active session" };

    //set default range
    if (!range) range = { start: 0, end: 10 };

    //set default userID
    if (!userID) userID = session.user.id;

    //get posts
    const { data, error } = await supabase
        .from('Posts')
        .select('id, playlist, thread, text, created_at')
        .eq('owner', userID)
        .range(range.start, range.end)
        .order('created_at', { ascending: false });

    if (error) return { err: error.message };

    const formattedPosts: Array<PostData> = [];


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
        const { data: vote, error: err2 } = await supabase
            .from('Votes')
            .select('value')
            .eq('post', data[i].id)
            .eq('user', session.user.id)
            .single();

        if (err2) data[i].userVote = 0;
        else data[i].userVote = vote.value;

        //format posts
        formattedPosts.push(formatPost(data[i]));

    }





}
