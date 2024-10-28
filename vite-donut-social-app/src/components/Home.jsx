import { Link } from 'react-router-dom';
import Posts from './Posts.jsx';
import Logout from './useLogout.jsx';
import useProfilePicture from './useProfilePicture.jsx';
import usePosts from './usePosts.jsx';
import { useEffect, useState } from 'react';

function Home() {
    console.log("Home");

    const [loggedInUserId, setLoggedInUserId] = useState(sessionStorage.getItem('userId'));
    const loggedInUsername = sessionStorage.getItem('username');
    const [selection, setSelection] = useState('general');
    const { profilePicture } = useProfilePicture(loggedInUserId);
    const { createPost } = usePosts(loggedInUserId, selection, setSelection);

    const handleGoogleSignIn = async() => {
        const urlParams = new URLSearchParams(window.location.search);
        const userParam = urlParams.get('user');
    
        if(userParam){
            const user = JSON.parse(decodeURIComponent(userParam));
            
            sessionStorage.setItem('userId', user.user_id);
            sessionStorage.setItem('username', user.username);
            setLoggedInUserId(user.user_id);
        }
    }
    
    useEffect(() => {
        if(!loggedInUserId){
            handleGoogleSignIn();
        }
    }, [loggedInUserId]);
    
    if(!loggedInUserId){
        return <div>Loading...</div>
    }
    
    return (
        <div id='home'>
            <div className='post-header'>
                <Logout />
                <div className="profile-info">
                    <Link className='text-decoration-none' to={`/profile/${loggedInUserId}/${loggedInUsername}`}>
                        <img style={{ display: 'inline', width: '100px', height: '100px' }} src={profilePicture} alt="post profile picture" />
                    </Link>
                    <h4>View Profile</h4>
                </div>

                <div className='btn-group button-options' role='group'>
                    <form id="create-post" onSubmit={createPost}>
                        <input name='content' type="text" />
                        <button type='submit'>Post</button>
                    </form>
                    <br />
                    <input id='general' className='btn-check' onChange={(e) => setSelection(e.target.id)} type="radio" name='options' autoComplete='off' defaultChecked />
                    <label className='btn btn-outline-primary' htmlFor='general'>General Feed</label>
                    <input id='following' className='btn-check' onChange={(e) => setSelection(e.target.id)} type="radio" name='options' autoComplete='off' />
                    <label className='btn btn-outline-primary' htmlFor='following'>Following</label>

                </div>

                <h2>{loggedInUsername} logged in</h2>

            </div>
            < Posts postType = {selection}/>
        </div>
    )
}

export default Home;