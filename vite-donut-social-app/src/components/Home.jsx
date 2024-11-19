import { Link } from 'react-router-dom';
import Posts from './Posts.jsx';
import Logout from './useLogout.jsx';
import useProfilePicture from './useProfilePicture.jsx';
import usePosts from './usePosts.jsx';
import { useEffect, useState } from 'react';
import Header from './Header.jsx';

function Home() {
    
    const [loggedInUserId, setLoggedInUserId] = useState(sessionStorage.getItem('userId'));
    const loggedInUsername = sessionStorage.getItem('username');
    const [selection, setSelection] = useState('general');
    const { profilePicture } = useProfilePicture(loggedInUserId);
    const { createPost } = usePosts(loggedInUserId, selection, setSelection);

    const maxLength = 160;
    
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
    
    /**
     * Move cursor to end of input
     * Add styling for warning message when character limit is reached
    **/
    const handleInput = (event) => {
        
        const warningText = document.getElementById('warning-text');
        if(event.target.innerText.length >= maxLength){
            event.target.innerText = event.target.innerText.substring(0, maxLength);
            warningText.style.visibility = 'visible';
            
           event.target.style.border = "1px solid red";
           const range = document.createRange();
           const selection = window.getSelection();
           if(event.target.childNodes[0] && event.target.childNodes[0] >= event.target.innerText.length){
            range.setStart(event.target.childNodes[0], event.target.innerText.length);
            range.collapse(true);
            selection.removeAllRanges();
            selection.addRange(range);
           }
        }
        else{
            event.target.style = "";
            warningText.style.visibility = 'hidden';
        }
        
        //Remove line break element that browsers add using contenteditable attribute
        if(event.target.innerHTML == '<br>'){
            event.target.innerHTML = '';
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
        <div className='home-container'>
            {/** BEGIN NAV(LEFT) SECTION */}
            <div className="nav">
                <div className="title-info">
                    <Header />
                    <Logout />
                </div>
                <div id="side-navbar" className='navbar'>
                    <a href={`http://localhost:5173/profile/${loggedInUserId}/${loggedInUsername}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" id="Bold" className='icon' fill='rgba(94, 43, 61, 0.767)' viewBox="0 0 24 24" width="512" height="512"><path d="M18.5,0H5.5A5.506,5.506,0,0,0,0,5.5v13A5.506,5.506,0,0,0,5.5,24h13A5.506,5.506,0,0,0,24,18.5V5.5A5.506,5.506,0,0,0,18.5,0ZM21,18.5A2.5,2.5,0,0,1,18.5,21H18V20A6,6,0,0,0,6,20v1H5.5A2.5,2.5,0,0,1,3,18.5V5.5A2.5,2.5,0,0,1,5.5,3h13A2.5,2.5,0,0,1,21,5.5Z"/><circle cx="12" cy="8.5" r="3.5"/></svg>
                        <span className="nav-text">My Profile</span>
                    </a>
                    <a href='#'>
                    <svg xmlns="http://www.w3.org/2000/svg" id="Isolation_Mode" className='icon' fill='rgba(94, 43, 61, 0.767)' data-name="Isolation Mode" viewBox="0 0 24 24" width="512" height="512"><path d="M23.608,17.013l-2.8-10.1A9.443,9.443,0,0,0,2.486,7.4L.321,17.14a2.5,2.5,0,0,0,2.441,3.042H6.905a5.285,5.285,0,0,0,10.154,0H21.2a2.5,2.5,0,0,0,2.409-3.169Zm-20.223.169,2.03-9.137a6.443,6.443,0,0,1,12.5-.326l2.628,9.463Z"/></svg>
                        <span className="nav-text">Notifications</span>
                    </a>
                    <a href='#'>
                        <svg xmlns="http://www.w3.org/2000/svg" id="Bold" className='icon' fill='rgba(94, 43, 61, 0.767)' viewBox="0 0 24 24" width="512" height="512"><path d="M18.5,0H5.5A5.507,5.507,0,0,0,0,5.5v9A5.507,5.507,0,0,0,5.5,20H6.938l4.1,3.428a1.5,1.5,0,0,0,1.924,0L17.062,20H18.5A5.507,5.507,0,0,0,24,14.5v-9A5.507,5.507,0,0,0,18.5,0ZM21,14.5A2.5,2.5,0,0,1,18.5,17H16.517a1.5,1.5,0,0,0-.962.35L12,20.322,8.445,17.35A1.5,1.5,0,0,0,7.483,17H5.5A2.5,2.5,0,0,1,3,14.5v-9A2.5,2.5,0,0,1,5.5,3h13A2.5,2.5,0,0,1,21,5.5Z"/><path d="M7.5,9h3a1.5,1.5,0,0,0,0-3h-3a1.5,1.5,0,0,0,0,3Z"/><path d="M16.5,11h-9a1.5,1.5,0,0,0,0,3h9a1.5,1.5,0,0,0,0-3Z"/></svg>
                        <span className="nav-text">Messages</span>
                    </a>
                </div>
            </div>
            {/** END NAV(LEFT) SECTION */}

            {/** BEGIN MAIN(CENTER) SECTION */}
            <div className='main-feed'>
                <div className="main-feed-header">
                    <div className='filter-feed'>
                        <input id='general' className='radio' onChange={(e) => setSelection(e.target.id)} type="radio" name='options' autoComplete='off' defaultChecked />
                        <label id='general-label' className='filter-button left-label' htmlFor='general'>General Feed</label>
                        <input id='following' className='radio' onChange={(e) => setSelection(e.target.id)} type="radio" name='options' autoComplete='off' />
                        <label id='following-label' className='filter-button right-label' htmlFor='following'>Following</label>
                    </div>

                    <div className='post-form-group'>
                            <div id='post-profile-picture' className="profile-picture">
                                <Link to={`/profile/${loggedInUserId}/${loggedInUsername}`}>
                                    <img className='profile-picture custom-border-dark' src={profilePicture} alt="post profile picture" />
                                </Link>
                                <span id='post-username'>{loggedInUsername}</span>
                            </div>
                        <form id="create-post" onSubmit={createPost} noValidate>
                            <span name='content' id='contentField' onInput={handleInput} contentEditable='true'></span>
                            <span id="warning-text">Max 160 characters</span>
                            <button className='button' type='submit'>Post</button>
                        </form>
                    </div>

                </div>
                < Posts postType = {selection}/>
            </div>
                {/** END MAIN(CENTER) SECTION */}

                {/** BEGIN NEWS(RIGHT) SECTION */}
                <div className="news">
                    <div className="news-header">
                        <h1>News</h1>
                    </div>
                </div>
                {/** END NEWS(RIGHT) SECTION */}

                <div id="bottom-navbar" className='navbar'>
                    <a href={`http://localhost:5173/profile/${loggedInUserId}/${loggedInUsername}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" id="Bold" className='icon' fill='rgba(94, 43, 61, 0.767)' viewBox="0 0 24 24" width="512" height="512"><path d="M18.5,0H5.5A5.506,5.506,0,0,0,0,5.5v13A5.506,5.506,0,0,0,5.5,24h13A5.506,5.506,0,0,0,24,18.5V5.5A5.506,5.506,0,0,0,18.5,0ZM21,18.5A2.5,2.5,0,0,1,18.5,21H18V20A6,6,0,0,0,6,20v1H5.5A2.5,2.5,0,0,1,3,18.5V5.5A2.5,2.5,0,0,1,5.5,3h13A2.5,2.5,0,0,1,21,5.5Z"/><circle cx="12" cy="8.5" r="3.5"/></svg>
                        <span className="nav-text">My Profile</span>
                    </a>
                    <a href='#'>
                    <svg xmlns="http://www.w3.org/2000/svg" id="Isolation_Mode" className='icon' fill='rgba(94, 43, 61, 0.767)' data-name="Isolation Mode" viewBox="0 0 24 24" width="512" height="512"><path d="M23.608,17.013l-2.8-10.1A9.443,9.443,0,0,0,2.486,7.4L.321,17.14a2.5,2.5,0,0,0,2.441,3.042H6.905a5.285,5.285,0,0,0,10.154,0H21.2a2.5,2.5,0,0,0,2.409-3.169Zm-20.223.169,2.03-9.137a6.443,6.443,0,0,1,12.5-.326l2.628,9.463Z"/></svg>
                        <span className="nav-text">Notifications</span>
                    </a>
                    <a href='#'>
                        <svg xmlns="http://www.w3.org/2000/svg" id="Bold" className='icon' fill='rgba(94, 43, 61, 0.767)' viewBox="0 0 24 24" width="512" height="512"><path d="M18.5,0H5.5A5.507,5.507,0,0,0,0,5.5v9A5.507,5.507,0,0,0,5.5,20H6.938l4.1,3.428a1.5,1.5,0,0,0,1.924,0L17.062,20H18.5A5.507,5.507,0,0,0,24,14.5v-9A5.507,5.507,0,0,0,18.5,0ZM21,14.5A2.5,2.5,0,0,1,18.5,17H16.517a1.5,1.5,0,0,0-.962.35L12,20.322,8.445,17.35A1.5,1.5,0,0,0,7.483,17H5.5A2.5,2.5,0,0,1,3,14.5v-9A2.5,2.5,0,0,1,5.5,3h13A2.5,2.5,0,0,1,21,5.5Z"/><path d="M7.5,9h3a1.5,1.5,0,0,0,0-3h-3a1.5,1.5,0,0,0,0,3Z"/><path d="M16.5,11h-9a1.5,1.5,0,0,0,0,3h9a1.5,1.5,0,0,0,0-3Z"/></svg>
                        <span className="nav-text">Messages</span>
                    </a>
                </div>
        </div>
    )
}

export default Home;