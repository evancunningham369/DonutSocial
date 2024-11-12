import * as post_req from '../../api/post.js';

function usePosts(userId, posts, setPosts){
    const loggedInUserId = sessionStorage.getItem('userId');
    const createPost = async () => {
        
        const postContent = document.getElementById('contentField').textContent;
        
        const post = {
            content: postContent,
            userId: loggedInUserId
        }
        
        await post_req.create_post(post);
    }
    
    const getPost = async (selection) => {

        let allPosts = [];
        switch (selection) {
            case 'general':
                allPosts = await post_req.get_all_posts();
                break;
            case 'following':
                allPosts = await post_req.get_following_posts(loggedInUserId);
                break;
            case 'user':
                allPosts = await post_req.get_my_posts(userId);
                break;
            case 'liked':
                allPosts = await post_req.get_liked_posts(userId);
                break;
        }
        
        const formatOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        }
        const updatedPosts = (allPosts || []).map(post => ({
            ...post,
            post_datetime: new Date(post.post_datetime).toLocaleString(undefined, formatOptions)
        }));
        
        return updatedPosts
    }

    const deletePost = (postId) => {
        const newPosts = posts.filter(post => post.post_id !== postId);
        setPosts(newPosts);
    }
    return { createPost, getPost, deletePost }
}

export default usePosts;