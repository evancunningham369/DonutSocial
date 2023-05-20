import { useState, useEffect, useRef } from 'react';
import Post from './Post.js';
import * as post_req from '../api/post.js';

function Home(){
    let userId = sessionStorage.getItem('userId');
    const [posts, setPosts] = useState([]);
    const [selection, setSelection] = useState("");
    const [liked, setLiked] = useState(false);
    
    useEffect(() => {
        post_req.get_all_posts().then((posts) => setPosts(posts));
    }, [])

    const createPost = async(e) => {
        const { content } = e.target;
        
        const post = {
            content: content.value,
            userId: userId
        }
        
        await post_req.create_post(post);
    }

    const getPost = async(e) => {
        setLiked(false);
        const { id } = e.target;
        if(id == selection) return;

        let allPosts;
        switch(id){
            case 'general-feed': 
            allPosts = await post_req.get_all_posts();
            setSelection('general-feed');
            break;
            case 'my-posts': allPosts = await post_req.get_my_posts(userId);
            setSelection('my-posts');
            break;
            case 'following': allPosts = await post_req.get_following_posts(userId);
            setSelection('following');
            break;
            case 'liked-posts': 
            allPosts = await post_req.get_liked_posts(userId);
            setLiked(true);
            setSelection('liked-posts');
        }
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
                <input id='general-feed' onClick={getPost} type="radio" name='options' defaultChecked/> General Feed
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
        {posts.map((post) => <Post key={post.post_id} userId={userId} post={post} liked={liked} />)}
        </>
    )
}

export default Home;