const { BASE_URL } = process.env;

export const create_post = async(post) => {
    return await fetch(`${BASE_URL}/post`, {
        method: 'POST',
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(post)
    });
}

export const get_my_posts = async(userId) => {
    return await fetch(`${BASE_URL}/posts/${userId}`);
}

export const get_all_posts = async() => {
    return await fetch(`${BASE_URL}/posts/all-posts`);
}

export const get_following_posts = async(userId) => {
    return await fetch(`${BASE_URL}/followed-user-posts/${userId}`);
}

export const get_liked_posts = async(userId) => {
    return await fetch(`${BASE_URL}/liked-posts/${userId}`);
}