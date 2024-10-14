const { BASE_URL } = process.env;

export const like_post = async(userId, postId) => {
    return await fetch(`${BASE_URL}/like-post/?userId=${userId}&postId=${postId}`, {
        method: "PATCH",
        headers: {"Content-Type": "application/json"}
    });
}

export const unlike_post = async(userId, postId) => {
    return await fetch(`${BASE_URL}/unlike-post/?userId=${userId}&postId=${postId}`, {
        method: "PATCH",
        headers: {"Content-Type": "application/json"}
    });
}

export const delete_post = async(postId) => {
    return await fetch(`${BASE_URL}/post/${postId}`, {
        method: "DELETE",
        headers: {"Content-Type": "application/json"}
    });
}

export const follow_user = async(userId, userIdToFollow) => {
    return await fetch(`${BASE_URL}/follow-user/?userId=${userId}&userToFollow=${userIdToFollow}`, {
        method: "PATCH",
        headers: {"Content-Type": "application/json"}
    });
}

export const unfollow_user = async(userId, userIdToUnfollow) => {
    return await fetch(`${BASE_URL}/unfollow-user/?userId=${userId}&userToUnfollow=${userIdToUnfollow}`, {
        method: "PATCH",
        headers: {"Content-Type": "application/json"}
    });
}