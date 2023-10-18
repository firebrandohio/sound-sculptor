import { type } from "os";

export type PostData = {
    playlistData: {
        playlistID: string,
        playlistURL: string,
        playlistRank: number,
        playlistTitle: string,
        userRank: 0 | 1 | 2 | 3 | 4 | 5,
        isSubscribed: boolean
    },
    username: string,
    avatarURL: string | null,
    text: string,
    date: Date,
    votes: number,
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
    playlistID: string,
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