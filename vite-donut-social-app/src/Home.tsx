import { useState, useEffect, useRef } from 'react';
import Post from './Post.js';
import * as post_req from '../api/post.js';

function Home(){
    let userId = sessionStorage.getItem('userId');
    const [posts, setPosts] = useState([]);
    
    const createPost = async(e) => {
        const { content } = e.target;
        
        const post = {
            content: content.value,
            userId: userId
        }
        
        const serverResponse = await create_post(post);
    }

    const getPost = async(e) => {
        const { id } = e.target;
        let data;
        switch(id){
            case 'general-feed': data = await post_req.get_all_posts();
            break;
            case 'my-posts': data = await post_req.get_my_posts(userId);
            break;
            case 'following': data = await post_req.get_following_posts(userId);
            break;
            case 'liked-posts': data = await post_req.get_liked_posts(userId);
        }

        const allPosts = await data.json();
        
        setPosts(allPosts);
        
    }


    return (
        <>
        <h2>User {userId} logged in</h2>
        <form id="create-post" onSubmit={createPost}>
            <input name='content' type="text" />
            <button type='submit'>Post</button>
        </form>
        <div className='btn-group'>
            <label className='btn btn-primary'>
                <input id='general-feed' onClick={getPost} type="radio" name='options' /> General Feed
            </label>
            <label className='btn btn-primary'>
                <input id='my-posts' onClick={getPost} type="radio" name='options' /> My Posts
            </label>
            <label className='btn btn-primary'>
                <input id='following' onClick={getPost} type="radio" name='options' /> Following
            </label>
            <label className='btn btn-primary'>
                <input id='liked-posts' onClick={getPost} type="radio" name='options' /> Liked Posts
            </label>
        </div>
        {posts.map((post) => <Post key={post.post_id} userId={userId} post={post} />)}
        </>
    )
}

export default Home;