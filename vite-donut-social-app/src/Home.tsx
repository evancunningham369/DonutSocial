import { useState, useEffect, useRef } from 'react';
import Post from './Post.js';
import * as post_req from '../api/post.js';

function Home(){
    let loggedInUserId = sessionStorage.getItem('userId');
    const [posts, setPosts] = useState([]);
    const [selection, setSelection] = useState("");

    useEffect(() => {
        post_req.get_all_posts().then((posts) => setPosts(posts));
    }, [])

    const createPost = async(e) => {
        const { content } = e.target;
        
        const post = {
            content: content.value,
            userId: loggedInUserId
        }
        
        await post_req.create_post(post);
    }

    const getPost = async(e) => {
        const { id } = e.target;
        if(id == selection) return;

        let allPosts;
        switch(id){
            case 'general': 
                allPosts = await post_req.get_all_posts();
                setSelection('general');
                break;
            case 'user': 
                allPosts = await post_req.get_my_posts(loggedInUserId);
                setSelection('user');
                break;
            case 'following': 
                allPosts = await post_req.get_following_posts(loggedInUserId);
                setSelection('following');
                break;
            case 'liked': 
                allPosts = await post_req.get_liked_posts(loggedInUserId);
                setSelection('liked');
        }

        setPosts(allPosts);
    }


    return (
        <>
        <h2>User {loggedInUserId} logged in</h2>
        <h3><a href="/profile">View Profile</a></h3>
        <form id="create-post" onSubmit={createPost}>
            <input name='content' type="text" />
            <button type='submit'>Post</button>
        </form>
        <div className='btn-group'>
            <label className='btn btn-primary'>
                <input id='general' onClick={getPost} type="radio" name='options' defaultChecked/> General Feed
            </label>
            <label className='btn btn-primary'>
                <input id='user' onClick={getPost} type="radio" name='options' /> My Posts
            </label>
            <label className='btn btn-primary'>
                <input id='following' onClick={getPost} type="radio" name='options' /> Following
            </label>
            <label className='btn btn-primary'>
                <input id='liked' onClick={getPost} type="radio" name='options' /> Liked Posts
            </label>
        </div>
        {posts.length == 0 ? 
        <h1>No {selection} posts</h1> :
        posts.map((post) => <Post key={post.post_id} userIdPoster={post.user_id} loggedInUserId={loggedInUserId} post={post} />)}
        </>
    )
}

export default Home;