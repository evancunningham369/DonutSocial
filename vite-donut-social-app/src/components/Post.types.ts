export type PostType = {
    post_id: number,
    content: string,
    post_datetime: string,
    user_id: number,
    liked_users: number[]
};

export type PostProps = {
    loggedInUserId: number | string | null,
    userIdPoster: number,
    initialPost: PostType,
    profilePicture: string,
    deletePost: (postId: number) => void
};