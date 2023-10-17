export type PostData = {
    playlistData: {
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
    comments: Array<CommentData>,
    id: string,
    rank: number,
    status: string,
    userVote: -1 | 0 | 1
};

export type CommentData = {
    username: string,
    avatarURL: string | null,
    text: string,
    date: Date,
    children: Array<CommentData>,
    id: string
};