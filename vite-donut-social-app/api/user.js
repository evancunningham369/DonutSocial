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