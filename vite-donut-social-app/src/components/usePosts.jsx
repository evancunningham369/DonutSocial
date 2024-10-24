import { useState, useEffect } from "react";
import * as post_req from '../../api/post.js';

function usePosts(loggedInUserId){

    const [posts, setPosts] = useState([]);

    const createPost = async (event) => {
        const { content } = event.currentTarget;
        const post = {
            content: content.value,
            userId: loggedInUserId
        }
        
        await post_req.create_post(post);
    }

    const getPost = async (selection) => {
        let allPosts;
        switch (selection) {
            case 'general':
                allPosts = await post_req.get_all_posts();
                break;
            case 'following':
                allPosts = await post_req.get_following_posts(loggedInUserId);
                break;
        }
        return allPosts;
    }

    const deletePost = (postId) => {
        const newPosts = posts.filter(post => post.post_id !== postId);
        setPosts(newPosts);
    }
    return { posts, createPost, getPost, deletePost }
}

export default usePosts;