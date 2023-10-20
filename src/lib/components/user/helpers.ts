export type UserProfile = {
    username: string,
    spotify_id: string,
    spotify_url: string,
    display_name: string,
    bio: string,
    profile_picture: string | null,
    followers: number,
    following: number,
    isFollowing: boolean,
    ownerData: {
        country: string | null,
        email: string,

    } | null,
}