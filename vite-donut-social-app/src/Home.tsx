import { useState, useEffect, useRef } from 'react';
import Post from './Post.js';
import { create_post, get_all_posts } from '../api/post.js';

function Home(){
    let userId = sessionStorage.getItem('userId');
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const getPosts = async() => {
            const data = await get_all_posts(userId);
            
            const allPosts = await data.json();
    
            setPosts(allPosts);
        }

        getPosts();        
    }, [])
    
    
    const createPost = async(e) => {
        const { content } = e.target;
        
        const post = {
            content: content.value,
            userId: userId
        }
        
        const serverResponse = await create_post(post);
    }


    return (
        <>
        <h2>User logged in</h2>
        <form id="create-post" onSubmit={createPost}>
            <input name='content' type="text" />
            <button type='submit'>Post</button>
        </form>
        {posts.map((post) => <Post key={post.post_id} userId={userId} post={post} />)}
        </>
    )
}

export default Home;