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

        const getTimeAgo = (postDatetime) => {
            const now = new Date();
            const postDate = new Date(postDatetime);
            const secondsAgo = Math.floor((now - postDate) / 1000);
            
            const thresholds = [
                { divisor: 31536000, unit: "year" },     // 1 year = 31536000 seconds
                { divisor: 2592000, unit: "month" },    // 1 month = 2592000 seconds
                { divisor: 86400, unit: "day" },        // 1 day = 86400 seconds
                { divisor: 3600, unit: "hour" },        // 1 hour = 3600 seconds
                { divisor: 60, unit: "minute" },        // 1 minute = 60 seconds
                { divisor: 1, unit: "second" }          // Fallback to seconds
            ];

            for (const { divisor, unit } of thresholds) {
                if (secondsAgo >= divisor) {
                    const value = Math.floor(secondsAgo / divisor);
                    return `${value} ${unit}${value > 1 ? 's' : ''} ago`;
                }
            }


        }
        
        const updatedPosts = (allPosts || []).map(post => ({
            ...post,
            post_datetime: getTimeAgo(post.post_datetime)
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