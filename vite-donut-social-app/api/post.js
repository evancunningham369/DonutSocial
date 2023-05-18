const { BASE_URL } = process.env;

export const create_post = async(post) => {
    return await fetch(`${BASE_URL}/post`, {
        method: 'POST',
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(post)
    });
}

export const get_all_posts = async(userId) => {
    return await fetch(`${BASE_URL}/posts/${userId}`);
}