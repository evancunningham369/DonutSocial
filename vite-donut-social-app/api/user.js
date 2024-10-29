const { BASE_URL } = process.env;

export const like_post = async(userId, postId) => {
    const serverResponse = await fetch(`${BASE_URL}/like-post/${userId}/${postId}`, {
        method: "POST",
        headers: {"Content-Type": "application/json"}
    });
    return await serverResponse.json();
}

export const delete_post = async(postId) => {
    
    return await fetch(`${BASE_URL}/post/${postId}`, {
        method: "DELETE",
        headers: {"Content-Type": "application/json"}
    });
}

export const follow_user = async(userId, userIdToFollow) => {
    return await fetch(`${BASE_URL}/follow-user/${userId}/${userIdToFollow}`, {
        method: "PATCH",
        headers: {"Content-Type": "application/json"}
    });
}