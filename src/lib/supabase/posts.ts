import type { PostData, NewPostData, NewCommentData, NewVoteData, EditPostData, EditCommentData } from '../components/posts/helpers';
import type { Session } from '@supabase/supabase-js'
import type { SupabaseClient } from '@supabase/supabase-js'
//Create New Post
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
        );
    if (error) return { err: error.message };

    return { sucess: true };
}