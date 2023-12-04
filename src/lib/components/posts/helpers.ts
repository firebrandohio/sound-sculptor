import { getUserPosts } from "../../supabase/posts";

export type PostPlaylistData = {
    playlistID: string,
    playlistURL: string,
    playlistRank: number,
    playlistTitle: string,
    userRank: 0 | 1 | 2 | 3 | 4 | 5,
    isSubscribed: boolean
};


export type PostData = {
    playlistData: PostPlaylistData | null,
    username: string,
    userID: string,
    avatarURL: string | null,
    text: string,
    date: Date,
    votes: number,
    totalComments: number,
    comments: Array<CommentData> | null,
    id: string,
    rank: number,
    status: string,
    userVote: -1 | 0 | 1
};

export type CommentData = {
    username: string,
    userId: string,
    avatarURL: string | null,
    text: string,
    date: Date,
    children: Array<CommentData>,
    id: string
};

export type NewPostData = {
    userID: string,
    playlistID: string | null,
    threadSlug: string | null,
    text: string,

};

export type NewCommentData = {
    userID: string,
    postID: string,
    parent: string | null,
    text: string,
};

export type NewVoteData = {
    userID: string,
    postID: string,
    vote: -1 | 0 | 1
};

export type EditPostData = {
    userID: string,
    postID: string,
    text: string
};

export type EditCommentData = {
    userID: string,
    commentID: string,
    text: string
};

export type PostPlaylistBasicData = {
    id: string,
    title: string,
    duration: number,
};

export type PostMetadata = {
    thread: string | null,
    sharedByID: string | null,
    sharedByUsername: string | null,
    sharedByAvatar: string | null,
    sharedOn: Date | null,
};

export type PostQuery = {
    userID: string | null,
    thread: string | null,
    mainFeedFor: string | null | undefined,
    maxPosts: number | null,
    range: {
        start: number,
        end: number
    } | null,
}


//format post data for display
//takes in an object with the following properties:
// {
//     id: string,
//     owner: string,
//     playlist: string | null,
//     thread: string | null,
//     text: string,
//     created_at: Date,
//     last_edited: Date | null,
//     votes: number,
//     userVote: -1 | 0 | 1,
//     comments: number,
// }
//and returns an object of type PostData

export function formatPost(post: any): PostData {

    const playlistData = null;
    const username = post.username;
    const avatarURL = post.avatar;
    const text = post.text;
    const date = post.date_posted;
    const votes = post.votes;
    const totalComments = post.comments;
    const comments = null;
    const id = post.id;
    const rank = post.rank;
    const status = post.status;
    const userVote = post.userVote;


    let formattedPost = {
        playlistData,
        username,
        userID: post.owner,
        avatarURL,
        text,
        date,
        votes,
        totalComments,
        comments,
        id,
        rank,
        status,
        userVote
    };

    return formattedPost;
}

//handle various post querries and request posts from supabase
export async function requestPosts(query: PostQuery, session: any, supabase: any) {
    //set default range
    if (!query.range) query.range = { start: 0, end: 10 };

    //if a user id is provided, get posts for that user
    if (query.userID) {
        return await getUserPosts(query.userID, query.range, session, supabase);
    }
    //get posts
    return null;

}
