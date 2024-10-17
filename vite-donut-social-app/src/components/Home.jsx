import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Post from './Post.jsx';
import useProfilePicture from './useProfilePicture.jsx';
import usePosts from './usePosts.jsx';

function Home() {
    let loggedInUserId = sessionStorage.getItem('userId');
    let loggedInUsername = sessionStorage.getItem('username');
    
    const [selection, setSelection] = useState("");

    const { profilePicture } = useProfilePicture();
    const { posts, createPost, getPost, deletePost } = usePosts();
    
    

    return (
        <div id='home'>
            <div className='post-header'>
                <div className="profile-info">
                    <Link className='text-decoration-none' to='/profile' state={{ userId: loggedInUserId, profilePicture: profilePicture }}>
                        <img style={{ display: 'inline', width: '100px', height: '100px' }} src={profilePicture} alt="post profile picture" />
                    </Link>
                    <h4>View Profile</h4>
                </div>

                <div className='btn-group button-options' role='group'>
                    <input id='general' className='btn-check' onClick={getPost} type="radio" name='options' autoComplete='off' defaultChecked />
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