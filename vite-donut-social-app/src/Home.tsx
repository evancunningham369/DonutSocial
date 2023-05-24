import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Post from './Post.js';
import * as post_req from '../api/post.js';
import donut from '/src/donut.jpg';
import { get_profile_picture } from '../api/account.js';

function Home(){
    let loggedInUserId = sessionStorage.getItem('userId');
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

    return (
        <>
        <h2>User {loggedInUserId} logged in</h2>
        <h3>
            <Link to='/profile' state={{userId: loggedInUserId, profilePicture: profilePicture}}>View Profile</Link>
        </h3>
        <form id="create-post" onSubmit={createPost}>
            <input name='content' type="text" />
            <button type='submit'>Post</button>
        </form>
        <div className='btn-group'>
            <label className='btn btn-primary'>
                <input id='general' onClick={getPost} type="radio" name='options' defaultChecked/> General Feed
            </label>
            <label className='btn btn-primary'>
                <input id='following' onClick={getPost} type="radio" name='options' /> Following
            </label>
        </div>
        {posts.length == 0 ? 
        <h1>No {selection} posts</h1> :
        posts.map((post) => <Post key={post.post_id} userIdPoster={post.user_id} profilePicture={profilePicture} loggedInUserId={loggedInUserId} post={post} />)}
        </>
    )
}

export default Home;