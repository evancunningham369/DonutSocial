import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Post from './Post.js';
import * as post_req from '../api/post.js';
import donut from '/src/donut.jpg';
import { get_profile_picture } from '../api/account.js';

function Home(){
    let loggedInUserId = sessionStorage.getItem('userId');
    let loggedInUsername = sessionStorage.getItem('username');
    const [posts, setPosts] = useState([]);
    const [selection, setSelection] = useState("");
    const [profilePicture, setProfilePicture] = useState();
    
    async function getProfilePicture(){
        try {
            const url = await get_profile_picture(loggedInUserId);
            if(url == null) throw TypeError
            
            setProfilePicture(url);
        } catch (error) {
            setProfilePicture(donut);
        }
    }
    getProfilePicture();
    
    useEffect(() => {
        post_req.get_all_posts().then((posts) => setPosts(posts));
    },[])

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

    return (
    <div id='home'>
        <div className='post-header'>
            <div className="profile-info">
                <h3>
                    <Link className='text-decoration-none' to='/profile' state={{userId: loggedInUserId, profilePicture: profilePicture}}>View Profile</Link>
                </h3>
            </div>
            
            <div className='btn-group button-options' role='group'>
                <input id='general' className='btn-check' onClick={getPost} type="radio" name='options' autoComplete='off' defaultChecked/>
                <label className='btn btn-outline-primary' htmlFor='general'>General Feed</label>
                <input id='following' className='btn-check' onClick={getPost} type="radio" name='options' autoComplete='off' />
                <label className='btn btn-outline-primary' htmlFor='following'>Following</label>

                <form id="create-post" onSubmit={createPost}>
                    <input name='content' type="text" />
                    <button type='submit'>Post</button>
                </form>
            </div>

            <h2>{loggedInUsername} logged in</h2>

        </div>
        <div className="posts">
            {posts.length == 0 ? 
            <h1>No {selection} posts</h1> :
            posts.map((post) => <Post key={post.post_id} userIdPoster={post.user_id} deletePost={deletePost} profilePicture={profilePicture} loggedInUserId={loggedInUserId} initialPost={post} />)}
        </div>
    </div>
    )
}

export default Home;