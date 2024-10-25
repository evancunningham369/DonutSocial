const { BASE_URL } = process.env;

export const create_post = async(post) => {
    
    return await fetch(`${BASE_URL}/post`, {
        method: 'POST',
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(post)
    });
}

export const get_my_posts = async(userId) => {
    let serverResponse = await fetch(`${BASE_URL}/posts/${userId}`);
    return await serverResponse.json();
}

export const get_all_posts = async() => {
    let serverResponse = await fetch(`${BASE_URL}/posts/all-posts`);
    return await serverResponse.json();
}

export const get_following_posts = async(userId) => {
    let serverResponse = await fetch(`${BASE_URL}/followed-user-posts/${userId}`);
    return await serverResponse.json();
}

export const get_liked_posts = async(userId) => {
    let serverResponse = await fetch(`${BASE_URL}/liked-posts/${userId}`);
    return await serverResponse.json();
}

export const get_liked_posts_by_id = async(userId) => {
    let serverResponse = await fetch(`${BASE_URL}/liked-posts-id/${userId}`);
    return await serverResponse.json();
}