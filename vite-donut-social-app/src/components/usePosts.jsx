import { useState, useEffect } from "react";
import * as post_req from '../../api/post.js';

function usePosts(){

    const [posts, setPosts] = useState([]);
    
    useEffect(() => {
        post_req.get_all_posts().then((posts) => setPosts(posts));
    }, [])

    const createPost = async (event) => {
        const { content } = event.currentTarget;

        const post = {
            content: content.value,
            userId: loggedInUserId
        }

        await post_req.create_post(post);
    }

    const getPost = async (event) => {
        const { id } = event.currentTarget;
        if (id == selection) return;

        let allPosts;
        switch (id) {
            case 'general':
                allPosts = await post_req.get_all_posts();
                setSelection('general');
                break;
            case 'following':
                allPosts = await post_req.get_following_posts(loggedInUserId);
                setSelection('following');
                break;
        }

        setPosts(allPosts);
    }

    const deletePost = (postId) => {
        const newPosts = posts.filter(post => post.post_id !== postId);
        setPosts(newPosts);
    }
    return { posts, createPost, getPost, deletePost }
}

export default usePosts;